const express = require('express');
const router = express.Router();
const path = require('path');

// Serve static files
router.use(express.static(path.join(__dirname, '../../frontend/dist')));
router.use(
	'/docs',
	express.static(path.join(__dirname, '../../docs/.vitepress/dist'))
);

// Serve VitePress docs
router.get('/docs/*', (req, res) => {
	res.sendFile(
		path.join(__dirname, '../../docs/.vitepress/dist', 'index.html')
	);
});

// Catch-all handler
router.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

module.exports = router;
