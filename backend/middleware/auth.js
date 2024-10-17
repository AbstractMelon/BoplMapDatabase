const fs = require('fs');
const path = require('path');
const { readUser, usersDir} = require('../database');

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
        return res.status(401).json({ message: "Unauthorized, please log in." });
    }
    return res.status(401).json({ message: "Unauthorized, please log in." });
}

function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Admin access required." });
}

module.exports = { isAuthenticated, isAdmin };