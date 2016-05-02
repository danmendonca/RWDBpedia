var app = angular.module('BooksDirective', []);

app.directive('dbpbooks', function () {
    return {
        templateUrl: 'views/books.html'
    };

});

app.directive('dbpbook', function () {
    return {
        templateUrl: 'views/book.html'
    };

});