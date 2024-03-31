const adminModel = require('./models/adminModel')

module.exports.loginDao = async function(loginId,loginPwd){
    return await adminModel.findOne({
        attributes:{
            exclude:['loginPwd','createdAt','deletedAt']
        },
        where:{
            loginId,
            loginPwd
        }
    })
    
}

module.exports.updateAdminDao = async function(adminInfo){
    let resp = await adminModel.update({name:adminInfo.name,loginPwd:adminInfo.loginPwd},{
        where:{
            loginId:adminInfo.loginId
        }
    })
    return resp
}