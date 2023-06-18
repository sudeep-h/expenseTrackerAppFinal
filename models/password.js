const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const passwords = sequelize.define('passwords',{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true
    },
    isactive:Sequelize.BOOLEAN
})

module.exports = passwords;