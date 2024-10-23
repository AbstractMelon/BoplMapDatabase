const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const {
    readUser,
    writeUser,
    getUsers,
    logLogs,
    usersDir,
} = require('../database');
const { isAuthenticated } = require('../middleware/auth');

const saltRounds = 10;

router.post(
    '/signup',
    [
        body('username')
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        if (fs.existsSync(path.join(usersDir, `${username}.json`))) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const isAdmin = false;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const token = uuidv4();
        const userId = uuidv4();
        const userData = {
            username,
            password: hashedPassword,
            userId,
            accountCreationDate: new Date().toISOString(),
            token,
            isAdmin,
            likedMaps: [],
        };
        writeUser(username, userData);

        res.cookie('token', userData.token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
        });

        logLogs('signup', { username });
        res.json({ message: 'Signup successful' });
    },
);

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = readUser(username);

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = uuidv4();
        user.token = token;
        writeUser(username, user);

        res.cookie('token', token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
        });

        logLogs('login', { username });
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

router.post('/logout', (req, res) => {
    const { token } = req.cookies;
    res.clearCookie('token');

    if (token) {
        logLogs('logout', { token });
    }

    res.json({ message: 'Logout successful' });
});

router.post('/logout/all', isAuthenticated, (req, res) => {
    const { username } = req.user;
    const users = fs.readdirSync(usersDir);

    users.forEach(file => {
        const user = readUser(file.replace('.json', ''));
        if (user.username === username) {
            user.token = null;
            writeUser(user.username, user);
        }
    });

    res.clearCookie('token');
    res.json({ message: 'Logged out of all accounts successfully.' });
});

router.get('/user/:username', (req, res) => {
    const users = getUsers();
    const user = users.find(user => user.username === req.params.username);

    if (user) {
        const { password, token, ...publicUserInfo } = user;
        res.json(publicUserInfo);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.get('/users/search', (req, res) => {
    const searchTerm = req.query.q;

    if (!searchTerm) {
        return res.status(400).json({ message: 'Search term is required' });
    }

    const users = getUsers();
    const filteredUsers = users.filter(user =>
        user.username.includes(searchTerm),
    );

    const publicUsersInfo = filteredUsers.map(
        ({ password, token, ...publicUserInfo }) => publicUserInfo,
    );
    res.json(publicUsersInfo);
});

router.get('/user', isAuthenticated, (req, res) => {
    res.json({ message: 'User data', user: req.user });
});

module.exports = router;
