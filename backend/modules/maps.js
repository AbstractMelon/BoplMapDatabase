const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const axios = require('axios');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
    updateIndex,
    mapsDir,
    modIconsDir,
    indexPath,
    logLogs,
    writeUser,
} = require('../database');
const { trackEvent } = require('./analytics');

const upload = multer({ dest: 'uploads/' });

// Load environment variables
require('dotenv').config({
    path: require('path').resolve(__dirname, '../../.env'),
});

// Function to check if an image exists (mocked for example)
async function imageExists(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        console.error(`Failed to check image at ${url}: ${error}`);
        return false;
    }
}

// Send the webhook
async function sendWebhook(thumbnailUrl) {
    const imageAvailable = await imageExists(thumbnailUrl);

    if (!imageAvailable) {
        console.warn(`Thumbnail not found, using fallback image.`);
        webhookPayload.embeds[0].image.url = fallbackThumbnailUrl;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload),
        });

        if (!response.ok) {
            console.error(
                `Webhook send failed: ${response.status} - ${response.statusText}`,
            );
        } else {
            console.log(`Webhook sent successfully.`);
        }
    } catch (error) {
        console.error(`Error sending webhook: ${error}`);
    }
}

router.get('/', (req, res) => {
    const maps = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];

    const { developer, name, type, date } = req.query;
    let filteredMaps = maps;

    if (developer) {
        filteredMaps = filteredMaps.filter(map =>
            map.MapDeveloper.toLowerCase().includes(developer.toLowerCase()),
        );
    }
    if (name) {
        filteredMaps = filteredMaps.filter(map =>
            map.MapName.toLowerCase().includes(name.toLowerCase()),
        );
    }
    if (type) {
        filteredMaps = filteredMaps.filter(
            map => map.MapType.toLowerCase() === type.toLowerCase(),
        );
    }
    if (date) {
        filteredMaps = filteredMaps.filter(map => {
            const mapDate = new Date(map.DateCreated)
                .toISOString()
                .split('T')[0];
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
        const map = indexData.find(map => map.MapUUID === mapid);

        if (map) {
            const mapName = map.MapName || 'download';
            const fileName = `${mapName}.zip`;

            res.download(mapFilePath, fileName, err => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Download failed' });
                } else {
                    map.downloadCount = (map.downloadCount || 0) + 1;
                    fs.writeFileSync(
                        indexPath,
                        JSON.stringify(indexData, null, 2),
                    );
                    trackEvent('mapDownload');
                    logLogs('map_download', { mapUUID: mapid });
                }
            });
        } else {
            res.status(404).json({ message: 'Map not found' });
        }
    } else {
        res.status(404).json({ message: 'Map not found' });
    }
});

router.get('/assets/mods/:uuid', (req, res) => {
    const { uuid } = req.params;
    const imagePath = path.join(modIconsDir, `${uuid}.png`);
    const fallbackImagePath = path.join(
        __dirname,
        '../../assets/fallback/mod-icon.png',
    );

    fs.access(imagePath, fs.constants.F_OK, err => {
        if (err) {
            return res.sendFile(fallbackImagePath);
        }
        res.sendFile(imagePath);
    });
});

