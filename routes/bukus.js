var express = require('express');
var router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { addDays } = require('date-fns');
var Book = require('../models/buku');
var Kembali = require('../models/kembali');
var Pinjam = require('../models/pinjam');
const Log = require('../models/log');


router.get('/', async (req, res, next) => {
    try {
        const Books = await Book.findAll();
        res.json(Books);
    } catch (err) {
        next(err);
    }
});

router.post('/',authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { judul, penulis, penerbit, sinopsis } = req.body;
        const newBook = await Book.create({ judul, penulis, penerbit, sinopsis });
        res.status(201).json(newBook);
    } catch (err) {
        next(err);
    }
});

router.put('/:bukuID', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { judul, penulis, penerbit, sinopsis } = req.body;
        const Books = await Book.findByPk(req.params.bukuID);
        if (Books) {
            Books.judul = judul;
            Books.penulis = penulis;
            Books.penerbit = penerbit;
            Books.sinopsis = sinopsis;
            await Books.save();
            res.json(Books);
        } else {
            res.status(404).json({ message: 'Buku tidak ada' });
        }
        } catch (err) {
            next(err);
        }
   });

router.delete('/:bukuID', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const Books = await Book.findByPk(req.params.bukuID);
        if (Books) {
            await Books.destroy();
            res.json({ message: 'buku dihapus' });
        } else {
            res.status(404).json({ message: 'Bku tidak ada' });
        }
    } catch (err) {
        next(err);
    }
});

router.get('/pinjam', async (req, res, next) => {
    try {
        const Pinjams = await Pinjam.findAll();
        res.json(Pinjams);
    } catch (err) {
        next(err);
    }
});

router.post('/pinjam', async (req, res, next) => {
    try {
        const { NIM, bukuID } = req.body;
        const currentDate = new Date();
        const customDate = addDays(currentDate, 30);
        const balik = 'belum'
        const newPinjam = await Pinjam.create({ NIM, bukuID, tgl_pjm : currentDate, tgl_hrs_kbl : customDate, kembali : balik});
        await Log.create({NIM, bukuID, deskripsi : "meminjam"})
        res.status(201).json(newPinjam);
    } catch (err) {
        next(err);
    }
});

router.put('/pinjam/:NIM/:bukuID', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { NIM, bukuID } = req.params;
        const { tgl_pjm, tgl_kbl, tgl_hrs_kbl, kembali } = req.body;

        const pinjam = await Pinjam.findOne({ where: { NIM, bukuID } });
        if (pinjam) {
            pinjam.tgl_pjm = tgl_pjm;
            pinjam.tgl_kbl = tgl_kbl;
            pinjam.tgl_hrs_kbl = tgl_hrs_kbl;
            pinjam.kembali = kembali;
            await pinjam.save();
            res.json(pinjam);
        } else {
            res.status(404).json({ message: 'Peminjaman tidak ada' });
        }
    } catch (err) {
        next(err);
    }
});

router.delete('/pinjam/:NIM/:bukuID', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { NIM, bukuID } = req.params;
        const Pinjams = await Pinjam.findOne({ where: { NIM, bukuID } });
        if (Pinjams) {
            await Pinjams.destroy();
            res.json({ message: 'Peminjaman di hapus' });
        } else {
            res.status(404).json({ message: 'Peminjaman tidak ada' });
        }
    } catch (err) {
        next(err);
    }
});

router.get('/kembali', async (req, res, next) => {
    try {
        const Kembalis = await Kembali.findAll();
        res.json(Kembalis);
    } catch (err) {
        next(err);
    }
});

router.post('/kembali', async (req, res, next) => {
    try {
        const { NIM, bukuID } = req.body;
        const dikembalikan = new Date();

        const pinjaman = await Pinjam.findOne({ where: { NIM, bukuID, kembali: 'belum' } });
        if (!pinjaman) {
            return res.status(404).json({ message: 'Belum ada peminjaman yang dilakukan' });
        }

        const haruskembali = new Date(pinjaman.tgl_hrs_kbl);
        const diffTime = dikembalikan - haruskembali;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const sudahkembali = "sudah";
        let kenapinalti = "Tidak";

        if (diffDays > 30) {
            kenapinalti = "Ya";
        }

        const newKembali = await Kembali.create({ NIM, bukuID, tgl_kbl: dikembalikan, pinalti: kenapinalti });

        pinjaman.kembali = sudahkembali;
        await pinjaman.save();

        await Log.create({ NIM, bukuID, deskripsi: "mengembalikan" });

        res.status(201).json(newKembali);
    } catch (err) {
        next(err);
    }
});

router.put('/kembali/:NIM/:bukuID', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { NIM, bukuID } = req.params;
        const { tgl_kbl, pinalti } = req.body;

        const kembali = await Kembali.findOne({ where: { NIM, bukuID } });
        if (kembali) {
            kembali.tgl_kbl = tgl_kbl;
            kembali.pinalti = pinalti;
            await kembali.save();
            res.json(kembali);
        } else {
            res.status(404).json({ message: 'Pengembalian tidak ada' });
        }
    } catch (err) {
        next(err);
    }
});


router.delete('/kembali/:NIM/:bukuID', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { NIM, bukuID } = req.params;

        const kembali = await Kembali.findOne({ where: { NIM, bukuID } });
        if (kembali) {
            await kembali.destroy();
            res.json({ message: 'Pengembalian dihapus' });
        } else {
            res.status(404).json({ message: 'Pengembalian tidak ada' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;