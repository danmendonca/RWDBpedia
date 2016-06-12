var app = angular.module('dbpResearchModule')
.controller('homeController', function ($scope, $http, MyData) {
	$scope.data = MyData.data;

	$scope.searchByBookButton = false;
	$scope.searchByAuthorButton = false;
	$scope.searchByPublisherButton = false;
	
	$scope.updateUi = function() {
	    if ($scope.radio == 'authors')
	        searchAuthorByName();
	}

	var searchAuthorByName = function() {
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
	

});