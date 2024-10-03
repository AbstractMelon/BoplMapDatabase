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

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

const usersDir = path.join(__dirname, "../database/users");

if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir, { recursive: true });
}

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(cookieParser());

const upload = multer({ dest: "uploads/" });
const indexPath = path.join(__dirname, "public", "maps", "index.json");

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

function updateIndex(metadata) {
    let indexData = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath))
        : [];
    const mapIndex = indexData.findIndex(
        (map) => map.MapUUID === metadata.MapUUID
    );
    if (mapIndex >= 0) {
        indexData[mapIndex] = metadata;
    } else {
        indexData.push(metadata);
    }
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
}

function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Admin access required." });
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

        const isAdmin = false

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const token = uuidv4();
        const userData = {
            username,
            password: hashedPassword,
            accountCreationDate: new Date().toISOString(),
            token,
            isAdmin,
        };
        writeUser(username, userData);

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
        res.json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

app.post("/api/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
});

app.get("/api/maps", (req, res) => {
    res.json(
        fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath)) : []
    );
});

app.get("/api/admin/users", isAuthenticated, isAdmin, (req, res) => {
    const users = fs.readdirSync(usersDir).map(file => readUser(file.replace(".json", "")));
    res.json(users);
});

app.post(
    "/api/upload",
    isAuthenticated,
    upload.single("map"),
    async (req, res) => {
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
                    return res
                        .status(400)
                        .json({ message: "Map already exists" });
                }

                const mapFileName = `${metadata.MapUUID}.zip`;
                const mapStorageDir = path.join(__dirname, "public", "maps");
                const mapStoragePath = path.join(mapStorageDir, mapFileName);

                if (!fs.existsSync(mapStorageDir)) {
                    fs.mkdirSync(mapStorageDir, { recursive: true });
                }

                fs.renameSync(req.file.path, mapStoragePath);
                updateIndex(metadata);
                fs.rmSync(extractedPath, { recursive: true, force: true });

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
    }
);

app.get("/api/user", isAuthenticated, (req, res) => {
    res.json({ message: "User data", user: req.user });
});

// Serve static files from the frontend dist directory
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all handler to serve the Vue app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Docs
// Serve VitePress documentation
app.use('/docs', express.static(path.join(__dirname, '../docs/.vitepress/dist')));

// Serve VitePress index.html for the docs route
app.get('/docs/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../docs/.vitepress/dist', 'index.html'));
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
