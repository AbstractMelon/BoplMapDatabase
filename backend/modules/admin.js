const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
    readLogs,
    readUser,
    writeUser,
    usersDir,
    logLogs,
    updateToLatest,
} = require('../database');

router.get('/users', isAuthenticated, isAdmin, (req, res) => {
    const users = fs
        .readdirSync(usersDir)
        .map(file => readUser(file.replace('.json', '')));
    res.json(users);
});

router.get('/update', isAuthenticated, isAdmin, (req, res) => {
    updateToLatest();
    res.json('Updated Probably');
});

router.post('/deploy', (req, res) => {
    const { deployToken } = req.body;
    const expectedToken = process.env.DEPLOY_TOKEN;

    if (deployToken === expectedToken) {
        const updateCommand =
            'cd ../ && git fetch origin && git reset --hard origin/main && cd .. && npm run update';

        res.json({ message: 'Update command started executing' });

        exec(updateCommand, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    } else {
        res.status(403).json({ message: 'Forbidden: Invalid deploy token' });
    }
});

router.get('/logs', isAuthenticated, isAdmin, (req, res) => {
    const logs = readLogs();
    res.json(logs);
});

router.get('/users/:username', isAuthenticated, isAdmin, (req, res) => {
    const user = readUser(req.params.username);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.delete('/users/:username', isAuthenticated, isAdmin, (req, res) => {
    const userFilePath = path.join(usersDir, `${req.params.username}.json`);
    if (fs.existsSync(userFilePath)) {
        fs.unlinkSync(userFilePath);
        res.json({ message: 'User deleted successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.put('/users/:username', isAuthenticated, isAdmin, (req, res) => {
    const username = req.params.username;
    const updatedUserData = req.body;

    // Fetch the existing user data
    const user = readUser(username);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update the user data
    const updatedUser = { ...user, ...updatedUserData };

    // Save the updated user data to the filesystem
    writeUser(username, updatedUser);

    // Log the update action
    logLogs('Updated user', { username, updatedUserData });

    res.json({ message: 'User updated successfully' });
});

module.exports = router;
