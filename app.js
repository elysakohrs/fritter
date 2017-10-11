var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({ secret : 'fritter', resave : true, saveUninitialized : true }));

var routes = require('./routes/index');
app.use('/', routes);

// Connect to mongo (either MONGODB_URI or local database) 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fritter');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("database connected");
    // Start the server
    var port = process.env.PORT || 3000;
    app.listen(port, function() {
        console.log("Listening on port " + port);
    });
});

// Below code is adopted from 6.170 mongo_recitation repo

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handlers

// Development error handler, will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            'message': err.message,
            'error': err
        });
    });
}

// Production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        'error': err.message
    });
});

module.exports = app;