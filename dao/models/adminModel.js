const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnect')
module.exports = sequelize.define('admin',{
    loginId:{
        allowNull:false,
        type:DataTypes.STRING
    },
    name:{
        allowNull:false,
        type:DataTypes.STRING
    },
    loginPwd:{
        allowNull:false,
        type:DataTypes.STRING
    }
},{
    freezeTableName:true,
    paranoid:true,
    createAt:false,
    updatedAt:false
})

// exports.adminModel = adminModel

