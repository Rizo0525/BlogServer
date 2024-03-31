const adminModel = require('./models/adminModel');
const blogTypeModel = require('./models/blogTypeModel')
const blogModel = require('./models/blogModel')
const projectModel = require('./models/projectModel')
const md5 = require('md5')
const sequelize = require('./dbConnect');

(async ()=>{
    //博客分类和博客之间的关联关系
    blogTypeModel.hasMany(blogModel,{foreignKey:'categoryId',targetKey:'id'})
    blogModel.belongsTo(blogTypeModel,{foreignKey:'categoryId',targetKey:'id',as:'category'})
    await sequelize.sync({alter:true})
    const adminCount = await adminModel.count()
    if(!adminCount){
        //初始化
        await adminModel.create({
            loginId:'admin',
            name:'超级管理员',
            loginPwd:md5('123456')
        })
    }

})()

