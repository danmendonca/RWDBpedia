﻿var app = angular.module('dbpResearchModule')
.controller('authorsController', function ($scope, $http, MyData) {
	$scope.data = MyData.data;
	var authorsBuffer = null;
	var authorByIri = null;
	$scope.IsSingleView = false;
	//
	//
	//setting variables
	$scope.findAuthorByName = function () {
		if (!$scope.nameInputQuery) return;
		var apiCall = "/authors/name/" + $scope.data.queryParam;
		
		$http.get(apiCall)
		.success(function (data) {
			authorsBuffer = data;
			$scope.authors = authorsBuffer;
			$scope.IsAuthorsSingleView = false;
		}).error(function () { console.log("Oops: could not get any data"); });
	}
	
	$scope.findAuthorByIRI = function () {
		if (!$scope.authorIriInput) return;
		
		var apiCall = "/authors/iri/" + $scope.data.queryParam;
		$http.get(apiCall)
		.success(function (data) {
			authorByIri = data;
			$scope.author = authorByIri;
			$scope.IsAuthorsSingleView = true;
		})
		.error(function () { console.log("Oops: could not get any data"); });
	}
	//
	//
	//TESTING SECTION
	//Testing list of authors
	/* $http.get("/authors/name/John%20Gordon%20Lorimer")
	.success(function (data) {
		authorsBuffer = data;
		$scope.IsAuthorsSingleView = false;
		$scope.authors = authorsBuffer;
	})
	.error(function () {
		console.log("Ops: could not get any data");
	});*/
});