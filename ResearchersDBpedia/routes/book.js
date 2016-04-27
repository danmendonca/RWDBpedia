var express = require('express');
var SparqlQuery = require('./api/SparqlQuery');
var router = express.Router();

//SPARQL config
var request = require('request');
var SparqlHttp = require('sparql-http-client');
SparqlHttp.request = SparqlHttp.requestModuleRequest(request);
var endpoint = new SparqlHttp({ endpointUrl: 'http://dbpedia.org/sparql' });

//here should be all the prefixes necessary for the books sparql queries -- Use the standard names!
addBookPrefixes = function (q) {
    q.addPrefix('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>');
    q.appendPrefix('PREFIX dct: <http://purl.org/dc/terms/>');
    q.appendPrefix('PREFIX foaf: <http://xmlns.com/foaf/0.1/>');
    q.appendPrefix('PREFIX dbo: <http://dbpedia.org/ontology/>');
    q.appendPrefix('PREFIX dbp: <http://dbpedia.org/property/>');
    q.appendPrefix('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>');
}
//here should be the information that we will always need for a book query
addBookTriples = function (q) {
    q.addTriple('?book rdf:type dbo:Book .');
    q.appendTriple('?book dbp:name ?b_title .');
    q.appendTriple('?book dbp:author ?b_author .');
    q.appendTriple('?book dbo:abstract ?b_abs .');
    q.appendTriple('?book rdfs:comment ?b_desc .');
}


/* GET users listing. */
router.get('/', function (req, res) {
    res.send('Nothing to see here!');
});

router.get('/label/:label', function (req, res) {
    var q = new SparqlQuery();
    addBookPrefixes(q);
    
    q.addSelect('SELECT DISTINCT ?nfs ?nfs_label ?description');
    q.addTriple('?book rdf:type dbo:Book .');
    q.appendTriple('?book dbo:nonFictionSubject ?nfs .');
    q.appendTriple('?nfs rdfs:label ?nfs_label .');
    q.appendTriple('?nfs rdfs:comment ?description .');
    var filterStr = '(contains(str(?nfs_label), "' 
    + req.params.label + '") && LANG(?nfs_label)="en" && LANG(?description) = "en")';
    q.addWhereFilter(filterStr);
    
    var queryAuto = q.returnQuery();
    var result = endpoint.selectQuery(queryAuto, function (error, response) {
        res.send(response.body);
        return response.body;
    });
});

router.get('/publisher/:pub', function (req, res) {
    res.send("Not implemented");
});
router.get('/author/:author', function (req, res) {
    res.send("Not implemented");
});
router.get('/subject/:sub', function (req, res) {
    var q = new SparqlQuery();
    addBookPrefixes(q);
    
    q.addSelect("SELECT DISTINCT (SAMPLE(?b_title) AS ?title) (SAMPLE(?b_author) AS ?author) (SAMPLE(?b_abs) AS ?abstract) (SAMPLE(?b_desc) AS ?description)");
    
    addBookTriples(q);
    q.appendTriple('?book dbo:nonFictionSubject ?b_nfs .');
    q.appendTriple('?book dct:subject ?b_sbj .');
    q.appendTriple('?book dbp:genre ?b_genre .');
  
    q.addWhereFilter(
        '(contains(str(?b_title), "' + req.params.sub + '")' 
    + ' || contains(str(?b_abs), "' + req.params.sub + '")'
    + ' || contains(str(?b_desc), "' + req.params.sub + '")'
    + ' || contains(str(?b_nfs), "' + req.params.sub + '")'
    + ' || contains(str(?b_sbj), "' + req.params.sub + '")'
    + ' || contains(str(?b_genre), "' + req.params.sub + '") )'
    + ' && LANG(?b_title) = "en"'
    + ' && LANG(?b_abs) = "en"'
    + ' && LANG(?b_desc) = "en"'
    );
    var queryAuto = q.returnQuery() + "GROUP BY ?book";
    var result = endpoint.selectQuery(queryAuto, function (error, response) {
        res.send(response.body);
        return response.body;
    });
});
router.get('/title/:title', function (req, res) {
    res.send("Not implemented");
});
router.get('/isbn/:isbn', function (req, res) {
    res.send("Not implemented");
});
module.exports = router;