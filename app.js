var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var flash=require("express-flash");
var session=require("express-session");
var fileupload=require("express-fileupload");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require("./routes/admin");
var categoryRouter = require("./routes/category");
var bookRouter = require("./routes/book");
var userRouter = require("./routes/user");
var issueBookRouter = require("./routes/issuebook");
var returnBookRouter = require("./routes/returnbook");
var settingRouter = require("./routes/setting");
var loginRouter = require("./routes/login");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(session({
    name: "my_session",
    secret: "my_secret",
    resave:false
}))

app.use(fileupload({
   createParentPath: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//adding assets for admin routes
app.use("/admin",express.static(path.join(__dirname, 'public')));
app.use("/admin/:any",express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/',adminRouter);
app.use("/",categoryRouter);
app.use("/",bookRouter);
app.use("/",userRouter);
app.use("/",issueBookRouter)
app.use("/",returnBookRouter)
app.use("/",settingRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
