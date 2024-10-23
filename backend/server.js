const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Import modules
const servingRoutes = require('./modules/serving');
const adminRoutes = require('./modules/admin');
const accountsRoutes = require('./modules/accounts');
const mapsRoutes = require('./modules/maps');
const mapMakerRoutes = require('./modules/map-maker');
const bundleRoutes = require('./modules/bundles');
const { trackVisits } = require('./modules/analytics');

// Middleware
const rateLimiter = require('./middleware/rate-limiter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(trackVisits);
app.use(rateLimiter(300, 60 * 1000));

// Redirect /api/upload to /api/maps/upload
app.post('/api/upload', (req, res, next) => {
    req.url = '/api/maps/upload';
    next();
});

// Routes
app.use('/api', accountsRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/map-maker', mapMakerRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/', servingRoutes);

// Enhanced Error Handling
app.use((err, req, res, next) => {
    // Log error details
    console.error(`[${new Date().toISOString()}] Error:`, {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });

    // Check for specific error types and set status accordingly
    if (res.headersSent) {
        return next(err); // Delegate to the default error handler
    }

    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({ message: 'Bad Request: Invalid JSON' });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {},
    });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
