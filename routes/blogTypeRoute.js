const express = require('express')
const router = express.Router()
const {addBlogTypeService,getBlogTypeService,getSingleBlogTypeService,updateSingleBlogTypeService,deleteSingleBlogTypeService} = require('../service/blogTypeService')

//添加博客分类
router.post('/',async (req,resp)=>{
    // console.log(req.body)
    resp.send(await addBlogTypeService(req.body))
})

//获取博客分类
router.get('/',async (req,resp)=>{
    resp.send(await getBlogTypeService())
})


//获取一个博客分类
router.get('/:id',async (req,resp)=>{
    resp.send(await getSingleBlogTypeService(req.params.id))
})
//修改一个博客分类
router.put('/:id',async (req,resp)=>{
    resp.send(await updateSingleBlogTypeService(req.params.id,req.body))
})
//删除一个博客分类
router.delete('/:id',async (req,resp)=>{
    resp.send(await deleteSingleBlogTypeService(req.params.id))
})

module.exports = router