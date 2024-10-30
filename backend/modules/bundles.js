const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const router = express.Router();
const {
    mapsDir,
    indexPath,
    logLogs,
    bundlesDir,
    bundleIndexPath,
} = require('../database');
const { isAuthenticated } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Endpoint to create a bundle
router.post('/create', isAuthenticated, (req, res) => {
    const { mapUUIDs, bundleName, description } = req.body;

    if (!mapUUIDs || mapUUIDs.length === 0 || !bundleName) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    console.log('Received mapUUIDs:', mapUUIDs);
    console.log('Received bundleName:', bundleName);

    let indexData;

    // Retrieve map data using indexPath
    try {
        if (fs.existsSync(indexPath)) {
            const rawData = fs.readFileSync(indexPath);
            indexData = JSON.parse(rawData);
        } else {
            return res.status(404).json({ message: 'Index file not found' });
        }
    } catch (error) {
        console.error('Error reading index file:', error);
        return res.status(500).json({ message: 'Failed to read index file.' });
    }

    // Filter maps based on provided UUIDs
    const mapsToBundle = indexData.filter(map =>
        mapUUIDs.includes(map.MapUUID),
    );
    console.log('Maps to bundle: ', mapsToBundle);

    if (mapsToBundle.length !== mapUUIDs.length) {
        return res.status(404).json({ message: 'One or more maps not found' });
    }

    const bundleDir = path.join(bundlesDir, `${bundleName}.zip`);
    console.log('Bundle Directory Path:', bundleDir);

    try {
        if (!fs.existsSync(bundlesDir)) {
            throw new Error(`Directory does not exist: ${bundlesDir}`);
        }

        if (fs.existsSync(bundleDir)) {
            console.warn(`Warning: The bundle already exists at ${bundleDir}.`);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        return res
            .status(500)
            .json({ message: 'Error checking bundle directory.' });
    }

    const output = fs.createWriteStream(bundleDir);
    const archive = archiver('zip', {
        zlib: { level: 9 },
    });

    output.on('close', () => {
        const bundleMetadata = {
            BundleUUID: uuidv4(),
            BundleName: bundleName,
            Description: description || '',
            Developer: req.user.username,
            CreationDate: new Date().toISOString(),
            LikeCount: 0,
            DownloadCount: 0,
            MapList: mapUUIDs,
            Icon: '',
        };

        // Append bundle metadata to the index
        let bundleIndexData;
        try {
            if (fs.existsSync(bundleIndexPath)) {
                const rawData = fs.readFileSync(bundleIndexPath);
                bundleIndexData = JSON.parse(rawData);
            } else {
                bundleIndexData = [];
            }

            bundleIndexData.push(bundleMetadata);
            fs.writeFileSync(
                bundleIndexPath,
                JSON.stringify(bundleIndexData, null, 2),
            );
        } catch (error) {
            console.error('Error updating bundle index file:', error);
            return res
                .status(500)
                .json({ message: 'Failed to update bundle index file.' });
        }

        logLogs('bundle_created', { bundleName, mapUUIDs });
        res.json({ message: 'Bundle created successfully', bundleName });
    });

    archive.on('error', err => {
        res.status(500).json({
            message: 'Failed to create bundle',
            error: err.message,
        });
    });

    archive.pipe(output);

    mapsToBundle.forEach(map => {
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
        // Update download count
        let bundleIndexData;
        try {
            const rawData = fs.readFileSync(bundleIndexPath);
            bundleIndexData = JSON.parse(rawData);
            const bundleIndex = bundleIndexData.findIndex(
                bundle => bundle.BundleName === bundleName,
            );
            if (bundleIndex > -1) {
                bundleIndexData[bundleIndex].DownloadCount += 1;
                fs.writeFileSync(
                    bundleIndexPath,
                    JSON.stringify(bundleIndexData, null, 2),
                );
            }
        } catch (error) {
            console.error('Error updating download count:', error);
        }

        res.download(bundleFilePath, `${bundleName}.zip`, err => {
            if (err) {
                res.status(500).json({ message: 'Download failed' });
            } else {
                logLogs('bundle_download', { bundleName });
            }
        });
    } else {
        res.status(404).json({ message: 'Bundle not found' });
    }
});

// Endpoint to view all bundles
router.get('/', (req, res) => {
    let bundleIndexData;
    try {
        bundleIndexData = fs.existsSync(bundleIndexPath)
            ? JSON.parse(fs.readFileSync(bundleIndexPath))
            : [];
    } catch (error) {
        console.error('Error reading bundle index file:', error);
        return res
            .status(500)
            .json({ message: 'Failed to read bundle index file.' });
    }

    res.json(bundleIndexData);
});

// Endpoint to dynamically create and download a bundle with all maps
router.get('/download-all', isAuthenticated, (req, res) => {
    let indexData;

    // Retrieve map data using indexPath
    try {
        if (fs.existsSync(indexPath)) {
            const rawData = fs.readFileSync(indexPath);
            indexData = JSON.parse(rawData);
        } else {
            return res.status(404).json({ message: 'Index file not found' });
        }
    } catch (error) {
        console.error('Error reading index file:', error);
        return res.status(500).json({ message: 'Failed to read index file.' });
    }

    const mapsToBundle = indexData; // Include all maps
    console.log('Maps to bundle: ', mapsToBundle);

    const archive = archiver('zip', {
        zlib: { level: 9 }, // Maximum compression
    });

    // Set the headers for downloading the zip file
    res.attachment('all_maps_bundle.zip');

    archive.on('error', err => {
        console.error('Failed to create archive:', err);
        return res.status(500).json({
            message: 'Failed to create bundle',
            error: err.message,
        });
    });

    // Pipe the archive directly to the response
    archive.pipe(res);

    // Add each map file to the zip
    mapsToBundle.forEach(map => {
        const mapFilePath = path.join(mapsDir, `${map.MapUUID}.zip`);
        if (fs.existsSync(mapFilePath)) {
            archive.file(mapFilePath, { name: `${map.MapName}.zip` });
        }
    });

    // Increment download counts for each map
    mapsToBundle.forEach(map => {
        let mapIndexData;
        try {
            if (fs.existsSync(indexPath)) {
                const rawData = fs.readFileSync(indexPath);
                mapIndexData = JSON.parse(rawData);
            }

            const mapIndex = mapIndexData.findIndex(
                m => m.MapUUID === map.MapUUID,
            );
            if (mapIndex > -1) {
                mapIndexData[mapIndex].DownloadCount += 1;
                fs.writeFileSync(
                    indexPath,
                    JSON.stringify(mapIndexData, null, 2),
                );
            }
        } catch (error) {
            console.error('Error updating map download count:', error);
        }
    });

    // Finalize the archive (finish zipping)
    archive.finalize();
});

module.exports = router;
