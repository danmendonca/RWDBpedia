"use strict";

var app = angular.module('lapdApp', []);
// BOOK CONTROLLER

var books_buffer = null;
var book_by_isbn = null;
app.controller('bookController', function ($scope, $http) {
    $http.get('/book/subject/Artificial').success(function (data) {
        
        books_buffer = data;
        $scope.books = books_buffer;
        
    }).error(function () {
        console.log("Ops: could not get any data");
    });
    
    $http.get('/book/isbn/1000').success(function (data) {
        
        book_by_isbn = data;
        $scope.book_by_isbn = book_by_isbn;
        
    }).error(function () {
        console.log("Ops: could not get any data");
    });
    
    //$scope.findbyisbn =
    //    $http.get('/book/isbn/', { isbn: $scope.isbn_text }).success(function (data) {
    //    $scope.book_by_isbn = data;//book_by_isbn;
    //    $scope.$apply();
    //}).error(function () {
    //    console.log("Ops: could not get any data");
    //});
});