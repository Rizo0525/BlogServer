const blogTypeModel = require('./models/blogTypeModel')
module.exports.addBlogTypeDao = async (blogTypeInfo)=>{
    // console.log(blogTypeInfo)
    return await blogTypeModel.create(blogTypeInfo)
    
}

module.exports.getBlogTypeByNameDao = async(name)=>{
    return await blogTypeModel.findOne({
        where:{
            name:name
        }
    })
}

module.exports.getBlogTypeDao = async ()=>{
    return await blogTypeModel.findAll()
}

module.exports.getSingleBlogTypeDao = async (blogTypeId)=>{
    return await blogTypeModel.findByPk(blogTypeId)
}

module.exports.updateSingleBlogTypeDao = async (blogTypeId,blogTypeInfo)=>{
    await blogTypeModel.update(blogTypeInfo,{
        where:{
            id:blogTypeId
        }
    })
    return await blogTypeModel.findByPk(blogTypeId)
}

module.exports.deleteSingleBlogTypeDao = async (blogTypeId)=>{
    return await blogTypeModel.destroy({
        where:{
            id:blogTypeId
        }
    })
}

module.exports.addArticleCountDao = async (blogTypeId)=>{
    let findResult = await blogTypeModel.findByPk(blogTypeId)
    // findResult.toJSON().articleCount++
    // console.log(findResult,findResult.articleCount)
    findResult.articleCount++
    await findResult.save()
    return ;
}

module.exports.subArticleCountDao = async (blogTypeId)=>{
    let findResult = await blogTypeModel.findByPk(blogTypeId)
    findResult.articleCount--
    await findResult.save()
    return ;
}