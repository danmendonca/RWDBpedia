var app = angular.module('dbpResearchModule')
.controller('booksController', function ($scope, $http, MyData) {
	$scope.data = MyData.data;
	$scope.data.listOfBooks = false;
	$scope.data.singleBook = false;
	$scope.data.book = null;
	$scope.data.books = null;
	
	$scope.findBookByIsbn = function () {
		if (!$scope.bookIsbnParam) return;
		
		var apiCall = "/book/isbn/" + $scope.bookIsbnParam;
		$http.get(apiCall)
		.success(function (data) {
			$scope.data.book = data;
			$scope.data.singleBook = true;
			$scope.data.listOfBook = false;
		})
		.error(function () {
			console.log("Oops: could not get any data");
		});
	}
});