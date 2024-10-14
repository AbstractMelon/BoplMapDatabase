const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const saltRounds = 10;
const { exec } = require('child_process');


require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

const usersDir = path.join(__dirname, "../database/users");
const mapsDir = path.join(__dirname, "../database/maps");
const miscDir = path.join(__dirname, "../database/misc");

if (!fs.existsSync(mapsDir)) {
    fs.mkdirSync(mapsDir, { recursive: true });
}

if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir, { recursive: true });
}

if (!fs.existsSync(miscDir)) {
    fs.mkdirSync(miscDir, { recursive: true });
}

const LogsPath = path.join(miscDir, "Logs.json");

// Function to read Logs
function readLogs() {
    return fs.existsSync(LogsPath) ? JSON.parse(fs.readFileSync(LogsPath)) : [];
}

// Function to write Logs data to file
function writeLogs(data) {
    fs.writeFileSync(LogsPath, JSON.stringify(data, null, 2));
}

// Logs logging function
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

// Function to read user data
function readUser(username) {
    const userFilePath = path.join(usersDir, `${username}.json`);
    return fs.existsSync(userFilePath)
        ? JSON.parse(fs.readFileSync(userFilePath))
        : null;
}

// Function to write user data
function writeUser(username, userData) {
    const userFilePath = path.join(usersDir, `${username}.json`);
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

const upload = multer({ dest: "uploads/" });
const indexPath = path.join(__dirname, "../database", "maps", "index.json");

// Function to check if user is authenticated
function isAuthenticated(req, res, next) {
    const { token } = req.cookies;
    if (token) {
        const users = fs.readdirSync(usersDir);
        for (const file of users) {
            const user = readUser(file.replace(".json", ""));
            if (user && user.token === token) {
                req.user = user;
                return next();
            }
        }
        return res
            .status(401)
            .json({ message: "Unauthorized, please log in." });
    }
    return res.status(401).json({ message: "Unauthorized, please log in." });
}

// Function to update map index
function updateIndex(metadata) {
    let indexData = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];
    
    // Make sure new flags are set to false by default
    metadata.isMotw = metadata.isMotw || false;
    metadata.isFeatured = metadata.isFeatured || false;
    metadata.isHandpicked = metadata.isHandpicked || false;

    const mapIndex = indexData.findIndex(
        (map) => map.MapUUID === metadata.MapUUID
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
function updateToLatest() {
    const indexData = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath)) : [];
    
    // Update maps to include new flags
    indexData.forEach(map => {
        map.isMotw = map.isMotw || false;
        map.isFeatured = map.isFeatured || false;
        map.isHandpicked = map.isHandpicked || false;
    });
    
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

    // Update user data
    const users = fs.readdirSync(usersDir);
    users.forEach(file => {
        const user = readUser(file.replace(".json", ""));
        if (user) {
            user.likedMaps = user.likedMaps || [];
            writeUser(user.username, user);
        }
    });
}

// Function to check if user is an admin
function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res
        .status(403)
        .json({ message: "Forbidden: Admin access required." });
}

// API Routes
app.post(
    "/api/signup",
    [
        body("username")
            .isLength({ min: 5 })
            .withMessage("Username must be at least 5 characters long"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        if (fs.existsSync(path.join(usersDir, `${username}.json`))) {
            return res.status(400).json({ message: "User already exists" });
        }

        const isAdmin = false;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const token = uuidv4();
        const userData = {
            username,
            password: hashedPassword,
            accountCreationDate: new Date().toISOString(),
            token,
            isAdmin,
            likedMaps: [],
        };
        writeUser(username, userData);

        res.cookie("token", userData.token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        });

        logLogs("signup", { username });

        res.json({ message: "Signup successful" });
    }
);

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = readUser(username);

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = uuidv4();
        user.token = token;
        writeUser(username, user);

        res.cookie("token", token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        });

        logLogs("login", { username });

        res.json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

