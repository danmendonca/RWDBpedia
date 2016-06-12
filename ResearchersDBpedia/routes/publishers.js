//
//
//Requires
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var SparqlQuery = require('../libs/SparqlQuery');
//
//
//SPARQL config
var router = express.Router();
var request = require('request');
var SparqlHttp = require('sparql-http-client');
SparqlHttp.request = SparqlHttp.requestModuleRequest(request);
var endpoint = new SparqlHttp({ endpointUrl: 'http://dbpedia.org/sparql' });
//
//
//Sparql query 
preparationaddBookPrefixes = function (q) {
q.addPrefix('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>');
q.appendPrefix('PREFIX dct: <http://purl.org/dc/terms/>');
q.appendPrefix('PREFIX foaf: <http://xmlns.com/foaf/0.1/>');
q.appendPrefix('PREFIX dbo: <http://dbpedia.org/ontology/>');
q.appendPrefix('PREFIX dbp: <http://dbpedia.org/property/>');
q.appendPrefix('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>');
}


addBookTriples = function (q) {
	q.addTriple("?book rdf:type dbo:Book .");
	q.appendTriple("?book dbp:publisher ?b_publisher_iri ."); //iri
	q.appendTriple("?b_publisher_iri rdfs:label ?b_publisher ."); //publisher label
}


addSelectSampleParams = function (q) {
	var selectParam = "SELECT DISTINCT (SAMPLE(?b_publisher) AS ?publisher) "
	+ "(SAMPLE(?b_publisher_iri) AS ?publisherIri)";
	q.addSelect(selectParam);
}


appendLangFilters = function (q) {
	q.appendWhereFilterAnd('LANG(?b_title) = "en"');
	q.appendWhereFilterAnd('LANG(?b_publisher) = "en"');
}


preparePublisherQuery = function (q) {
	addBookPrefixes(q);
	addSelectSampleParams(q);
	addBookTriples(q);
}


setObjProperties = function (obj, entry) {
	obj.publisher = entry.publisher.value;
    obj.publisherIri = entry.publisherIri.value;
};
//
//
//routes
router.get('/publisher/:pub', function (req, res) {
	var q = new SparqlQuery();
	prepareStandardQuery(q);
	
	q.addWhereFilter('contains(lcase(?b_publisher), "' + req.params.pub.toLowerCase() + '" )');
	appendLangFilters(q);
	
	var queryString = q.returnQuery() + " GROUP BY ?b_publisher";
	endpoint.selectQuery(queryString, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings;
		var jsAns = [];
		jsonAns.forEach(function (entry) {
			var obj = new Object();
			setObjProperties(obj, entry);
			jsAns.push(obj);
		});
		res.send(JSON.stringify(jsAns));
	});
});
router.get('/publisheriri/:pub', function (req, res) {
	var q = new SparqlQuery();
	prepareStandardQuery(q);
	
	q.addWhereFilter('contains(lcase(?b_publisher), "' + req.params.pub.toLowerCase() + '" )');
	appendLangFilters(q);
	
	var queryString = q.returnQuery() + " GROUP BY ?book";
	endpoint.selectQuery(queryString, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings;
		var jsAns = [];
		jsonAns.forEach(function (entry) {
			var obj = new Object();
			setObjProperties(obj, entry);
			jsAns.push(obj);
		});
		res.send(JSON.stringify(jsAns));
	});
});

module.exports = router;