const {Sequelize,DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const Downloadreport = sequelize.define('downloadreport',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey : true,
        autoIncrement:true
    },
    URL:Sequelize.STRING,
    downloadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
})

module.exports = Downloadreport;