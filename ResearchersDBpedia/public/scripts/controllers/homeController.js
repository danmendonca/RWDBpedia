﻿var app = angular.module('dbpResearchModule')
.controller('homeController', function ($scope, $http, MyData) {
	$scope.data = MyData.data;
	
	$scope.searchByBookButton = false;
	$scope.searchByAuthorButton = false;
	$scope.searchByPublisherButton = false;
	
	
	$scope.data.listOfBooks = false;
	$scope.data.singleBook = false;
	
	$scope.data.listOfPublishers = false;
	$scope.data.singlePublisher = false;
	
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
			$scope.data.singlePublisher = false;
			$scope.data.listOfPublishers = true;
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
		if ($scope.data.radio == "authors") searchAuthorByName();
		else if ($scope.data.radio == "publishers") searchPublisherByName();
		else if ($scope.data.radio == "books") searchBooksByWord();
	}
	
	$scope.setBook = function (book) {
		$scope.data.book = book;
		$scope.data.singleBook = true;
		$scope.data.listOfBooks = false;
	}
	
	$scope.unsetBook = function () {
		$scope.data.singleBook = false;
		$scope.data.listOfBooks = true;
	}
	
	var goToPublisherByName = function () {
		$scope.data.queryParam = $scope.data.book.publisher;
		searchPublisherByName();

	}
	
	$scope.goToPublisher = function () {
		
		var apiCall = "/publisher/iri/" + encodeURIComponent($scope.data.book.publisherIri);
		$http.get(apiCall)
	        .success(function (data) {
			if (data.length > 0) {
				$scope.data.publisher = data[0];
				$scope.data.singlePublisher = true;
				$scope.data.listOfPublishers = false;
				$scope.data.radio = "publishers";
			} else goToPublisherByName();
		})
			.error(function (err) {
			console.log(err);
			console.log("publishersController-findBublisherByIri: Oops, something went wrong.");
		});
	}
	

});