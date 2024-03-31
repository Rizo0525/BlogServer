const projectModel = require('./models/projectModel')

module.exports.addProjectDao = async function(projectInfo){
    let {dataValues} = await projectModel.create(projectInfo)
    return dataValues
}

module.exports.getProjectDao = async function(){
    return await projectModel.findAll()
}

module.exports.updateOneProjectDao = async function(projectId,projectInfo){
    await projectModel.update(projectInfo,{
        where:{
            id:projectId
        }
    })
    return await projectModel.findByPk(projectId)
}

module.exports.deleteOneProjectDao = async function(projectId){
    return await projectModel.destroy({
        where:{
            id:projectId
        }
    })
}

module.exports.getProjectByName = async function(projectName){
    return await projectModel.findOne({
        where:{
            name:projectName
        }
    })
}