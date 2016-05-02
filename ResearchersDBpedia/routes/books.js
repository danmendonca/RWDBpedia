﻿var express = require('express');
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
//here should be all the prefixes necessary for the books sparql queries -- Use the standard names!
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

}

//here should be all the information related that we will need the query to retrieve
addSelectSampleParams = function (q) {
    var selectParam = "SELECT DISTINCT (SAMPLE(?b_title) AS ?title)(SAMPLE(?b_author) AS ?author)" 
    + " (SAMPLE(?b_abs) AS ?abstract) (SAMPLE(?b_desc) AS ?description) (SAMPLE(?b_publisher) AS ?publisher)";
    q.addSelect(selectParam);
}

appendLangFilters = function (q){
    q.appendWhereFilterAnd('LANG(?b_title) = "en"');
    q.appendWhereFilterAnd('LANG(?b_abs) = "en"');
    q.appendWhereFilterAnd('LANG(?b_desc) = "en"');
}



//============================= SETTING OBJ COMMON FIELDS
setObjProperties = function (obj, entry) {
    obj.title = entry.title.value;
    obj.abstract = entry.abstract.value;
    obj.author = entry.author.value;
    obj.description = entry.description.value;
    obj.publisher = entry.publisher.value;
};




//============================= ANSWERING GET REQUESTS
/* GET users listing. */
router.get('/', function (req, res) {
    res.send('Nothing to see here!');
});

router.get('/publisher/:pub', function (req, res) {
    res.send("Not implemented");
});
router.get('/author/:author', function (req, res) {
    res.send("Not implemented");
});

//book queries
router.get('/isbn/:isbn', function (req, res) {
    var q = new SparqlQuery();
    addBookPrefixes(q);

    addSelectSampleParams(q);
    q.appendSelect("(SAMPLE(?b_isbn) AS ?isbn)")
    
    addBookTriples(q);
    q.appendTriple('?book dct:subject ?b_sbj .');
    q.appendTriple('?book dbp:genre ?b_genre .');
    q.appendTriple('?book dbp:isbn ?b_isbn .');
    //nfs
    q.appendTriple('?book dbo:nonFictionSubject ?b_nfs_tmp .');
    q.appendTriple('?b_nfs_tmp rdfs:label ?b_nfs .');
    q.appendSelect('(SAMPLE(?b_nfs) AS ?nfs)')
    
    q.addWhereFilter(
        '(contains(str(?b_isbn), "' + req.params.isbn + '") )' 
    );
    appendLangFilters(q);
    
    var queryAuto = q.returnQuery() + "GROUP BY ?book";
    
    var result = endpoint.selectQuery(queryAuto, function (error, response) {
        var json_ans = JSON.parse(response.body).results.bindings;
        var jsAns = [];
        json_ans.forEach(function (entry) {
            var obj = new Object();
            setObjProperties(obj, entry);
            obj.nfs = entry.nfs.value;
            obj.isbn = entry.isbn.value;
            jsAns.push(obj);
        });
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(jsAns));
    });
});


//books queries
router.get('/subject/:sub', function (req, res) {
    var q = new SparqlQuery();
    addBookPrefixes(q);
    addSelectSampleParams(q);
    
    addBookTriples(q);
    
    q.appendTriple('?book dbo:nonFictionSubject ?b_nfs_tmp .');
    q.appendTriple('?b_nfs_tmp rdfs:label ?b_nfs .');
    q.appendTriple('?book dct:subject ?b_sbj .');
    q.appendSelect('(SAMPLE(?b_nfs) AS ?nfs)')
    
    
    q.addWhereFilter(
        '(contains(lcase(str(?b_title)), "' + req.params.sub + '")' 
    + ' || contains(lcase(str(?b_abs)), "' + req.params.sub + '")' 
    + ' || contains(lcase(str(?b_desc)), "' + req.params.sub + '")' 
    + ' || contains(lcase(str(?b_sbj)), "' + req.params.sub + '")' 
   + ' )' 
    );
    appendLangFilters(q);
    var queryAuto = q.returnQuery() + "GROUP BY ?book";
    var result = endpoint.selectQuery(queryAuto, function (error, response) {
        var json_ans = JSON.parse(response.body).results.bindings;
        var jsAns = [];
        json_ans.forEach(function (entry) {
            var obj = new Object();
            setObjProperties(obj, entry);
            obj.nfs = entry.nfs.value;
            jsAns.push(obj);
        });
        res.send(JSON.stringify(jsAns));
    });
});
router.get('/title/:title', function (req, res) {
    res.send("Not implemented");
});

module.exports = router;