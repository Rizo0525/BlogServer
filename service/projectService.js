const { getProjectByName, addProjectDao, getProjectDao, deleteOneProjectDao, updateOneProjectDao } = require("../dao/projectDao")
const {ValidationError} = require('../utils/errors')
const { formatResponse, handleDataPattern } = require("../utils/tools")
const {validate} = require('validate.js')
module.exports.addProjectService = async function(projectInfo){
    projectInfo.description = JSON.stringify(projectInfo.description)
    const projectRules = {
        name:{
            presence:{
                allowEmpty:false,
            },
            type:'string'
        },
        url:{
            presence:{
                allowEmpty:false,
            },
            type:'string'
        },
        github:{
            presence:{
                allowEmpty:false,
            },
            type:'string'
        },
        description:{
            presence:{
                allowEmpty:false,
            },
            type:'string'
        },
        order:{
            presence:{
                allowEmpty:false,
            },
            type:'integer'
        },
        thumb:{
            type:'string'
        },
    }
    let validateResult = validate.validate(projectInfo,projectRules)
    console.log(validateResult)
    if(!validateResult){
        let findResult = await getProjectByName(projectInfo.name)
        if(!findResult){
            let data = await addProjectDao(projectInfo)
    
            return formatResponse(0,'',[data])
        }else{
            throw new ValidationError('项目名已存在')
        }
    }else{
        console.log('1111')
        throw new ValidationError(validateResult[Object.keys(validateResult)[0]])
    }
    
}

module.exports.getProjectService = async function(){
    let data = await getProjectDao()
    let obj = handleDataPattern(data)
    obj.forEach(item=>{
        item.description = JSON.parse(item.description)

    })
    return formatResponse(0,'',obj)
}

module.exports.updateOneProjectService = async function(projectId,projectInfo){
    projectInfo.description = JSON.stringify(projectInfo.description)
    let {dataValues} = await updateOneProjectDao(projectId,projectInfo)
    dataValues.description = JSON.parse(dataValues.description)
    return formatResponse(0,'',[dataValues])
}

module.exports.deleteOneProjectService = async function(projectId){
    await deleteOneProjectDao(projectId)
    return formatResponse(0,'',true)
}