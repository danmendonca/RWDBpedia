var app = angular.module('booksModule', [])
.controller('booksController', function ($scope, $http) {
	
	var books_buffer = null;
	var book_by_isbn = null;
	
	//TODO GET BY PARAM INPUT
	$scope.findBySubject = function () {
		$http.get('/book/subject/math').success(function (data) {
			books_buffer = data;
			$scope.books = books_buffer;
		}).error(function () {
			console.log("Ops: could not get any data");
		});
	}
	
	//TODO GET BY PARAM INPUT
	$http.get('/book/subject/artificial').success(function (data) {
		
		books_buffer = data;
		$scope.books = books_buffer;

	}).error(function () {
		console.log("Ops: could not get any data");
	});
	
	//TODO GET BY PARAM INPUT
	$http.get('/book/isbn/1000').success(function (data) {
		
		book_by_isbn = data;
		$scope.book_by_isbn = book_by_isbn;
        
	}).error(function () {
		console.log("Ops: could not get any data");
	});
});