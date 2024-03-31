const { validate } = require('validate.js')
const {addBlogTypeDao,getBlogTypeDao,getSingleBlogTypeDao,updateSingleBlogTypeDao,deleteSingleBlogTypeDao,getBlogTypeByNameDao} = require('../dao/blogTypeDao')
const { NotFoundError,ValidationError } = require('../utils/errors')
const { formatResponse,handleDataPattern } = require('../utils/tools')


module.exports.addBlogTypeService = async (blogTypeInfo)=>{
    const blogInfoRules = {
        name:{
            presence:{
                allowEmpty:false
            },
            type:'string'
        },
        order:{
            presence:{
                allowEmpty:false
            },
            type:'number'
        }
    }
    const validateResult = validate.validate(blogTypeInfo,blogInfoRules)
    if(!validateResult){
        let findResult = await getBlogTypeByNameDao(blogTypeInfo.name)
        if(!findResult){
            let addResult = await addBlogTypeDao(blogTypeInfo)
            if(addResult){
                addResult =  addResult.toJSON()
            }
            return formatResponse(0,'',addResult)
        }else{
            throw new ValidationError('博客分类名已经存在，请更换博客分类名')
        }
    }else{
        //数据验证失败
        throw new ValidationError(validateResult[Object.keys(validateResult)[0]])
    }
}

module.exports.getBlogTypeService = async ()=>{
    let data =  await getBlogTypeDao()
    if(data){
        data = handleDataPattern(data)
        data.sort((a,b)=>{
            if(a.order>b.order){
                return 1
            }else if(a.order<b.order){
                return -1
            }else{
                return 0
            }
        })
        return formatResponse(0,'',data)
    }
    else{
        throw new NotFoundError()
    }
}

module.exports.getSingleBlogTypeService = async (blogTypeId)=>{
    let findResult = await getSingleBlogTypeDao(blogTypeId)
    if(findResult){
        return formatResponse(0,'',findResult.toJSON())
    }else{
        throw new NotFoundError()
    }
}

module.exports.updateSingleBlogTypeService = async (blogTypeId,blogTypeInfo)=>{
    let findResult = await getSingleBlogTypeDao(blogTypeId)
    if(findResult){
        let updateResult = await updateSingleBlogTypeDao(blogTypeId,blogTypeInfo)
        return formatResponse(0,'',updateResult)
    }else{
        throw new ValidationError('当前博客分类不存在，无法修改')
    }
}

module.exports.deleteSingleBlogTypeService = async (blogTypeId)=>{
    let findResult = await getSingleBlogTypeDao(blogTypeId)
    if(findResult){
        if(findResult.toJSON().articleCount){
            throw new ValidationError('当前博客分类下存在文章，无法删除')

        }else{
            await deleteSingleBlogTypeDao(blogTypeId)
            return formatResponse(0,'','当前博客分类删除成功')
        }
        
    }else{
        throw new ValidationError('当前博客分类不存在，无法删除')
    }
}
