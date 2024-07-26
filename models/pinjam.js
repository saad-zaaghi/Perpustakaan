const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Anggota = require('./anggota');
const Buku = require('./buku');

const Pinjam = sequelize.define('Pinjam', {
    NIM: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Anggota,
            key: 'NIM'
        },
    },
    bukuID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Buku,
            key: 'bukuID'
        },
    }, 
    tgl_pjm: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    tgl_hrs_kbl: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tgl_kbl: {
        type: DataTypes.DATE,
        allowNull: true
    },
    kembali: {
        type: DataTypes.ENUM('sudah','belum'),
        allowNull: false
    },
}, {
    timestamps: false
});

Pinjam.belongsTo(Anggota, { foreignKey: 'NIM' });
Anggota.hasMany(Pinjam, { foreignKey: 'NIM' });

Pinjam.belongsTo(Buku, { foreignKey: 'bukuID' });
Buku.hasMany(Pinjam, { foreignKey: 'bukuID' });

module.exports = Pinjam;