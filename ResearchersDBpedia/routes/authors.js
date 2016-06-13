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
//Sparql query preparation
addAuthorPrefixes = function (q) {
	q.addPrefix('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>');
	q.appendPrefix('PREFIX dbo: <http://dbpedia.org/ontology/>');
	q.appendPrefix('PREFIX dbp: <http://dbpedia.org/property/>');
	q.appendPrefix('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>');
}


addAuthorSelectParams = function (q) {
	var selectParam = "SELECT distinct ?author (SAMPLE(?birthName) as ?birthName)" 
    + " (SAMPLE(?birthDate) as ?birthDate)" 
    + " (SAMPLE(?occupation) as ?occupation)(SAMPLE(?birthPlace) as ?birthPlace) ";
	q.addSelect(selectParam);
}


appendAuthorTriples = function (q) {
	q.appendTriple('?author dbp:name ?birthName .');
	//q.appendTriple('?author dbp:nationality ?nationalityIRI .');
	//q.appendTriple('?nationalityIRI rdfs:label ?nationality .');
	q.appendTriple('?author dbp:birthDate ?birthDate .');
	q.appendTriple('?author dbp:occupation ?occupationIRI .');
	q.appendTriple('?occupationIRI rdfs:label ?occupation .');
	q.appendTriple('?author dbp:birthPlace ?birthPlace .');
    //q.appendTriple('?birthPlaceIRI rdfs:label ?birthPlace .');
}


appendAuthorLangFilters = function (q) {
	//q.appendWhereFilterAnd('LANG(?nationality) = "en"');
	q.appendWhereFilterAnd('LANG(?birthName) = "en"');
	q.appendWhereFilterAnd('LANG(?occupation) = "en"');
	q.appendWhereFilterAnd('LANG(?birthPlace) = "en"');
}


setAuthorObjProperties = function (obj, entry) {
	if (entry.author.value) obj.iri = entry.author.value;
	if (entry.birthName.value) obj.birthName = entry.birthName.value;
	//obj.nationality = entry.nationality.value;
	if (entry.birthDate.value) obj.birthDate = entry.birthDate.value;
	if (entry.occupation.value) obj.occupation = entry.occupation.value;
	if (entry.birthPlace.value) obj.birthPlace = entry.birthPlace.value;
};
var getAuthorName = function (obj, iri) {
	var q = new SparqlQuery();
	addAuthorPrefixes(q);

	var selectParam = "SELECT distinct ?birthName ";
	q.addSelect(selectParam);
	q.addTriple("<" + iri + "> " + "dbp:name ?birthName .");
	q.appendWhereFilterAnd('LANG(?birthName) = "en"');
	
	var queryStr = q.returnQuery();
	endpoint.selectQuery(queryStr, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings;
		if (jsonAns.length > 0) {
			setAuthorObjProperties(obj, jsonAns[0]);
			obj.iri = iri;
		}
	});
}
var getAuthorBDate = function (obj, iri) {
	var q = new SparqlQuery();
	addAuthorPrefixes(q);

	var selectParam = "SELECT distinct ?birthDate ";
	q.addSelect(selectParam);
	q.addTriple("<" + iri + "> " + "dbp:birthDate ?birthDate .");
	
	var queryStr = q.returnQuery();
	endpoint.selectQuery(queryStr, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings;
		if (jsonAns.length > 0) {
			setAuthorObjProperties(obj, jsonAns[0]);
			obj.iri = iri;
		}
	});
}
var getAuthorOccupation = function (obj, iri) {
	var q = new SparqlQuery();
	addAuthorPrefixes(q);
	var selectParam = "SELECT distinct ?occupation ";
	q.addSelect(selectParam);
	q.addTriple("<" + iri + "> " + "dbp:occupation ?occupationIRI .");
	q.appendTriple('?occupationIRI rdfs:label ?occupation .');
	q.appendWhereFilterAnd('LANG(?occupation) = "en"');
	
	var queryStr = q.returnQuery();
	endpoint.selectQuery(queryStr, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings;
		if (jsonAns.length > 0) {
			setAuthorObjProperties(obj, jsonAns[0]);
			obj.iri = iri;
		}
	});
}
var getAuthorBPlace = function (obj, iri) {
	var q = new SparqlQuery();
	addAuthorPrefixes(q);

	var selectParam = "SELECT distinct ?birthPlace ";
	q.addSelect(selectParam);
	q.addTriple("<" + iri + "> " + "dbp:birthPlace ?birthPlace .");
	q.appendWhereFilterAnd('LANG(?birthPlace) = "en"');
	
	var queryStr = q.returnQuery();
	endpoint.selectQuery(queryStr, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings;
		if (jsonAns.length > 0) {
			setAuthorObjProperties(obj, jsonAns[0]);
			obj.iri = iri;
		}
	});
}


//
//
//Router calls
router.get('/name/:name', function (req, res) {
	var q = new SparqlQuery();
	addAuthorPrefixes(q);
	
	addAuthorSelectParams(q);
	
	q.addTriple('?author a dbo:Person .');
	q.appendTriple('?book a dbo:Book .');
	q.appendTriple('?book dbp:author ?author .');
	appendAuthorTriples(q);
	
	q.addWhereFilter(
		'(CONTAINS(LCASE(STR(?birthName)), "' 
        + req.params.name.toLowerCase() + '") )');
	appendAuthorLangFilters(q);
	
	var queryStr = q.returnQuery() + "GROUP BY ?author";
	endpoint.selectQuery(queryStr, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings;
		var jsAns = [];
		jsonAns.forEach(function (entry) {
			var obj = new Object();
			setAuthorObjProperties(obj, entry);
			jsAns.push(obj);
		});
		res.send(JSON.stringify(jsAns));
	});

});
router.get('/iri/:iri', function (req, res) {
	// var test_iri = encodeURIComponent('http://dbpedia.org/resource/Nava_Macmel-Atir');
	var q = new SparqlQuery();
	addAuthorPrefixes(q);
	addAuthorSelectParams(q);
	
	q.addTriple('?author a dbo:Person .');
	appendAuthorTriples(q);
	
	q.addWhereFilter(
		"(ISIRI(?author) && (?author=<" 
        + req.params.iri + ">))");
	appendAuthorLangFilters(q);
	
	var queryStr = q.returnQuery() + "GROUP BY ?author";
	endpoint.selectQuery(queryStr, function (error, response) {
		var jsonAns = JSON.parse(response.body).results.bindings;
		var jsAns = [];

		jsonAns.forEach(function (entry) {
			var obj = new Object();
			setAuthorObjProperties(obj, entry);
			jsAns.push(obj);
		});
		res.send(JSON.stringify(jsAns));
	});
});

module.exports = router;