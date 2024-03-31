//当错误发生的时候，抛出自定义的错误。

const { formatResponse } = require("./tools")


class ServiceError extends Error{
    /**
     * 
     * @param {*} message 错误消息
     * @param {*} code 错误的消息码
     */
    constructor(message,code){
        super(message)
        this.code = code
    }
    toResponseJson(){
        // console.log(this.code,this.message)
        // console.log('toresponse',this.message)
        return formatResponse(this.code,this.message,null)
    }
}

//文件上传错误
exports.UploadError = class extends ServiceError{
    constructor(message){
        super(message,413)
    }
}
//禁止访问错误
exports.ForbiddenError = class extends ServiceError{
    constructor(message){
        // console.log('message:',message)
        super(message,401)
    }
}

//验证错误
exports.ValidationError = class extends ServiceError{
    constructor(message){
        super(message,406)
    }
}

//无资源错误  404
exports.NotFoundError = class extends ServiceError{
    constructor(){
        super('404 not found',404)
    }
}

//其他错误
exports.UnknownError = class extends ServiceError{
    constructor(message){
        super('server internal error',500)
    }
}

exports.ServiceError = ServiceError