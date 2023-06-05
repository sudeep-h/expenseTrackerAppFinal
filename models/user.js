const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
        unique : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull:false
    },
    email : {
        type : Sequelize.STRING,
        allowNull:false
    },
    password : {
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = User;