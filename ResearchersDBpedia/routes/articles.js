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
//here should be all the prefixes necessary for the books sparql queries
addBookPrefixes = function (q) {
    q.addPrefix('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>');
    q.appendPrefix('PREFIX dct: <http://purl.org/dc/terms/>');
    q.appendPrefix('PREFIX foaf: <http://xmlns.com/foaf/0.1/>');
    q.appendPrefix('PREFIX dbo: <http://dbpedia.org/ontology/>');
    q.appendPrefix('PREFIX dbp: <http://dbpedia.org/property/>');
    q.appendPrefix('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>');
}


//here should be all the triples for the standard book information we need
addBookTriples = function (q) {
    q.addTriple('?book rdf:type dbo:Book .'); //book IRI
    q.appendTriple('?book dbp:name ?b_title .'); //title
    q.appendTriple('?book dbp:author ?b_author_tmp .');
    q.appendTriple('?b_author_tmp dbp:name ?b_author .'); //author
    q.appendTriple('?book dbo:abstract ?b_abs .'); //abstract
    q.appendTriple('?book rdfs:comment ?b_desc .'); //description
    q.appendTriple('?book dbp:publisher ?b_publisher_tmp .');
    q.appendTriple('?b_publisher_tmp rdfs:label ?b_publisher .'); //publisher
    q.appendTriple('?book dbo:nonFictionSubject ?b_nfs_tmp .');
    q.appendTriple('?b_nfs_tmp rdfs:label ?b_nfs .'); //non-fiction-subject

}


//here should be all the information related that we will need the query to retrieve
addSelectSampleParams = function (q) {
    var selectParam = "SELECT DISTINCT (SAMPLE(?b_title) AS ?title)" 
    + " (SAMPLE(?b_author) AS ?author) (SAMPLE(?b_abs) AS ?abstract)" 
    + " (SAMPLE(?b_desc) AS ?description) (SAMPLE(?b_publisher) AS ?publisher) " 
    + " (SAMPLE(?b_nfs) AS ?nfs)";
    q.addSelect(selectParam);
}


appendLangFilters = function (q) {
    q.appendWhereFilterAnd('LANG(?b_title) = "en"');
    q.appendWhereFilterAnd('LANG(?b_abs) = "en"');
    q.appendWhereFilterAnd('LANG(?b_desc) = "en"');
}


prepareStandardQuery = function (q) {
    addBookPrefixes(q);
    addSelectSampleParams(q);
    addBookTriples(q);
}


//============================= SETTING OBJ COMMON FIELDS
setObjProperties = function (obj, entry) {
    obj.title = entry.title.value;
    obj.abstract = entry.abstract.value;
    obj.author = entry.author.value;
    obj.description = entry.description.value;
    obj.publisher = entry.publisher.value;
    obj.nfs = entry.nfs.value;
};



module.exports = router;