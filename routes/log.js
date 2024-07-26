var express = require('express');
var router = express.Router();
var Log = require('../models/log');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const Logs = await Log.findAll();
        res.json(Logs);
    } catch (err) {
        next(err);
    }
});

module.exports = router;