app.post("/api/logout", (req, res) => {
    const { token } = req.cookies;
    res.clearCookie("token");

    if (token) {
        logLogs("logout", { token });
    }

    res.json({ message: "Logout successful" });
});

app.get('/api/maps', (req, res) => {
    const maps = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath)) : [];
    
    // Get query parameters
    const { developer, name, type, date } = req.query;

    // Filter maps based on query parameters
    let filteredMaps = maps;

    if (developer) {
        filteredMaps = filteredMaps.filter(map => map.MapDeveloper.toLowerCase().includes(developer.toLowerCase()));
    }
    if (name) {
        filteredMaps = filteredMaps.filter(map => map.MapName.toLowerCase().includes(name.toLowerCase()));
    }
    if (type) {
        filteredMaps = filteredMaps.filter(map => map.MapType.toLowerCase() === type.toLowerCase());
    }
    if (date) {
        filteredMaps = filteredMaps.filter(map => {
            const mapDate = new Date(map.DateCreated).toISOString().split('T')[0];
            return mapDate === date;
        });
    }

    res.json(filteredMaps);
});

app.get("/api/user", isAuthenticated, (req, res) => {
    res.json({ message: "User data", user: req.user });
});
app.get("/api/maps/download/:mapid", (req, res) => {
    const { mapid } = req.params;
    const mapFilePath = path.join(mapsDir, `${mapid}.zip`);

    if (fs.existsSync(mapFilePath)) {
        res.download(mapFilePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Download failed" });
            } else {
                const indexData = fs.existsSync(indexPath)
                    ? JSON.parse(fs.readFileSync(indexPath))
                    : [];
                const map = indexData.find((map) => map.MapUUID === mapid);
                if (map) {
                    map.downloadCount = (map.downloadCount || 0) + 1;
                    fs.writeFileSync(
                        indexPath,
                        JSON.stringify(indexData, null, 2)
                    );
                }

                logLogs("map_download", { mapUUID: mapid });
            }
        });
    } else {
        res.status(404).json({ message: "Map not found" });
    }
});

app.post("/api/maps/:mapUUID/like", isAuthenticated, (req, res) => {
    const { mapUUID } = req.params;
    const indexData = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];

    const user = req.user;
    const map = indexData.find((map) => map.MapUUID === mapUUID);

    if (map) {
        if (!user.likedMaps.includes(mapUUID)) {
            map.likeCount = (map.likeCount || 0) + 1;
            user.likedMaps.push(mapUUID); // Add to liked maps
            fs.writeFileSync(
                usersDir + `/${user.username}.json`,
                JSON.stringify(user, null, 2)
            ); // Update user data
            fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
            return res.json({
                message: "Like count updated",
                likeCount: map.likeCount,
            });
        } else {
            return res
                .status(400)
                .json({ message: "You have already liked this map." });
        }
    } else {
        res.status(404).json({ message: "Map not found" });
    }
});

app.get("/api/maps/:mapUUID/user-like", isAuthenticated, (req, res) => {
    const { mapUUID } = req.params;
    const user = req.user;

    const hasLiked = user.likedMaps.includes(mapUUID);
    res.json({ hasLiked });
});

