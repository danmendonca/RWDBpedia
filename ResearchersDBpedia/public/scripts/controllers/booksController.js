var app = angular.module('dbpResearchModule')
.controller('booksController', function ($scope, $http, MyData) {
	$scope.data = MyData.data;
	var booksBuffer = null;
	var bookByIsbn = null;
	

	$scope.data.listOfBooks = false;
	$scope.data.singleBook = false;
	
	var setBooksVisibility = function (isSingleBook, isListBooks) {
		$scope.listOfBooks = isListBooks;
		$scope.singleBook = isSingleBook;
	}
	
	$scope.findBySubject = function () {
		if (!$scope.bookSubjectParam) return;
		
		var apiCall = "/book/subject/" + $scope.bookSubjectParam;
		$http.get(apiCall)
		.success(function (data) {
			booksBuffer = data;
			$scope.books = booksBuffer;
			setBooksVisibility(false, true);
		})
		.error(function () {
			console.log("Oops: could not get any data");
		});
	}
	$scope.findBookByIsbn = function () {
		if (!$scope.bookIsbnParam) return;
		
		var apiCall = "/book/isbn/" + $scope.bookIsbnParam;
		$http.get(apiCall)
		.success(function (data) {
			bookByIsbn = data;
			$scope.book = bookByIsbn;
			setBooksVisibility(true, false);
		})
		.error(function () {
			console.log("Oops: could not get any data");
		});
	}
	//
	//
	//TESTS
	//LIST OF BOOKS
	
	$http.get('/book/subject/artificial').success(function (data) {
	    setBooksVisibility(false, true);
		booksBuffer = data;
		$scope.books = booksBuffer;

	}).error(function () {
		console.log("Ops: could not get any data");
	});
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