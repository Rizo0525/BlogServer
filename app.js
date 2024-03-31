var createError = require('http-errors');
var express = require('express');
require("express-async-errors")
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var { expressjwt: jwt } = require('express-jwt')
const multer = require('multer');



var { ForbiddenError, ServiceError, UnknownError, UploadError } = require('./utils/errors')
//默认读取项目根目录下的.env环境变量文件
require('dotenv').config()

//引入数据库连接
require('./dao/dbConnect')
// require('./dao/models/Admin.js')
require('./dao/initDbModels')



//创建express实例
var app = express();

const staticRoot = path.resolve(__dirname, './public')
app.use('/',express.static(staticRoot,{
  index:'index.html'
}))


//引入路由
var adminRouter = require('./routes/adminRoute');
var uploadRouter = require('./routes/uploadRoute');
var blogTypeRouter = require('./routes/blogTypeRoute');
var blogRouter = require('./routes/blogRoute');
var projectRouter = require('./routes/projectRoute');

const md5 = require('md5');

app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}))

//使用中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(jwt(
  {
    secret: md5(process.env.JWT_SECRET),
    algorithms:["HS256"]
  }
).unless({
  path:[
    {
      "url":'/api/admin/login',methods:["POST"],
    },
    {
      "url":"/res/captcha",methods:["GET"]
    },
    {
      "url":"/api/upload",methods:["POST"]
    },
    {
      "url":"/api/blogtype",methods:["GET"]
    },
    {
      "url":"/api/blog",methods:["GET"]
    },
    {
      "url":/\/api\/blog\/\d/,methods:["GET"]
    },
    {
      "url":"/api/project",methods:["GET"]
    }
  ]
}))

//路由中间件
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter)
app.use(require('./middleware/captchaMiddleware'))
app.use('/api/blogtype',blogTypeRouter)
app.use('/api/blog',blogRouter)
app.use('/api/project',projectRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, resp, next) {
  console.log('error name:',err.name)
  console.log('error message:',err.message)
  if(err.name === 'UnauthorizedError'){
    //token验证错误  抛出自定义错误
    resp.send(new ForbiddenError('未登录或者登陆已经过期，请先登录').toResponseJson())
  }else if(err instanceof ServiceError){
    resp.send(err.toResponseJson())
  }else if(err instanceof multer.MulterError){
    resp.send(new UploadError(err.message).toResponseJson())
  }else{
    resp.send(new UnknownError().toResponseJson())
  }
});

module.exports = app;
