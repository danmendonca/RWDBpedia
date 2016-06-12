//
//
//requires
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var SparqlQuery = require('../libs/SparqlQuery');
var request = require('request');
var SparqlHttp = require('sparql-http-client');
var router = express.Router();
//SPARQL config
SparqlHttp.request = SparqlHttp.requestModuleRequest(request);
var endpoint = new SparqlHttp({ endpointUrl: 'http://dbpedia.org/sparql' });
//
//
//SPARQL
addBookPrefixes = function (q) {
    q.addPrefix('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>');
    q.appendPrefix('PREFIX dct: <http://purl.org/dc/terms/>');
    q.appendPrefix('PREFIX foaf: <http://xmlns.com/foaf/0.1/>');
    q.appendPrefix('PREFIX dbo: <http://dbpedia.org/ontology/>');
    q.appendPrefix('PREFIX dbp: <http://dbpedia.org/property/>');
    q.appendPrefix('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>');
}

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

addSelectSampleParams = function (q) {
    var selectParam = "SELECT DISTINCT (SAMPLE(?b_title) AS ?title)"
    + " (SAMPLE(?b_author) AS ?author) (SAMPLE(?b_abs) AS ?abstract)"
    + " (SAMPLE(?b_desc) AS ?description) (SAMPLE(?b_publisher) AS ?publisher) "
    + " (SAMPLE(?b_nfs) AS ?nfs)";
    q.addSelect(selectParam);
}

appendLangFilters = function (q){
    q.appendWhereFilterAnd('LANG(?b_title) = "en"');
    q.appendWhereFilterAnd('LANG(?b_abs) = "en"');
    q.appendWhereFilterAnd('LANG(?b_desc) = "en"');
}

prepareStandardQuery = function (q){
    addBookPrefixes(q);
    addSelectSampleParams(q);
    addBookTriples(q);
}

setObjProperties = function (obj, entry) {
    obj.title = entry.title.value;
    obj.abstract = entry.abstract.value;
    obj.author = entry.author.value;
    obj.description = entry.description.value;
    obj.publisher = entry.publisher.value;
    obj.nfs = entry.nfs.value;
};
//
//
//routes
router.get('/isbn/:isbn', function (req, res) {
    var q = new SparqlQuery();
    prepareStandardQuery(q);
    
    //isbn
    q.appendSelect("(SAMPLE(?b_isbn) AS ?isbn)");
    q.appendTriple('?book dbp:isbn ?b_isbn .');
    
    //curiosity --TODO delete maybe?!
    q.appendTriple('?book dct:subject ?b_sbj .');
    q.appendTriple('?book dbp:genre ?b_genre .');
    
    q.addWhereFilter(
        '(contains(lcase(str(?b_isbn)), "' + req.params.isbn.toLowerCase() + '") )' 
    );
    appendLangFilters(q);
    

    var queryAuto = q.returnQuery() + "GROUP BY ?book";
    endpoint.selectQuery(queryAuto, function (error, response) {
        var jsonAns = JSON.parse(response.body).results.bindings;
        var jsAns = [];
        jsonAns.forEach(function (entry) {
            var obj = new Object();
            setObjProperties(obj, entry);
            obj.isbn = entry.isbn.value;
            jsAns.push(obj);
        });
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(jsAns));
    });
});

router.get('/bookiri/:iri', function (req, res) {
    res.send("Not implemented");
});

//books with nfs sub
router.get('/subject/:sub', function (req, res) {
    var q = new SparqlQuery();
    prepareStandardQuery(q);

    //curiosity -- TODO delete maybe?!
    q.appendTriple('?book dct:subject ?b_sbj .');
    
    
    q.addWhereFilter(
        '(contains(lcase(str(?b_title)), "' + req.params.sub + '")' 
    + ' || contains(lcase(str(?b_abs)), "' + req.params.sub + '")' 
    + ' || contains(lcase(str(?b_desc)), "' + req.params.sub + '")' 
    + ' || contains(lcase(str(?b_sbj)), "' + req.params.sub + '")' 
   + ' )' 
    );
    appendLangFilters(q);
    var queryAuto = q.returnQuery() + "GROUP BY ?book";

    endpoint.selectQuery(queryAuto, function (error, response) {
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

//books with a nfs from publisher pub
router.get('/publisher/:pub', function (req, res) {
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

//books from author author
router.get('/author/:author', function (req, res) {
    var q = new SparqlQuery();
    prepareStandardQuery(q);
    
    q.addWhereFilter('CONTAINS(LCASE(STR(?b_author)), "' 
        + req.params.author.toLowerCase() + '" )');
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


router.get('/authoriri/:author', function (req, res) {
    res.send("Not implemented");
});


router.get('/publisherriri/:pub', function (req, res) {
    res.send("Not implemented");
});

module.exports = router;