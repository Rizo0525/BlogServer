const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path')
const {formatResponse} = require('../utils/tools')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname,'../public/static/uploads'))
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + Math.random().toString(36).slice(-6) + path.extname(file.originalname)
        cb(null, filename)
    }
})

const upload = multer({ 
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 10
    }
})

router.post('/',upload.single('file'),async function(req,resp){
    // console.log(req.file)
    const path = '/static/uploads/' + req.file.filename
    resp.status(200).send(formatResponse(0,'文件上传成功',path))
})

module.exports = router