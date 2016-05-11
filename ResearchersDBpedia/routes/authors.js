var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var SparqlQuery = require('../libs/SparqlQuery');
var router = express.Router();

//SPARQL config
var request = require('request');
var SparqlHttp = require('sparql-http-client');
SparqlHttp.request = SparqlHttp.requestModuleRequest(request);
var endpoint = new SparqlHttp({ endpointUrl: 'http://dbpedia.org/sparql' });


//============================= PREPARING SPARQL HEADER
//here should be all the prefixes necessary for the Author sparql queries
addAuthorPrefixes = function (q) {
    q.addPrefix('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>');
    q.appendPrefix('PREFIX dbo: <http://dbpedia.org/ontology/>');
    q.appendPrefix('PREFIX dbp: <http://dbpedia.org/property/>');
    q.appendPrefix('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>');
}


addAuthorSelectParams = function (q) {
    var selectParam = "SELECT distinct ?author (SAMPLE(?birthName) as ?birthName)"
    + " (SAMPLE(?nationality) as ?nationality)(SAMPLE(?birthDate) as ?birthDate)"
    + " (SAMPLE(?occupation) as ?occupation)(SAMPLE(?birthPlace) as ?birthPlace) ";
    q.addSelect(selectParam);
}

appendAuthorTriples = function (q) {
    q.appendTriple('?author dbp:name ?birthName .');
    q.appendTriple('?author dbp:nationality ?nationalityIRI .');
    q.appendTriple('?nationalityIRI rdfs:label ?nationality .');
    q.appendTriple('?author dbp:birthDate ?birthDate .');
    q.appendTriple('?author dbp:occupation ?occupationIRI .');
    q.appendTriple('?occupationIRI rdfs:label ?occupation .');
    q.appendTriple('?author dbp:birthPlace ?birthPlaceIRI .');
    q.appendTriple('?birthPlaceIRI rdfs:label ?birthPlace .');
}

appendAuthorLangFilters = function (q) {
    q.appendWhereFilterAnd('LANG(?nationality) = "en"');
    q.appendWhereFilterAnd('LANG(?birthName) = "en"');
    q.appendWhereFilterAnd('LANG(?occupation) = "en"');
    q.appendWhereFilterAnd('LANG(?birthPlace) = "en"');
}


setAuthorObjProperties = function (obj, entry) {
    obj.author = entry.author.value;
    obj.birthName = entry.birthName.value;
    obj.nationality = entry.nationality.value;
    obj.birthDate = entry.birthDate.value;
    obj.occupation = entry.occupation.value;
    obj.birthPlace = entry.birthPlace.value;
};

router.get('/name/:name', function(req, res) {
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


//url / escapechar = %2F
//encodeURI(uri)
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