router.post(
    '/upload',
    isAuthenticated,
    upload.single('map'),
    async (req, res) => {
        try {
            const extractedPath = path.join(__dirname, 'uploads', uuidv4());
            await fs
                .createReadStream(req.file.path)
                .pipe(unzipper.Extract({ path: extractedPath }))
                .promise();

            const metadataPath = path.join(extractedPath, 'MetaData.json');

            if (fs.existsSync(metadataPath)) {
                const metadata = JSON.parse(fs.readFileSync(metadataPath));
                const indexData = fs.existsSync(indexPath)
                    ? JSON.parse(fs.readFileSync(indexPath))
                    : [];

                if (indexData.some(map => map.MapUUID === metadata.MapUUID)) {
                    return res
                        .status(400)
                        .json({ message: 'Map already exists' });
                }

                metadata.MapDeveloper = req.user.username;

                // Check for .lua or .blua files
                const files = await fs.promises.readdir(extractedPath);
                const luaFiles = files.filter(
                    file =>
                        path.extname(file).toLowerCase() === '.lua' ||
                        path.extname(file).toLowerCase() === '.blua',
                );

                // Set LuaMap to true if there are Lua files
                metadata.LuaMap = luaFiles.length > 0;

                const mapFileName = `${metadata.MapUUID}.zip`;
                const mapStoragePath = path.join(mapsDir, mapFileName);
                const MapDescription = metadata.MapDescription || '';

                fs.renameSync(req.file.path, mapStoragePath);

                const pngFiles = files.filter(
                    file => path.extname(file).toLowerCase() === '.png',
                );

                if (pngFiles.length === 1) {
                    const iconPath = path.join(extractedPath, pngFiles[0]);
                    const targetIconPath = path.join(
                        modIconsDir,
                        `${metadata.MapUUID}.png`,
                    );
                    fs.renameSync(iconPath, targetIconPath);
                }

                const outputZipPath = mapStoragePath.replace(
                    '.zip',
                    '_updated.zip',
                );
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

                logLogs('map_upload', { mapUUID: metadata.MapUUID });

                // Prepare and send the webhook
                const webhookUrl = process.env.WEBHOOK;
                const thumbnailUrl = `${process.env.CDN}${metadata.MapUUID}`;
                const fallbackThumbnailUrl = `${process.env.CDN}placeholder`;

                // Role mention
                const roleMention = `<@&1298674559867818065>`;

                const webhookPayload = {
                    content: 'New map uploaded! ' + roleMention,
                    embeds: [
                        {
                            title: metadata.MapName || 'Unknown Map',
                            description: `${
                                MapDescription || 'No description available.'
                            }\n\nAuthor: ${
                                metadata.MapDeveloper || 'Unknown author.'
                            }`,
                            image: {
                                url: thumbnailUrl,
                            },
                            footer: {
                                text: `Made by abstractmelon with love - Map UUID: (${metadata.MapUUID}`,
                            },
                        },
                    ],
                };

                // Call the function to send the webhook
                sendWebhook(thumbnailUrl);

                await axios.post(webhookUrl, webhookPayload);

                res.json({ message: 'Map uploaded successfully' });
            } else {
                res.status(400).json({
                    message: 'MetaData.json not found in the uploaded map',
                });
            }
        } catch (err) {
            res.status(500).json({
                message: 'Upload failed',
                error: err.message,
            });
        }
    },
);

router.delete('/:mapUUID', isAuthenticated, isAdmin, (req, res) => {
    const mapFilePath = path.join(mapsDir, `${req.params.mapUUID}.zip`);

    if (fs.existsSync(mapFilePath)) {
        fs.unlinkSync(mapFilePath);

        const indexData = fs.existsSync(indexPath)
            ? JSON.parse(fs.readFileSync(indexPath))
            : [];
        const updatedIndex = indexData.filter(
            map => map.MapUUID !== req.params.mapUUID,
        );
        fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2));

        res.json({ message: 'Map deleted successfully' });
    } else {
        res.status(404).json({ message: 'Map not found' });
    }
});

router.put('/:MapUUID', isAuthenticated, isAdmin, (req, res) => {
    const mapUUID = req.params.MapUUID;
    const updatedMapData = req.body;
    const indexData = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];

    const mapIndex = indexData.findIndex(map => map.MapUUID === mapUUID);
    if (mapIndex === -1) {
        return res.status(404).json({ message: 'Map not found' });
    }

    indexData[mapIndex] = { ...indexData[mapIndex], ...updatedMapData };
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

    logLogs('Updated map', { mapUUID, updatedMapData });

    res.json({ message: 'Map updated successfully' });
});

module.exports = router;
