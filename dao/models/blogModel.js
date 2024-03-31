const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnect')
module.exports = sequelize.define('blog',{
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    toc:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    htmlContent:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    thumb:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    scanNumber:{
        allowNull:false,
        type:DataTypes.INTEGER
    },
    createDate:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    freezeTableName:true,
    createdAt:false,
    updatedAt:false
})