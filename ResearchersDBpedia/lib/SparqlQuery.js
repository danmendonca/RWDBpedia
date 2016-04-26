//QueryPrototype class
function SparqlQuery() {
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
SparqlQuery.prototype.addPrefix = function (prefNs, prefUrl) {
    if (prefNs != null && prefUrl != null) {
        var newPrefix = "PREFIX " + prefNs + ": <" + prefUrl + "> ";
        //this.prefixes.push(newPrefix);
        this.prefixString += newPrefix;
    }
}
SparqlQuery.prototype.addTriple = function (subject, predicate, obj) {
    if (subject != null && predicate != null && obj != null) {
        var newTriple = subject + " " + predicate + " " + obj + " . ";
        //this.triples.push(newTriple);
        this.triplesString += newTriple;
    }
}
SparqlQuery.prototype.addOrder = function (order) {
    if (order != null)
        this.orderBy = "ORDER BY " + order;
}
SparqlQuery.prototype.addSelect = function (select) {
    if (select != null) {
        //this.selects.push(select);
        this.selects += select + " ";
    }
}
SparqlQuery.prototype.returnQuery = function () {
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

module.exports = SparqlQuery;