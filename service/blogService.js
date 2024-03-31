
const { validate } = require('validate.js')
const blogTypeModel = require('../dao/models/blogTypeModel')
const { ValidationError } = require('../utils/errors')
const { getBlogByTitleNameDao, addBlogDao, getBlogByPageDao, getOneBlogDao, updateOneBlogDao, deleteOneBlogDao } = require('../dao/blogDao')
const {addArticleCountDao} = require('../dao/blogTypeDao')
const {formatResponse,handleDataPattern, handleToc} = require('../utils/tools')
validate.validators.categoryIdIsExist = async function(value){
    // blogTypeModel
    let findResult = await blogTypeModel.findByPk(value)
    if(findResult){
        return ;
    }
    return 'CategoryId不存在'
}
module.exports.addBlogService = async (blogInfo,next)=>{

    blogInfo = handleToc(blogInfo)
    blogInfo.toc = JSON.stringify(blogInfo.toc)

    // console.log(blogInfo)
    blogInfo.scanNumber = 0
    const blogRules = {
        title:{
            presence:{
                allowEmpty:false
            },
            type:"string"
        },
        description:{
            presence:{
                allowEmpty:false
            },
            type:"string"
        },
        toc:{
            presence:{
                allowEmpty:false
            },
            type:"string"
        },
        htmlContent:{
            presence:{
                allowEmpty:false
            },
            type:"string"
        },
        thumb:{
            presence:{
                allowEmpty:false
            },
            type:"string"
        },
        scanNumber:{
            presence:{
                allowEmpty:false
            },
            type:"integer"
        },
        createDate:{
            presence:{
                allowEmpty:false
            },
            type:"integer"
        },
        categoryId:{
            presence:true,
            type:'integer',
            categoryIdIsExist:true
        }
    }

    try{
        await validate.async(blogInfo,blogRules)
        //验证通过
        //添加博客进数据库
        let findResult = await getBlogByTitleNameDao(blogInfo.title)
        if(!findResult){
            let addResult = await addBlogDao(blogInfo)
            if(addResult){
                addResult =  addResult.toJSON()
            }
            //对应的文章分类也需要新增
            await addArticleCountDao(blogInfo.categoryId)

            return formatResponse(0,'',addResult)
        }else{
            next(new ValidationError('博客标题已存在'))
        }
    }catch(error){
        
        throw new ValidationError(error[Object.keys(error)[0]])
    }
}

module.exports.getBlogByPageService = async (query)=>{
    let findResult = await getBlogByPageDao(query)

    if(findResult.rows.length===0){
        //没找到
        throw new ValidationError('没有找到相关的博客')
    }else{
        //存在
        let rows = handleDataPattern(findResult.rows)
        rows.forEach(it=>{
            it.toc = JSON.parse(it.toc)
        })
        // console.log(rows)
        // console.log(findResult)

        return formatResponse(0,'',{
            total:findResult.count,
            rows:rows
        })
    }

    
    
}

module.exports.getOneBlogService = async (blogId,auth)=>{
    let findResult = await getOneBlogDao(blogId)
    if(findResult){
        findResult.dataValues.toc = JSON.parse(findResult.dataValues.toc)
        if(!auth){
            findResult.scanNumber++
            await findResult.save()
        }
        // findResult = findResult.toJSON()
        // findResult.toc = JSON.parse(findResult.toc)
        return formatResponse(0,'',findResult.dataValues)
    }else{
        throw new ValidationError("当前博客文章不存在")
    }
}

module.exports.updateOneBlogService = async (blogId,blogInfo)=>{
    //判断有没有toc  需要做处理
    if(blogInfo.htmlContent){
        blogInfo = handleToc(blogInfo)
        blogInfo.toc = JSON.stringify(blogInfo.toc)
    }
    let {dataValues} = await updateOneBlogDao(blogId,blogInfo)
    return formatResponse(0,'',dataValues)
}

module.exports.deleteOneBlogService = async (blodId)=>{
    await deleteOneBlogDao(blodId)
    return formatResponse(0,'',true)
}