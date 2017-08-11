var express = require('express');
var path = require('path');
var http = require('http');
var ejs = require('ejs');
var favicon = require('serve-favicon');
//
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// 路由
var routes = require('./serve/routes/index');
var buyer = require('./serve/routes/buyerCenter');
var seller = require('./serve/routes/sellerCenter');
var message = require('./serve/routes/message');
var order = require('./serve/routes/order');
var zh = require('./serve/routes/zh');
var ajax = require('./serve/api/common');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));


app.use('/api', ajax);
app.use('/', routes);
app.use('/buyer', buyer);
app.use('/seller', seller);
app.use('/message', message);
app.use('/order', order);
app.use('/zh', zh);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.set('port', 3000);
var server = http.createServer(app);
server.listen(3000);


module.exports = app;
