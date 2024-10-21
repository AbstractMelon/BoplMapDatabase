const fs = require('fs');
const path = require('path');

const usersDir = path.join(__dirname, "../database/users");
const mapsDir = path.join(__dirname, "../database/maps");
const mapMakerDir = path.join(__dirname, "../database/map-maker");
const miscDir = path.join(__dirname, "../database/misc");
const modIconsDir = path.join(__dirname, "../database/assets/mod-icons");
const bundlesDir = path.join(__dirname, "../database/bundles");
// const analyticsPath = path.join(__dirname, '../datbase/misc/analytics.json');
const LogsPath = path.join(miscDir, "Logs.json");
const indexPath = path.join(__dirname, "../database/maps", "index.json");

// Create directories if they don't exist
[usersDir, mapsDir, miscDir, modIconsDir, mapMakerDir, bundlesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

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
    return Object.values(fs.readdirSync(usersDir))
        .map((file) => readUser(file.replace(".json", "")));
}

// Map functions
function updateIndex(metadata) {
    let indexData = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];

    metadata.isMotw = metadata.isMotw || false;
    metadata.isFeatured = metadata.isFeatured || false;
    metadata.isHandpicked = metadata.isHandpicked || false;
    metadata.MapUUID = String(metadata.MapUUID || null);

    const mapIndex = indexData.findIndex(
        (map) => map.MapUUID === metadata.MapUUID
    );

    if (mapIndex >= 0) {
        indexData[mapIndex].downloadCount = indexData[mapIndex].downloadCount || 0;
        indexData[mapIndex].likeCount = indexData[mapIndex].likeCount || 0;
        indexData[mapIndex] = metadata;
    } else {
        metadata.downloadCount = 0;
        metadata.likeCount = 0;
        indexData.push(metadata);
    }

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
    readLogs,
    writeLogs,
    logLogs,
    readUser,
    writeUser,
    getUsers,
    updateIndex
};