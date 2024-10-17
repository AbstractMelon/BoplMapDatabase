const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const archiver = require('archiver');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { updateIndex, mapsDir, modIconsDir, indexPath, logLogs, writeUser } = require('../database');

const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
    const maps = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];

    const { developer, name, type, date } = req.query;
    let filteredMaps = maps;

    if (developer) {
        filteredMaps = filteredMaps.filter((map) =>
            map.MapDeveloper.toLowerCase().includes(developer.toLowerCase())
        );
    }
    if (name) {
        filteredMaps = filteredMaps.filter((map) =>
            map.MapName.toLowerCase().includes(name.toLowerCase())
        );
    }
    if (type) {
        filteredMaps = filteredMaps.filter(
            (map) => map.MapType.toLowerCase() === type.toLowerCase()
        );
    }
    if (date) {
        filteredMaps = filteredMaps.filter((map) => {
            const mapDate = new Date(map.DateCreated)
                .toISOString()
                .split("T")[0];
            return mapDate === date;
        });
    }

    res.json(filteredMaps);
});

router.get('/download/:mapid', (req, res) => {
    const { mapid } = req.params;
    const mapFilePath = path.join(mapsDir, `${mapid}.zip`);

    if (fs.existsSync(mapFilePath)) {
        const indexData = fs.existsSync(indexPath)
            ? JSON.parse(fs.readFileSync(indexPath))
            : [];
        const map = indexData.find((map) => map.MapUUID === mapid);

        if (map) {
            const mapName = map.MapName || "download";
            const fileName = `${mapName}.zip`;

            res.download(mapFilePath, fileName, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: "Download failed" });
                } else {
                    map.downloadCount = (map.downloadCount || 0) + 1;
                    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
                    logLogs("map_download", { mapUUID: mapid });
                }
            });
        } else {
            res.status(404).json({ message: "Map not found" });
        }
    } else {
        res.status(404).json({ message: "Map not found" });
    }
});

router.get('/assets/mods/:uuid', (req, res) => {
    const { uuid } = req.params;
    const imagePath = path.join(modIconsDir, `${uuid}.png`);
    const fallbackImagePath = path.join(__dirname, "../../assets/fallback/mod-icon.png");

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Image not found: ${imagePath}`);
            return res.status(404).json({
                message: 'Image not found',
                attemptedPath: imagePath,
                fallbackImage: fallbackImagePath
            });
        }
        res.sendFile(imagePath);
    });
});

router.post('/upload', isAuthenticated, upload.single('map'), async (req, res) => {
    try {
        const extractedPath = path.join(__dirname, "uploads", uuidv4());
        await fs
            .createReadStream(req.file.path)
            .pipe(unzipper.Extract({ path: extractedPath }))
            .promise();

        const metadataPath = path.join(extractedPath, "MetaData.json");

        if (fs.existsSync(metadataPath)) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath));
            const indexData = fs.existsSync(indexPath)
                ? JSON.parse(fs.readFileSync(indexPath))
                : [];

            if (indexData.some((map) => map.MapUUID === metadata.MapUUID)) {
                return res.status(400).json({ message: "Map already exists" });
            }

            metadata.MapDeveloper = req.user.username;

            const mapFileName = `${metadata.MapUUID}.zip`;
            const mapStoragePath = path.join(mapsDir, mapFileName);

            fs.renameSync(req.file.path, mapStoragePath);

            const files = await fs.promises.readdir(extractedPath);
            const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');

            if (pngFiles.length === 1) {
                const iconPath = path.join(extractedPath, pngFiles[0]);
                const targetIconPath = path.join(modIconsDir, `${metadata.MapUUID}.png`);
                fs.renameSync(iconPath, targetIconPath);
            }

            const outputZipPath = mapStoragePath.replace('.zip', '_updated.zip');
            const output = fs.createWriteStream(outputZipPath);
            const archive = archiver('zip');

            output.on('close', () => {
                fs.renameSync(outputZipPath, mapStoragePath);
            });

            archive.pipe(output);

            for (const file of files) {
                const filePath = path.join(extractedPath, file);
                if (file !== pngFiles[0]) {
                    archive.file(filePath, { name: file });
                }
            }

            await archive.finalize();

            updateIndex(metadata);

            const user = req.user;
            user.uploadedMapUUIDs = user.uploadedMapUUIDs || [];
            user.uploadedMapUUIDs.push(metadata.MapUUID);
            writeUser(user.username, user);

            fs.rmSync(extractedPath, { recursive: true, force: true });

            logLogs("map_upload", { mapUUID: metadata.MapUUID });

            res.json({ message: "Map uploaded successfully" });
        } else {
            res.status(400).json({
                message: "MetaData.json not found in the uploaded map",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Upload failed",
            error: err.message,
        });
    }
});

router.delete('/:mapUUID', isAuthenticated, isAdmin, (req, res) => {
    const mapFilePath = path.join(mapsDir, `${req.params.mapUUID}.zip`);

    if (fs.existsSync(mapFilePath)) {
        fs.unlinkSync(mapFilePath);

        const indexData = fs.existsSync(indexPath)
            ? JSON.parse(fs.readFileSync(indexPath))
            : [];
        const updatedIndex = indexData.filter(
            (map) => map.MapUUID !== req.params.mapUUID
        );
        fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2));

        res.json({ message: "Map deleted successfully" });
    } else {
        res.status(404).json({ message: "Map not found" });
    }
});

router.put('/:MapUUID', isAuthenticated, isAdmin, (req, res) => {
    const mapUUID = req.params.MapUUID;
    const updatedMapData = req.body;
    const indexData = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];

    const mapIndex = indexData.findIndex((map) => map.MapUUID === mapUUID);
    if (mapIndex === -1) {
        return res.status(404).json({ message: "Map not found" });
    }

    indexData[mapIndex] = { ...indexData[mapIndex], ...updatedMapData };
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

    logLogs("Updated map", { mapUUID, updatedMapData });

    res.json({ message: "Map updated successfully" });
});

module.exports = router;