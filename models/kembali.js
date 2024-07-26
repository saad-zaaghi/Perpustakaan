const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Anggota = require('./anggota');
const Buku = require('./buku');

const Kembali = sequelize.define('Kembali', {
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
    tgl_kbl: {
        type: DataTypes.DATE,
        allowNull: true
    },
    pinalti: {
        type: DataTypes.ENUM('Ya', 'Tidak'),
        allowNull: true
    },
}, {
    timestamps: false
});

Kembali.belongsTo(Anggota, { foreignKey: 'NIM' });
Anggota.hasMany(Kembali, { foreignKey: 'NIM' });

Kembali.belongsTo(Buku, { foreignKey: 'bukuID' });
Buku.hasMany(Kembali, { foreignKey: 'bukuID' });

module.exports = Kembali;