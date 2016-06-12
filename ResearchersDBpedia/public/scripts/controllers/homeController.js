var app = angular.module('dbpResearchModule')
.controller('homeController', function ($scope, $http) {
	
	$scope.searchByBookButton = false;
	$scope.searchByAuthorButton = false;
	$scope.searchByPublisherButton = false;
	
	$scope.searchByBook = function () {
		if (!$scope.searchByBookButton) return;
		
		// TODO resto da função:
		var apiCall = "/authors/name/" + $scope.nameInputQuery;
		
		$http.get(apiCall)
		.success(function (data) {
			authorsBuffer = data;
			$scope.authors = authorsBuffer;
			$scope.IsAuthorsSingleView = false;
		}).error(function () { console.log("Oops: could not get any data"); });
	}

	$scope.searchByAuthor = function () {
		if (!$scope.searchByAuthorButton) return;
		
		// TODO resto da função:
		var apiCall = "/authors/name/" + $scope.nameInputQuery;
		
		$http.get(apiCall)
		.success(function (data) {
			authorsBuffer = data;
			$scope.authors = authorsBuffer;
			$scope.IsAuthorsSingleView = false;
		}).error(function () { console.log("Oops: could not get any data"); });
	}

	$scope.searchByPublisher = function () {
		if (!$scope.searchByPublisherButton) return;
		
		// TODO resto da função:
		var apiCall = "/authors/name/" + $scope.nameInputQuery;
		
		$http.get(apiCall)
		.success(function (data) {
			authorsBuffer = data;
			$scope.authors = authorsBuffer;
			$scope.IsAuthorsSingleView = false;
		}).error(function () { console.log("Oops: could not get any data"); });
	}
	

});