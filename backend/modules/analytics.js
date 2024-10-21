const fs = require('fs');
const path = require('path');

const analyticsPath = path.join(__dirname, '../../database/analytics.json');

// Initialize analytics data if not already present
function initAnalytics() {
	if (!fs.existsSync(analyticsPath)) {
		fs.writeFileSync(analyticsPath, JSON.stringify({}, null, 2)); // Start with an empty object
	}
}

// Load analytics data from the file
function loadAnalytics() {
	return JSON.parse(fs.readFileSync(analyticsPath));
}

// Save analytics data to the file
function saveAnalytics(data) {
	fs.writeFileSync(analyticsPath, JSON.stringify(data, null, 2));
}

// Update analytics
function updateAnalytics(event) {
	const data = loadAnalytics();

	if (data[event] === undefined) {
		data[event] = 0;
	}

	data[event] += 1;

	saveAnalytics(data);
}

// Track visits
function trackVisits(req, res, next) {
	if (!req.path.startsWith('/assets/') || !req.path.startsWith('/api')) {
		trackEvent('visits');
	}
	next();
}

// Track events
function trackEvent(event) {
	updateAnalytics(event);
}

initAnalytics();

module.exports = {
	trackVisits,
	trackEvent,
	updateAnalytics,
	loadAnalytics,
	saveAnalytics,
};
