var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var SparqlQuery = require('../libs/SparqlQuery');
var router = express.Router();

//SPARQL config
var request = require('request');
var SparqlHttp = require('sparql-http-client');
SparqlHttp.request = SparqlHttp.requestModuleRequest(request);


module.exports = router;