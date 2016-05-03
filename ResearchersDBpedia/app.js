﻿var debug = require('debug')('ResearchersDBpedia');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var publishers = require('./routes/publishers');
var authors = require('./routes/authors.js');
var books = require('./routes/books.js');


//SPARQL config
var request = require('request');
var SparqlHttp = require('sparql-http-client');
//var SparqlQuery = require('./lib/SparqlQuery');
// use the request module for all requests
SparqlHttp.request = SparqlHttp.requestModuleRequest(request);
// create an object instance for the endpoint 
var endpoint = new SparqlHttp({ endpointUrl: 'http://dbpedia.org/sparql' });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/book', books);


//application ===========================
app.get('/', function (req, res) {
    
    res.sendFile(path.join(__dirname, 'public/index.html'));

});

app.get('/isbn/', function (req, res) {
    
    res.sendFile(path.join(__dirname, 'public/test_isbn.html'));

});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
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
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
