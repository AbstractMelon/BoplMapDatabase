const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const usersDir = path.join(__dirname, '../database/users');
const mapMakerDir = path.join(__dirname, '../database/map-maker');
const miscDir = path.join(__dirname, '../database/misc');

// Icons
const modIconsDir = path.join(__dirname, '../database/assets/mod-icons');
const bundleIconsDir = path.join(__dirname, '../database/assets/bundle-icons');

// Maps
const indexPath = path.join(__dirname, '../database/maps', 'index.json');
const mapsDir = path.join(__dirname, '../database/maps');

// Bundles
const bundlesDir = path.join(__dirname, '../database/bundles');
const bundleIndexPath = path.join(bundlesDir, 'bundleindex.json');

const LogsPath = path.join(miscDir, 'Logs.json');
const unzipper = require('unzipper');

// Create directories if they don't exist
[usersDir, mapsDir, miscDir, modIconsDir, mapMakerDir, bundlesDir].forEach(
    dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    },
);

// Logs functions
function readLogs() {
    return fs.existsSync(LogsPath) ? JSON.parse(fs.readFileSync(LogsPath)) : [];
}

function writeLogs(data) {
    fs.writeFileSync(LogsPath, JSON.stringify(data, null, 2));
}

function logLogs(action, data) {
    const Logs = readLogs();
    const logEntry = {
        action,
        data,
        timestamp: new Date().toISOString(),
    };
    Logs.push(logEntry);
    writeLogs(Logs);
}

// User functions
function readUser(username) {
    const userFilePath = path.join(usersDir, `${username}.json`);
    return fs.existsSync(userFilePath)
        ? JSON.parse(fs.readFileSync(userFilePath))
        : null;
}

function writeUser(username, userData) {
    const userFilePath = path.join(usersDir, `${username}.json`);
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));
}

function getUsers() {
    return Object.values(fs.readdirSync(usersDir)).map(file =>
        readUser(file.replace('.json', '')),
    );
}

// Map functions
function updateIndex(metadata) {
    let indexData = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];

    metadata.isMotw = metadata.isMotw || false;
    metadata.isFeatured = metadata.isFeatured || false;
    metadata.isHandpicked = metadata.isHandpicked || false;
    metadata.LuaMap = metadata.LuaMap || false;
    metadata.MapUUID = String(metadata.MapUUID || null);

    const mapIndex = indexData.findIndex(
        map => map.MapUUID === metadata.MapUUID,
    );

    if (mapIndex >= 0) {
        indexData[mapIndex].downloadCount =
            indexData[mapIndex].downloadCount || 0;
        indexData[mapIndex].likeCount = indexData[mapIndex].likeCount || 0;
        indexData[mapIndex] = metadata;
    } else {
        metadata.downloadCount = 0;
        metadata.likeCount = 0;
        indexData.push(metadata);
    }

    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
}

// Function to update users and maps to latest structure
async function updateToLatest() {
    const indexData = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];

    // Update maps to include new flags
    indexData.forEach(map => {
        map.isMotw = map.isMotw || false;
        map.isFeatured = map.isFeatured || false;
        map.isHandpicked = map.isHandpicked || false;
        map.LuaMap = false; // Initialize LuaMap to false
        map.MapUUID = String(map.MapUUID || null);
    });

    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

    // Update user data
    const users = fs.readdirSync(usersDir);
    users.forEach(file => {
        const user = readUser(file.replace('.json', ''));
        if (user) {
            user.likedMaps = user.likedMaps || [];
            writeUser(user.username, user);
        }
    });

    // Extract images from zips in the index
    if (!fs.existsSync(modIconsDir)) {
        fs.mkdirSync(modIconsDir, { recursive: true });
    }

    for (const map of indexData) {
        const zipPath = path.join(
            __dirname,
            '../database/maps',
            `${map.MapUUID}.zip`,
        );

        if (fs.existsSync(zipPath)) {
            const tempDir = path.join(__dirname, 'temp', map.MapUUID);

            await fs.promises.mkdir(tempDir, { recursive: true });

            // Extract the zip file
            await fs
                .createReadStream(zipPath)
                .pipe(unzipper.Extract({ path: tempDir }))
                .promise();

            // Find the PNG file
            const files = await fs.promises.readdir(tempDir);
            const pngFiles = files.filter(
                file => path.extname(file).toLowerCase() === '.png',
            );

            if (pngFiles.length === 1) {
                const pngFilePath = path.join(tempDir, pngFiles[0]);
                const targetPath = path.join(modIconsDir, `${map.MapUUID}.png`);

                // Move the PNG file to the mod icons directory
                fs.renameSync(pngFilePath, targetPath);
            } else {
                console.warn(
                    `Expected one PNG file in ${zipPath}, found: ${pngFiles.length}`,
                );
            }

            // Check for .lua or .blua files and set LuaMap
            const luaFiles = files.filter(
                file =>
                    path.extname(file).toLowerCase() === '.lua' ||
                    path.extname(file).toLowerCase() === '.blua',
            );
            map.LuaMap = luaFiles.length > 0;

            // Create a new ZIP without the PNG file
            const outputZipPath = zipPath.replace('.zip', '_updated.zip');
            const output = fs.createWriteStream(outputZipPath);
            const archive = archiver('zip');

            output.on('close', () => {
                // Replace original zip with the new zip
                fs.renameSync(outputZipPath, zipPath);
            });

            archive.pipe(output);

            for (const file of files) {
                const filePath = path.join(tempDir, file);
                if (file !== pngFiles[0]) {
                    // Exclude the PNG file
                    archive.file(filePath, { name: file });
                }
            }

            await archive.finalize();
            // Clean up the temporary directory
            fs.rmSync(tempDir, { recursive: true, force: true });
        } else {
            console.warn(`Zip file not found for map UUID: ${map.MapUUID}`);
        }
    }

    // After updating the LuaMap, save the updated index data back to the file
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
}

module.exports = {
    usersDir,
    mapsDir,
    mapMakerDir,
    miscDir,
    bundlesDir,
    modIconsDir,
    indexPath,
    bundleIndexPath,
    readLogs,
    writeLogs,
    logLogs,
    readUser,
    writeUser,
    getUsers,
    updateIndex,
    updateToLatest,
};
