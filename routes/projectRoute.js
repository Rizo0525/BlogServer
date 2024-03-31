const express = require('express');
const router = express.Router()
const {addProjectService,getProjectService,updateOneProjectService,deleteOneProjectService} = require('../service/projectService')
router.get('/',async (req,resp)=>{
    resp.send(await getProjectService())
})

router.post('/',async (req,resp)=>{
    // console.log(req.body)
    resp.send(await addProjectService(req.body))
})

router.put('/:id',async (req,resp)=>{
    resp.send(await updateOneProjectService(req.params.id,req.body))
})

router.delete('/:id',async (req,resp)=>{
    resp.send(await deleteOneProjectService(req.params.id))
})


module.exports = router