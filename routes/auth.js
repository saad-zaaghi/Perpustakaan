const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Anggota = require('../models/anggota');

// Rute pendaftaran
router.post('/register', async (req, res, next) => {
    try {
        const { username, NIM, password } = req.body;

        if (username === "admin") {
            await User.create({ username, password, role: "admin" });
            res.status(201).json({ message: 'Admin registered successfully' });
        } else {
            await User.create({ username, password, role: "user" });
            await Anggota.create({ NIM: NIM, Nama: username });
            res.status(201).json({ message: 'User registered successfully' });
        }
    } catch (err) {
        next(err);
    }
});


// Rute login
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
            next(err);
    }
});

module.exports = router;