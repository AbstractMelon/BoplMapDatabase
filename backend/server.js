const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const session = require("express-session");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const saltRounds = 10;

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

const usersDbPath = path.join(__dirname, "users.json");

// Helper to read/write user data
function readUsers() {
  return fs.existsSync(usersDbPath)
    ? JSON.parse(fs.readFileSync(usersDbPath))
    : [];
}

function writeUsers(users) {
  fs.writeFileSync(usersDbPath, JSON.stringify(users, null, 2));
}

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false,  
      httpOnly: true,
      sameSite: "strict"
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

const upload = multer({ dest: "uploads/" });
const indexPath = path.join(__dirname, "public", "maps", "index.json");

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized, please log in." });
  }
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

// Routes
app.post("/api/signup", [
  body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {    
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  const users = readUsers();

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  users.push({ username, password: hashedPassword });
  writeUsers(users);

  res.json({ message: "Signup successful" });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = username;
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logout successful" });
});

app.get("/api/maps", (req, res) => {
  res.json(
    fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath)) : []
  );
});

// Upload Route with authentication and duplicate prevention
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

        // Check for duplicate map
        if (indexData.some((map) => map.MapUUID === metadata.MapUUID)) {
          return res.status(400).json({ message: "Map already exists" });
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
        res
          .status(400)
          .json({ message: "MetaData.json not found in the uploaded map" });
      }
    } catch (err) {
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
