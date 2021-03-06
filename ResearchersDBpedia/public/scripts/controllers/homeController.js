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
	
	$scope.data.singleAuthor = false;
	$scope.data.listOfAuthors = false;
	
	$scope.data.check = false;
	
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
			$scope.unsetAuthor();
			$scope.data.authors = data;
		})
		.error(function () {
			console.log("Oops: could not get any data");
		});
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

		var apiCall = "/book/subject/";
	    if (!$scope.data.check) apiCall += $scope.data.queryParam;
		else apiCall += "all/" + $scope.data.queryParam;

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
		$scope.data.radio = "books";
	}
	
	$scope.unsetBook = function () {
		$scope.data.singleBook = false;
		$scope.data.listOfBooks = true;
	}
	
	$scope.setPublisher = function (publisher) {
		$scope.data.publisher = publisher;
		$scope.data.singlePublisher = true;
		$scope.data.listOfPublishers = false;
		$scope.data.radio = "publishers";
	}
	
	$scope.unsetPublisher = function () {
		$scope.data.singlePublisher = false;
		$scope.data.listOfPublishers = true;
	}
	
	$scope.setAuthor = function (author) {
		$scope.data.author = author;
		$scope.data.singleAuthor = true;
		$scope.data.listOfAuthors = false;
		$scope.data.radio = "authors";
	}
	
	$scope.unsetAuthor = function () {
		$scope.data.singleAuthor = false;
		$scope.data.listOfAuthors = true;
	}
	
	var goToPublisherByName = function () {
		$scope.data.queryParam = $scope.data.book.publisher;
		searchPublisherByName();
	}
	
	var goToAuthorByName = function () {
		$scope.data.queryParam = $scope.data.book.author;
	}
	
	$scope.goToPublisher = function () {
		
		var apiCall = "/publisher/iri/" + encodeURIComponent($scope.data.book.publisherIri);
		$http.get(apiCall)
	        .success(function (data) {
			if (data.length > 0) {
				$scope.data.publisher = data[0];
				$scope.data.publisher.iri = $scope.data.book.publisherIri;
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
	
	$scope.goToAuthor = function () {
		
		var apiCall = "/authors/iri/" + encodeURIComponent($scope.data.book.authorIri);
		$http.get(apiCall)
	        .success(function (data) {
			if (data.length > 0) {
				$scope.data.author = data[0];
				$scope.data.singleAuthor = true;
				$scope.data.listOfAuthors = false;
				$scope.data.radio = "authors";
			} else goToAuthorByName();
		})
			.error(function (err) {
			console.log(err);
		});
	}
	
	$scope.getPublisherBooks = function () {
		var apiCall = "/book/publisheriri/";
		if (!$scope.data.check) apiCall +=  encodeURIComponent($scope.publisher.iri);
		else apiCall += "all/" +  encodeURIComponent($scope.data.publisher.iri);

		$http.get(apiCall)
	        .success(function (data) {
			$scope.data.publisher.books = data;
		})
			.error(function (err) {
			console.log(err);
		});
	}
	
	
	$scope.getAuthorBooks = function () {
		var apiCall = "/book/authoriri/";//all/" + encodeURIComponent($scope.data.author.iri);
		if (!$scope.data.check) apiCall +=  encodeURIComponent($scope.data.author.iri);
		else apiCall += "all/" +  encodeURIComponent($scope.data.author.iri);

		$http.get(apiCall)
	        .success(function (data) {
			$scope.data.author.books = data;
		})
			.error(function (err) {
			console.log(err);
		});
	}

});