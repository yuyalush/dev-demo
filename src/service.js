const express = require('express');
const router = express.Router();

// Function that returns today's date in ISO format
function getTodayDateISO() {
    return new Date().toISOString();
}

// API endpoint to get today's date
router.get('/date', (req, res) => {
    const date = getTodayDateISO();
    res.json({ date });
});

module.exports = router;