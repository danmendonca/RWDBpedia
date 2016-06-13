var app = angular.module('dbpResearchModule')
.controller('authorsController', function ($scope, $http, MyData) {
	$scope.data = MyData.data;
	$scope.data.author = null;
	$scope.data.authors = null;
	//
	//
	//setting variables
	$scope.findAuthorByName = function () {
		if (!$scope.nameInputQuery) return;
		var apiCall = "/authors/name/" + $scope.data.queryParam;
		
		$http.get(apiCall)
		.success(function (data) {
			$scope.authors = data;
		}).error(function () { console.log("Oops: could not get any data"); });
	}
	
	$scope.findAuthorByIRI = function () {
		if (!$scope.authorIriInput) return;
		
		var apiCall = "/authors/iri/" + $scope.data.queryParam;
		$http.get(apiCall)
		.success(function (data) {
			$scope.author = data;
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