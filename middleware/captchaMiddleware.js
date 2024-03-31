const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha')
router.get('/res/captcha',async (req,resp)=>{
    var captcha = svgCaptcha.create({
        size:4,
        noise:10,
        color:true,
        ignoreChars:'0Oo1iI'
    })
    // console.log(req.session)
    // console.log(111)
    // console.log(next)
    req.session.captcha = captcha.text.toLowerCase()
    // console.log(req.session)
    resp.type('svg').status(200).send(captcha.data)
    // resp.send
})
module.exports = router
