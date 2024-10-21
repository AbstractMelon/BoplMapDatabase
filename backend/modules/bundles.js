const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const router = express.Router();
const { mapsDir, indexPath, logLogs, bundlesDir } = require('../database');

// Endpoint to create a bundle
router.post('/create', (req, res) => {
    const { mapUUIDs, bundleName } = req.body;

    if (!mapUUIDs || mapUUIDs.length === 0 || !bundleName) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    console.log("Received mapUUIDs:", mapUUIDs);
    console.log("Received bundleName:", bundleName);

    let indexData;

    try {
        if (fs.existsSync(indexPath)) {
            const rawData = fs.readFileSync(indexPath);
            indexData = JSON.parse(rawData);
        } else {
            indexData = [];
        }
    } catch (error) {
        console.error("Error reading index file:", error);
        return res.status(500).json({ message: "Failed to read index file." });
    }
    
    
    const mapsToBundle = indexData.filter((map) => mapUUIDs.includes(map.MapUUID));

    if (mapsToBundle.length !== mapUUIDs.length) {
        return res.status(404).json({ message: "One or more maps not found" });
    }

    const bundleDir = path.join(bundlesDir, `${bundleName}.zip`);
    console.log("Bundle Directory Path:", bundleDir);
    
    const output = fs.createWriteStream(bundleDir);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    output.on('close', () => {
        logLogs('bundle_created', { bundleName, mapUUIDs });
        res.json({ message: "Bundle created successfully", bundleName });
    });

    archive.on('error', (err) => {
        res.status(500).json({ message: "Failed to create bundle", error: err.message });
    });

    archive.pipe(output);

    mapsToBundle.forEach((map) => {
        const mapFilePath = path.join(mapsDir, `${map.MapUUID}.zip`);
        if (fs.existsSync(mapFilePath)) {
            archive.file(mapFilePath, { name: `${map.MapName}.zip` });
        }
    });

    archive.finalize();
});

// Endpoint to download a bundle
router.get('/download/:bundleName', (req, res) => {
    const { bundleName } = req.params;
    const bundleFilePath = path.join(bundlesDir, `${bundleName}.zip`);

    if (fs.existsSync(bundleFilePath)) {
        res.download(bundleFilePath, `${bundleName}.zip`, (err) => {
            if (err) {
                res.status(500).json({ message: "Download failed" });
            } else {
                logLogs("bundle_download", { bundleName });
            }
        });
    } else {
        res.status(404).json({ message: "Bundle not found" });
    }
});

// Endpoint to view all bundles
router.get('/', (req, res) => {
    fs.readdir(bundlesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: "Unable to read bundles directory" });
        }
        const bundles = files.filter(file => file.endsWith('.zip')).map(file => file.replace('.zip', ''));
        res.json({ bundles });
    });
});

module.exports = router;