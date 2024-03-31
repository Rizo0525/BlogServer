const jwt = require('jsonwebtoken')
const md5 = require('md5')
var toc = require('markdown-toc');

module.exports.formatResponse = (code,msg,data)=>{
    return {
        code:code,
        msg:msg,
        data:data
    }
}

module.exports.analysisToken = (token)=>{
    return jwt.verify(token.split(' ')[1],md5(process.env.JWT_SECRET))
}

module.exports.handleDataPattern = (data)=>{
    let newArray = []
    for (let item of data){
        newArray.push(item.dataValues)
    }
    return newArray
}

//处理toc
module.exports.handleToc = function(info){
    let result = toc(info.markdownContent).json
    // console.log(result)
    function transfer(flatArr){
        let result = []
        let min = 6
        /**
         * 创建toc对象
         * @param {*} item 
         * @returns 
         */
        function createTocItem(item){
            return {
                name:item.content,
                anchor:item.slug,
                level:item.lvl,
                children:[]
            }
        }
        let stack = []
        function handleItem(item){
            //模拟栈
            const top = stack[stack.length-1]
            if(!top){
                stack.push(item)
            }else if(item.level > top.level){
                //不是空
                top.children.push(item)
                stack.push(item)
            }else{
                stack.pop()
                handleItem(item)
            }
        }
        for(let i of flatArr){
            //先找等级最低的
            if(i.lvl < min){
                min = i.lvl
            }
        }
        for(let item of flatArr){
            const tocItem = createTocItem(item)
            if(tocItem.level == min){
                result.push(tocItem)
            }
            //说明该toc不是最低等级，可能是其他toc对象children中的一员。
            handleItem(tocItem)
        }
        return result
    }
    info.toc = transfer(result)
    // console.log(info.toc[0].children)
    delete info.markdownContent
    for(let i of result){
        switch(i.lvl){
            case 1:{
                var newStr = `<h1 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace('<h1>',newStr)
                break;
            }
            case 2:{
                var newStr = `<h2 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace('<h2>',newStr)
                break;
            }
            case 3:{
                var newStr = `<h3 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace('<h3>',newStr)
                break;
            }
            case 4:{
                var newStr = `<h4 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace('<h4>',newStr)
                break;
            }
            case 5:{
                var newStr = `<h5 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace('<h5>',newStr)
                break;
            }
            case 6:{
                var newStr = `<h6 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace('<h6>',newStr)
                break;
            }
        }
    }
    return info
}