app.post("/api/upload", isAuthenticated, upload.single("map"), async (req, res) => {
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

            // Check if map already exists
            if (indexData.some((map) => map.MapUUID === metadata.MapUUID)) {
                return res.status(400).json({ message: "Map already exists" });
            }

            // Replace the author field with the username of the uploader
            metadata.MapDeveloper = req.user.username;

            // Log the metadata being uploaded
            console.log("Uploading map with metadata:", metadata);

            const mapFileName = `${metadata.MapUUID}.zip`;
            const mapStorageDir = path.join(__dirname, "../database", "maps");
            const mapStoragePath = path.join(mapStorageDir, mapFileName);

            if (!fs.existsSync(mapStorageDir)) {
                fs.mkdirSync(mapStorageDir, { recursive: true });
            }

            // Move the uploaded file to the maps directory
            fs.renameSync(req.file.path, mapStoragePath);
            
            // Update the index with the modified metadata
            updateIndex(metadata); // This should now use the modified metadata

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


// Admin
app.get("/api/admin/users", isAuthenticated, isAdmin, (req, res) => {
    const users = fs
        .readdirSync(usersDir)
        .map((file) => readUser(file.replace(".json", "")));
    res.json(users);
});

app.get("/api/admin/update", isAuthenticated, isAdmin, (req, res) => {
    updateToLatest()
    res.json("Updated Probably");
});

// Deploy
app.post("/api/admin/deploy", (req, res) => {
    const { deployToken } = req.body;
    const expectedToken = process.env.DEPLOY_TOKEN;

    if (deployToken === expectedToken) {
        const updateCommand = "cd ../ && git pull && npm run update";

        exec(updateCommand, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res
                    .status(500)
                    .json({ message: "Failed to run update", error: stderr });
            }
            console.log(`stdout: ${stdout}`);
            res.json({
                message: "Update command executed successfully",
                output: stdout,
            });
        });
    } else {
        res.status(403).json({ message: "Forbidden: Invalid deploy token" });
    }
});

// Get Logs
app.get("/api/admin/logs", isAuthenticated, isAdmin, (req, res) => {
    const logs = readLogs();
    res.json(logs);
});

// View User Details
app.get("/api/admin/users/:username", isAuthenticated, isAdmin, (req, res) => {
    const user = readUser(req.params.username);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Delete User
app.delete("/api/admin/users/:username", isAuthenticated, isAdmin, (req, res) => {
    const userFilePath = path.join(usersDir, `${req.params.username}.json`);
    if (fs.existsSync(userFilePath)) {
        fs.unlinkSync(userFilePath);
        res.json({ message: "User deleted successfully" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Delete Map
app.delete("/api/maps/:mapUUID", isAuthenticated, isAdmin, (req, res) => {
    const mapFilePath = path.join(mapsDir, `${req.params.mapUUID}.zip`);
    const indexPath = path.join(__dirname, "../database/maps/index.json");

    if (fs.existsSync(mapFilePath)) {
        fs.unlinkSync(mapFilePath);
        
        // Remove from index
        const indexData = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath)) : [];
        const updatedIndex = indexData.filter(map => map.MapUUID !== req.params.mapUUID);
        fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2));

        res.json({ message: "Map deleted successfully" });
    } else {
        res.status(404).json({ message: "Map not found" });
    }
});

// Update Map
app.put("/api/maps/:MapUUID", isAuthenticated, isAdmin, (req, res) => {
    const mapUUID = req.params.MapUUID;
    const updatedMapData = req.body;
    const indexData = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];

    const mapIndex = indexData.findIndex((map) => map.MapUUID === mapUUID);
    if (mapIndex === -1) {
        return res.status(404).json({ message: "Map not found" });
    }

    // Update map data
    indexData[mapIndex] = { ...indexData[mapIndex], ...updatedMapData };

    // Save the updated index data back to file
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

    // Log the update action
    logLogs("Updated map", { mapUUID, updatedMapData });

    res.json({ message: "Map updated successfully" });
});

// Update User
app.put("/api/admin/users/:username", isAuthenticated, isAdmin, (req, res) => {
    const username = req.params.username;
    const updatedUserData = req.body;
    
    // Fetch the existing user data
    const user = readUser(username);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Update the user data
    const updatedUser = { ...user, ...updatedUserData };

    // Save the updated user data to the filesystem
    writeUser(username, updatedUser);

    // Log the update action
    logLogs("Updated user", { username, updatedUserData });

    res.json({ message: "User updated successfully" });
});



// Serve static files from the frontend dist directory
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Docs
// Serve VitePress documentation
app.use(
    "/docs",
    express.static(path.join(__dirname, "../docs/.vitepress/dist"))
);

// Serve VitePress index.html for the docs route
app.get("/docs/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../docs/.vitepress/dist", "index.html"));
});

// Catch-all handler to serve the Vue app
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
