var app = angular.module('dbpResearchModule')
.controller('booksController', function ($scope, $http, MyData) {
	$scope.data = MyData.data;
	$scope.data.listOfBooks = false;
	$scope.data.singleBook = false;
	$scope.data.book = null;
	$scope.data.books = null;
	
	$scope.findBookByIsbn = function () {
		if (!$scope.bookIsbnParam) return;
		
		var apiCall = "/book/isbn/" + $scope.bookIsbnParam;
		$http.get(apiCall)
		.success(function (data) {
			$scope.data.book = data;
			$scope.data.singleBook = true;
			$scope.data.listOfBook = false;
		})
		.error(function () {
			console.log("Oops: could not get any data");
		});
	}
	//
	//
	//TESTS
	//LIST OF BOOKS
	/*
	$http.get('/book/subject/artificial').success(function (data) {
	    setBooksVisibility(false, true);
		$scope.data.books = data;

	}).error(function () {
		console.log("Ops: could not get any data");
	});*/
	//BOOK BY ISBN
	/*
	$http.get('/book/isbn/1000').success(function (data) {
		
		bookByIsbn = data;
		$scope.book_by_isbn = bookByIsbn;
        
	}).error(function () {
		console.log("Ops: could not get any data");
	});
	*/
});