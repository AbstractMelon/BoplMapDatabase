const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { mapMakerDir } = require('../database');
const { trackEvent } = require('./analytics');

const router = express.Router();

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 250 * 1024 * 1024,
    },
});

// Helper function to write version.json
function writeVersionFile(versionDir, versionData) {
    const versionFilePath = path.join(versionDir, 'version.json');
    fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
}

// Route to download a specific version or file
router.get('/download/:versionId', (req, res) => {
    const versionId = req.params.versionId;
    const versionDir = path.join(mapMakerDir, `v${versionId}`);
    const fileName = req.query.file; // Get the specific file name from query

    // Check if the version directory exists
    if (!fs.existsSync(versionDir)) {
        return res.status(404).json({ message: 'Version not found' });
    }

    // If a specific file is provided, check if it exists
    if (fileName) {
        const filePath = path.join(versionDir, fileName);

        if (fs.existsSync(filePath)) {
            return res.download(filePath, err => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Error downloading file' });
                }
                trackEvent('mapMakerDownload', { fileName });
            });
        } else {
            return res.status(404).json({ message: 'File not found' });
        }
    }

    return res.status(400).json({ message: 'No file specified for download' });
});

// Route to upload files
router.post(
    '/upload',
    isAuthenticated,
    isAdmin,
    upload.fields([
        { name: 'zipFile1', maxCount: 1 },
        { name: 'zipFile2', maxCount: 1 },
        { name: 'exeFile', maxCount: 1 },
        { name: 'tarFile', maxCount: 1 },
    ]),
    (req, res) => {
        const versionId = req.body.versionId;
        const changelog = req.body.changelog;

        if (!versionId || !changelog) {
            return res
                .status(400)
                .json({ message: 'Missing versionId or changelog' });
        }

        const versionDir = path.join(mapMakerDir, `v${versionId}`);

        // Create version directory
        if (!fs.existsSync(versionDir)) {
            fs.mkdirSync(versionDir, { recursive: true });
        }

        // Rename and save uploaded files
        if (req.files.zipFile1 && req.files.zipFile1[0]) {
            const destPath = path.join(
                versionDir,
                `Map Maker Windows v${versionId}.zip`,
            );
            fs.renameSync(req.files.zipFile1[0].path, destPath);
        }

        if (req.files.zipFile2 && req.files.zipFile2[0]) {
            const destPath = path.join(
                versionDir,
                `Map Maker Linux v${versionId}.zip`,
            );
            fs.renameSync(req.files.zipFile2[0].path, destPath);
        }

        if (req.files.exeFile && req.files.exeFile[0]) {
            const destPath = path.join(versionDir, 'Map Maker Windows.exe');
            fs.renameSync(req.files.exeFile[0].path, destPath);
        }

        if (req.files.tarFile && req.files.tarFile[0]) {
            const destPath = path.join(versionDir, 'Map Maker.tar.xz');
            fs.renameSync(req.files.tarFile[0].path, destPath);
        }

        // Write version.json
        const versionData = {
            versionId,
            changelog,
            files: [
                `Map Maker Windows v${versionId}.zip`,
                `Map Maker Linux v${versionId}.zip`,
                'Map Maker Windows.exe',
                'Map Maker.tar.xz',
            ],
        };
        writeVersionFile(versionDir, versionData);

        res.status(201).json({
            message: 'Files uploaded successfully',
            versionData,
        });
    },
);

router.get('/latest', (req, res) => {
    const versionDirs = fs
        .readdirSync(mapMakerDir)
        .filter(dir => dir.startsWith('v')); // Filter directories that start with 'v'

    if (versionDirs.length === 0) {
        return res.status(404).json({ message: 'No versions available' });
    }

    // Sort versions and get the latest one
    const latestVersionDir = versionDirs.sort((a, b) => {
        const versionA = a.replace('v', '').split('.').map(Number); // Split on '.' and convert to numbers
        const versionB = b.replace('v', '').split('.').map(Number);

        for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
            const numA = versionA[i] || 0; // Treat missing minor/patch versions as 0
            const numB = versionB[i] || 0;
            if (numA !== numB) {
                return numB - numA; // Sort descending
            }
        }
        return 0;
    })[0];

    const latestVersionPath = path.join(mapMakerDir, latestVersionDir);
    const versionInfoPath = path.join(latestVersionPath, 'version.json');

    if (!fs.existsSync(versionInfoPath)) {
        return res.status(404).json({ message: 'Version info not found' });
    }

    const latestVersionInfo = JSON.parse(fs.readFileSync(versionInfoPath));

    // Construct download links
    const downloadLinks = {
        windowsZip: `/api/map-maker/download/${latestVersionInfo.versionId}?file=Map Maker Windows v${latestVersionInfo.versionId}.zip`,
        linuxZip: `/api/map-maker/download/${latestVersionInfo.versionId}?file=Map Maker Linux v${latestVersionInfo.versionId}.zip`,
        exe: `/api/map-maker/download/${latestVersionInfo.versionId}?file=Map Maker Windows.exe`,
        tar: `/api/map-maker/download/${latestVersionInfo.versionId}?file=Map Maker.tar.xz`,
    };

    res.json({
        latestVersion: latestVersionInfo.versionId,
        changelog: latestVersionInfo.changelog,
        downloadLinks,
    });
});

// Route to get the map maker base info
router.get('/', (req, res) => {
    const versions = fs.readdirSync(mapMakerDir).map(dir => {
        const versionDir = path.join(mapMakerDir, dir);
        const versionInfo = fs.existsSync(path.join(versionDir, 'version.json'))
            ? JSON.parse(fs.readFileSync(path.join(versionDir, 'version.json')))
            : null;

        return {
            version: dir.replace('v', ''),
            info: versionInfo,
        };
    });

    res.json({ versions });
});

module.exports = router;
