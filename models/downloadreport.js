const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Downloadreport = sequelize.define('downloadreport',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey : true,
        autoIncrement:true
    },
    URL:Sequelize.STRING
})

module.exports = Downloadreport;