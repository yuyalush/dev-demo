const express = require('express');
const router = express.Router();

/**
 * Returns today's date in ISO format
 * @returns {string} Today's date in ISO 8601 format
 */
function getTodayDateISO() {
    return new Date().toISOString();
}

// GET /api/date - Returns the current date
router.get('/date', (req, res) => {
    const todayDate = getTodayDateISO();
    res.json({ date: todayDate });
});

module.exports = router;