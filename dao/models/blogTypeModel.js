const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnect')

module.exports = sequelize.define('blogtype',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    articleCount:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0
    },
    order:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    freezeTableName:true,
    createdAt:false,
    updatedAt:false
})