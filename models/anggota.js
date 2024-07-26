const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Anggota = sequelize.define('Anggota', {
    NIM: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    Nama: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
}, {
    timestamps: false
});

module.exports = Anggota;