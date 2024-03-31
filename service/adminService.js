const md5 = require('md5')
const adminDao = require('../dao/adminDao')
const jwt = require('jsonwebtoken')
const { ValidationError } = require('../utils/errors')

//登录
exports.loginService  = async (loginInfo)=>{
    loginInfo.loginPwd = md5(loginInfo.loginPwd)
    let resp = await adminDao.loginDao(loginInfo.loginId,loginInfo.loginPwd)
    if(resp){
        resp = resp.toJSON()
        let loginPeriod = null
        if(loginInfo.remember){
            loginPeriod = parseInt(loginInfo.remember)
        }else{
            loginPeriod = 1
        }
        const token = jwt.sign({
            id:resp.id,
            loginId:resp.loginId,
            name:resp.name
        },md5(process.env.JWT_SECRET),{
            expiresIn: 1000*60*60*24*loginPeriod
        })
        // console.log(token)
        console.log(token)
        return {
            resp,
            token
        }
    }
    return null
}

exports.updateAdminService = async (adminInfo)=>{
    // console.log(adminInfo)
    let resp = await adminDao.loginDao(adminInfo.loginId,md5(adminInfo.oldLoginPwd))
    // console.log(resp)
    //resp 可能为空表示旧密码不对
    if(resp){
        let newPassword = md5(adminInfo.loginPwd)
        const result = await adminDao.updateAdminDao({
            loginId:adminInfo.loginId,
            loginPwd:newPassword,
            name:adminInfo.name
        })
        return {
            "loginId":adminInfo.loginId,
            "name":adminInfo.name,
            "id":resp.id
        }
    }else{
        throw new ValidationError('旧密码或用户名不正确')
    }
}