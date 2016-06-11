var app = angular.module('authorsModule', [])
.controller('authorsController', function ($scope, $http) {
	
	var authorsBuffer = null;
	var authorByIri = null;
	$scope.IsSingleView = false;
	//
	//
	//setting variables
	$scope.findAuthorByName = function () {
		if (!$scope.nameInputQuery) return;
		var apiCall = "/authors/name/" + $scope.nameInputQuery;
		
		$http.get(apiCall)
		.success(function (data) {
			authorsBuffer = data;
			$scope.authors = authorsBuffer;
			$scope.IsAuthorsSingleView = false;
		}).error(function () { console.log("Oops: could not get any data"); });
	}
	
	$scope.findAuthorByIRI = function () {
		if (!$scope.authorIriInput) return;
		
		var apiCall = "/authors/iri/" + $scope.authorIriInput;
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
	$http.get("/authors/name/John")
	.success(function (data) {
		authorsBuffer = data;
		$scope.IsAuthorsSingleView = false;
		$scope.authors = authorsBuffer;
	})
	.error(function () {
		console.log("Ops: could not get any data");
	});
});