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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api', accountsRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', servingRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});