const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Buku = sequelize.define('Buku', {
    bukuID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique : true
    },
    judul: {
        type: DataTypes.STRING,
        allowNull: false
    },
    penulis: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    penerbit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sinopsis: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Buku;