var debug = require('debug')('ResearchersDBpedia');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//SPARQL config
var request = require('request');
var SparqlHttp = require('sparql-http-client');
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

app.use('/', routes);
app.use('/users', users);


//QueryPrototype class
function Query() {
    //this.prefixes = [];
    //this.triples = [];
    this.selects = [];
    this.prefixString = "";
    this.triplesString = "";
    this.selectsString = "";
    this.orderBy = "";
    this.groupBy = "";
    this.lastRemarks = "";
}
Query.prototype.addPrefix = function (prefNs, prefUrl) {
    if (prefNs != null && prefUrl != null) {
        var newPrefix = "PREFIX " + prefNs + ": <" + prefUrl + "> ";
        //this.prefixes.push(newPrefix);
        this.prefixString +=newPrefix;
    }
}
Query.prototype.addTriple = function (subject, predicate, obj) {
    if (subject != null && predicate != null && obj != null) {
        var newTriple = subject + " " + predicate + " " + obj + " . ";
        //this.triples.push(newTriple);
        this.triplesString += newTriple;
    }
}
Query.prototype.addOrder = function (order) {
    if (order != null)
        this.orderBy = "ORDER BY " + order;
}
Query.prototype.addSelect = function (select) {
    if (select != null) {
        //this.selects.push(select);
        this.selects += select + " ";
    }
}
Query.prototype.returnQuery = function () {
    /*this.prefixes.forEach(function (entry) {
        query = query.concat()
    }, this);*/

    /*this.selects.forEach(function (entry) {
        query = query.concat(entry);
    }, this);*/
    var query = this.prefixString;
    query += "SELECT DISTINCT " + this.selects; +" ";
    query += "WHERE { " + this.triplesString + " } ";
    if (this.lastRemarks != "")
        query += this.lastRemarks;
    return query;
}




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
    
    var q = new Query();
    q.addPrefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    q.addPrefix('ontology', 'http://dbpedia.org/ontology/');
    q.addTriple('?bookUri', 'rdf:type', 'ontology:Book');
    q.addSelect('?bookUri');
    
    var queryAuto = q.returnQuery();

    var query1 = 'SELECT * WHERE {?s ?p ?o}';   
    var prefix1 = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>';
    var prefix2 = 'PREFIX ontology: <http://dbpedia.org/ontology/>';
    var whereClause = 'select distinct ?bookUri where { ?bookUri  rdf:type ontology:Book .} limit 100';
    var query2 = prefix1 + " " + prefix2 + " " + whereClause;
    
    var prefix1_3 = 'PREFIX owl:<http://dbpedia.org/owl/>';
    var whereClause3 = 'SELECT distinct ?book ?genre WHERE {  ?book owl:literaryGenre ?genre .}';
    var query3 = prefix1 + " " + prefix2 + " " + prefix1_3 + " " + whereClause3;
    
    endpoint.selectQuery(queryAuto, function (error, response) {
        console.log(response.body);
    });
});

module.exports = app;
