var app = angular.module('dbpResearchModule')
.controller('homeController', function ($scope, $http, MyData) {
	$scope.data = MyData.data;
	
	$scope.searchByBookButton = false;
	$scope.searchByAuthorButton = false;
	$scope.searchByPublisherButton = false;
	
	
	$scope.data.listOfBooks = false;
	$scope.data.singleBook = false;
	
	var setBooksVisibility = function (isSingleBook, isListBooks) {
		$scope.data.listOfBooks = isListBooks;
		$scope.data.singleBook = isSingleBook;
	}
	
	var searchAuthorByName = function () {
		if (!$scope.data.queryParam) {
			console.log("Author name empty param.");
			return;
		}
		var apiCall = "/authors/name/" + $scope.data.queryParam;
		
		$http.get(apiCall)
		.success(function (data) {
			$scope.data.authors = data;
			$scope.data.IsAuthorsSingleView = false;
		}).error(function () { console.log("Oops: could not get any data"); });
	}
	
	var searchPublisherByName = function () {
		if (!$scope.data.queryParam) {
			console.log("Publisher name empty param.");
			return;
		}
		
		var apiCall = "/publisher/name/" + $scope.data.queryParam;
		$http.get(apiCall)
	        .success(function (data) {
			$scope.data.publishers = data;
		})
			.error(function () {
			console.log("publishersController-findBublisherByName: Oops, something went wrong.");
		});
	};
	
	var searchBooksByWord = function () {
		if (!$scope.data.queryParam) {
			console.log("Books search empty param.");
			return;
		}
		
		var apiCall = "/book/subject/" + $scope.data.queryParam;
		$http.get(apiCall)
		.success(function (data) {
			$scope.data.books = data;
			setBooksVisibility(false, true);
		})
		.error(function () {
			console.log("Oops: could not get any data");
		});
	}
	
	
	$scope.updateUi = function () {
		if ($scope.radio == "authors") searchAuthorByName();
		else if ($scope.radio == "publishers") searchPublisherByName();
		else if ($scope.radio == "books") searchBooksByWord();
	}

	$scope.setBook = function(book) {
		$scope.data.book = book;
		$scope.data.singleBook = true;
	}

	$scope.unsetBook = function() {
	    $scope.data.singleBook = false;
	}
	

});