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
        allowNull:false,
        unique : true
    },
    password : {
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser:Sequelize.BOOLEAN,
    totalexpense:Sequelize.STRING
},
{
    tableName: 'user',
    timestamps: false,          // Set timestamps to false to disable the default timestamps
}
);

module.exports = User;