const { subArticleCountDao, addArticleCountDao } = require('./blogTypeDao')
const blogModel = require('./models/blogModel')
const blogTypeModel = require('./models/blogTypeModel')

module.exports.getBlogByTitleNameDao = async(title)=>{
    return await blogModel.findOne({
        where:{
            title
        }
    })
}

module.exports.addBlogDao = async (blogInfo)=>{
    return await blogModel.create(blogInfo)
}

module.exports.getBlogByPageDao = async (query)=>{
    let page = Number(query.page)
    let limit = Number(query.limit)
    if(query.categoryid){
        //根据分类信息查询
        return await blogModel.findAndCountAll({
            include:[
                {
                    model:blogTypeModel,
                    as : 'category',
                    where:{
                        id:query.categoryid
                    },
                    // attributes:{
                    //     exclude:['articleCount','order']
                    // }
                }
            ],
            offset:limit * (page-1),
            limit:limit,
        })
    }else{
        return await blogModel.findAndCountAll({
            limit:limit,
            offset:limit * (page-1),
            include:[
                {
                    model:blogTypeModel,
                    as : 'category',
                    
                    // attributes:{
                    //     exclude:['articleCount','order']
                    // }
                }
            ],
        })
    }
    
}

module.exports.getOneBlogDao = async (blogId)=>{
    return await blogModel.findByPk(blogId,{
        include:[
            {
                model:blogTypeModel,
                as : 'category',
            }
        ]
    })
}

module.exports.updateOneBlogDao = async (blogId,blogInfo)=>{
    let data = await blogModel.findByPk(blogId)
    const oldCategoryId = data.dataValues.categoryId
    if(blogInfo.categoryId != oldCategoryId){
        await subArticleCountDao(oldCategoryId)
        await addArticleCountDao(blogInfo.categoryId)
    }

    await blogModel.update(blogInfo,{
        where:{
            id:blogId
        }
    })
    return await blogModel.findByPk(blogId)
}

module.exports.deleteOneBlogDao = async (blogId)=>{
    let data = await blogModel.findByPk(blogId)
    await subArticleCountDao(data.categoryId)

    return await blogModel.destroy({
        where:{
            id:blogId
        }
    })
}