const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(morgan('dev')); // HTTP request logger

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Path to the index.json file
const indexPath = path.join(__dirname, 'public', 'maps', 'index.json');

// Helper function to update index.json
function updateIndex(metadata) {
    let indexData = [];

    // Read the current index.json file
    if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath);
        indexData = JSON.parse(indexContent);
    }

    // Add or update the map metadata
    const mapIndex = indexData.findIndex(map => map.MapUUID === metadata.MapUUID);
    if (mapIndex >= 0) {
        indexData[mapIndex] = metadata;
    } else {
        indexData.push(metadata);
    }

    // Save the updated index.json file
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
    console.log(`Updated index.json with map UUID: ${metadata.MapUUID}`);
}

// Endpoint to fetch map data
app.get('/api/maps', (req, res) => {
    try {
        if (fs.existsSync(indexPath)) {
            const indexContent = fs.readFileSync(indexPath);
            const maps = JSON.parse(indexContent);
            res.json(maps);
        } else {
            res.json([]);
        }
        console.log('Fetched all maps');
    } catch (error) {
        console.error('Error fetching maps:', error.message);
        res.status(500).json({ message: 'Error fetching maps' });
    }
});

// Endpoint to search maps
app.get('/api/search', (req, res) => {
    try {
        const searchQuery = req.query.q.toLowerCase();
        if (fs.existsSync(indexPath)) {
            const indexContent = fs.readFileSync(indexPath);
            const maps = JSON.parse(indexContent);
            const filteredMaps = maps.filter(map => {
                return (
                    map.MapName.toLowerCase().includes(searchQuery) ||
                    map.MapDescription.toLowerCase().includes(searchQuery) ||
                    map.MapDeveloper.toLowerCase().includes(searchQuery) ||
                    map.MapType.toLowerCase().includes(searchQuery)
                );
            });
            res.json(filteredMaps);
        } else {
            res.json([]);
        }
        console.log(`Searched maps with query: ${searchQuery}`);
    } catch (error) {
        console.error('Error searching maps:', error.message);
        res.status(500).json({ message: 'Error searching maps' });
    }
});

// Map uploads
app.post('/api/upload', upload.single('map'), async (req, res) => {
    try {
        console.log('Starting upload process...');
        const extractedPath = path.join(__dirname, 'uploads', uuidv4());
        await fs.createReadStream(req.file.path)
            .pipe(unzipper.Extract({ path: extractedPath }))
            .promise();
        console.log(`Unzipped file to: ${extractedPath}`);

        // Find the MetaData.json file and read it
        const metadataPath = path.join(extractedPath, 'MetaData.json');
        if (fs.existsSync(metadataPath)) {
            const metadataContent = fs.readFileSync(metadataPath);
            const metadata = JSON.parse(metadataContent);

            // Change Filename to the GUID
            const mapFileName = `${metadata.MapUUID}.zip`;
            const mapStoragePath = path.join(__dirname, 'public', 'maps', mapFileName);

            // Move the uploaded file to the final location with its GUID as the filename
            fs.renameSync(req.file.path, mapStoragePath);
            console.log(`Stored map as: ${mapStoragePath}`);

            // Update the index.json with the metadata
            updateIndex(metadata);

            // Clean up the extracted files
            fs.rmSync(extractedPath, { recursive: true, force: true });
            console.log(`Cleaned up extracted files at: ${extractedPath}`);

            res.json({ message: 'Map uploaded and metadata extracted successfully' });
        } else {
            console.error('MetaData.json not found in the uploaded map');
            res.status(400).json({ message: 'MetaData.json not found in the uploaded map' });
        }
    } catch (err) {
        console.error('Upload failed:', err.message);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});

// Endpoint to handle map downloads
app.get('/api/download/:uuid', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'maps', `${req.params.uuid}.zip`);
    if (fs.existsSync(filePath)) {
        console.log(`Download initiated for: ${filePath}`);
        res.download(filePath);
    } else {
        console.error('Map not found for UUID:', req.params.uuid);
        res.status(404).json({ message: 'Map not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
