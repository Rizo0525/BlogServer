const express = require('express');
const router = express.Router()
const adminService = require('../service/adminService')
const tools = require('../utils/tools');
const { ValidationError } = require('../utils/errors');

//登录
router.post('/login',async (req,resp)=>{
    // console.log(req,resp)
    // console.log(req.body)
    console.log(req.session.captcha)
    if(req.body.captcha.toLowerCase() != req.session.captcha){
        throw new ValidationError('验证码错误')
    }

    const {loginId,loginPwd,remember} = req.body
    let result = await adminService.loginService({
        loginId,
        loginPwd,
        remember
    })
    if(result.token){
        resp.header('authorization',result.token)
    }
    resp.status(200).send(tools.formatResponse(0,'登录成功',result.resp))
    
})

//恢复登录
router.get('/whoami',async(req,resp)=>{
    let token = req.headers.authorization
    token = tools.analysisToken(token)
    resp.send(tools.formatResponse(0,'',{
        loginId:token.loginId,
        name:token.name,
        id:token.id
    }))
})


router.put('/',async (req,resp)=>{
    let result = await adminService.updateAdminService(req.body)
    resp.send(tools.formatResponse(0,'',result))
})


module.exports = router