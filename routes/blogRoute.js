const express = require('express');
const router = express.Router()
const {addBlogService, getBlogByPageService, getOneBlogService, updateOneBlogService, deleteOneBlogService} = require('../service/blogService')
//添加博客
router.post('/',async (req,resp,next)=>{
    // console.log(req.body)
    resp.send(await addBlogService(req.body,next))
})

//分页获取博客
router.get('/',async (req,resp)=>{
    // console.log(req.query)
    resp.send(await getBlogByPageService(req.query))
})

//获取其中一个博客
router.get('/:id',async (req,resp)=>{
    const reqHeaders = req.headers
    resp.send(await getOneBlogService(req.params.id,reqHeaders.authorization))
})
//修改其中一个博客
router.put('/:id',async (req,resp)=>{
    resp.send(await updateOneBlogService(req.params.id,req.body))
})

//删除其中一个博客
router.delete('/:id',async (req,resp)=>{
    resp.send(await deleteOneBlogService(req.params.id))
})

module.exports = router