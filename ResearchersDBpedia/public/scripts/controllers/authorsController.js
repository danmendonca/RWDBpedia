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
});