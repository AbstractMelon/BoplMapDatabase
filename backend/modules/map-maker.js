const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { mapMakerDir } = require('../database');
const { trackEvent } = require('./analytics');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Helper function to write version.json
function writeVersionFile(versionDir, versionData) {
	const versionFilePath = path.join(versionDir, 'version.json');
	fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
}

// Route to download a specific version
router.get('/download/:versionId', (req, res) => {
	const versionId = req.params.versionId;
	const versionDir = path.join(mapMakerDir, `v${versionId}`);

	if (!fs.existsSync(versionDir)) {
		return res.status(404).json({ message: 'Version not found' });
	}

	res.download(versionDir);
	trackEvent('mapMakerDownload');
});

// Route to upload files
router.post(
	'/upload',
	isAdmin,
	upload.fields([
		{ name: 'zipFile1', maxCount: 1 },
		{ name: 'zipFile2', maxCount: 1 },
		{ name: 'exeFile', maxCount: 1 },
		{ name: 'tarFile', maxCount: 1 },
	]),
	(req, res) => {
		const versionId = req.body.versionId;
		const changelog = req.body.changelog;

		if (!versionId || !changelog) {
			return res
				.status(400)
				.json({ message: 'Missing versionId or changelog' });
		}

		const versionDir = path.join(mapMakerDir, `v${versionId}`);

		// Create version directory
		if (!fs.existsSync(versionDir)) {
			fs.mkdirSync(versionDir, { recursive: true });
		}

		// Rename and save uploaded files
		if (req.files.zipFile1 && req.files.zipFile1[0]) {
			const destPath = path.join(
				versionDir,
				`Map Maker Windows v${versionId}.zip`
			);
			fs.renameSync(req.files.zipFile1[0].path, destPath);
		}

		if (req.files.zipFile2 && req.files.zipFile2[0]) {
			const destPath = path.join(
				versionDir,
				`Map Maker Linux v${versionId}.zip`
			);
			fs.renameSync(req.files.zipFile2[0].path, destPath);
		}

		if (req.files.exeFile && req.files.exeFile[0]) {
			const destPath = path.join(versionDir, 'Map Maker Windows.exe');
			fs.renameSync(req.files.exeFile[0].path, destPath);
		}

		if (req.files.tarFile && req.files.tarFile[0]) {
			const destPath = path.join(versionDir, 'Map Maker.tar.xz');
			fs.renameSync(req.files.tarFile[0].path, destPath);
		}

		// Write version.json
		const versionData = {
			versionId,
			changelog,
			files: [
				`Map Maker Windows v${versionId}.zip`,
				`Map Maker Linux v${versionId}.zip`,
				'Map Maker Windows.exe',
				'Map Maker.tar.xz',
			],
		};
		writeVersionFile(versionDir, versionData);

		res.status(201).json({
			message: 'Files uploaded successfully',
			versionData,
		});
	}
);

// Route to get the map maker base info
router.get('/', (req, res) => {
	const versions = fs.readdirSync(mapMakerDir).map((dir) => {
		const versionDir = path.join(mapMakerDir, dir);
		const versionInfo = fs.existsSync(path.join(versionDir, 'version.json'))
			? JSON.parse(fs.readFileSync(path.join(versionDir, 'version.json')))
			: null;

		return {
			version: dir.replace('v', ''),
			info: versionInfo,
		};
	});

	res.json({ versions });
});

module.exports = router;
