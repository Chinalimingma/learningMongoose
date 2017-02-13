var express = require('express')
  , db = require('./models/db')
  , routes = require('./routes')   
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger =require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , flash = require('connect-flash');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('your secret here'));
app.use(session({
    secret: 'This is a secret string',
    resave: true,
    saveUninitialized: true    
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', express.static(path.join(__dirname, 'public')));
app.use('/project', express.static(path.join(__dirname, 'public')));

app.use(routes);

// This is the last one in the middleware stack
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);//To enter error mode
});

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler 
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});