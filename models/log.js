const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Anggota = require('./anggota');
const Buku = require('./buku');

const Log = sequelize.define('Log', {
    logID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
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
    tanggal: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: false
});

Log.belongsTo(Anggota, { foreignKey: 'NIM' });
Anggota.hasMany(Log, { foreignKey: 'NIM' });

Log.belongsTo(Buku, { foreignKey: 'bukuID' });
Buku.hasMany(Log, { foreignKey: 'bukuID' });

module.exports = Log;