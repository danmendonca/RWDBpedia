var app = angular.module('dbpResearchModule')
.controller('publishersController', function ($scope, $http, MyData) {
	$scope.data = MyData.data;
	$scope.data.publishers = null;
	$scope.data.publisher = null;
	$scope.data.publisherIriParam = null;
	$scope.data.publisherNameParam = null;
	$scope.data.isPublisherView = false;
	$scope.data.isPublishersView = false;
	
	var setViewsDisplay = function (single, multiple) {
		$scope.isPublisherView = single;
		$scope.isPublishersView = multiple;
	}
	
	$scope.findPublisherByName = function () {
		if (!$scope.publisherNameParam) return;
		
		var apiCall = "/publisher/name/" + $scope.publisherNameParam;
		$http.get(apiCall)
	        .success(function (data) {
			$scope.publishers = data;
			setViewsDisplay(false, true);
		})
			.error(function () {
			console.log("publishersController-findBublisherByName: Oops, something went wrong.");
		});
		
		setViewsDisplay(false, true);

	};
	$scope.findPublisherByIri = function () {
		if (!$scope.publisherIriParam) return;
		
		var apiCall = "/publisher/iri/" + $scope.publisherNameParam;
		$http.get(apiCall)
	        .success(function (data) {
			$scope.data.publishers = data;
		})
			.error(function () {
			console.log("publishersController-findBublisherByIri: Oops, something went wrong.");
		});
	};
	//
	//
	//TEST
	/*$http.get("/publisher/name/Virgin")
	.success(function (data) {
		$scope.publishers = data;
		setViewsDisplay(true, false);
	})
	.error(function () {
		console.log("publishersController-findBublisherByIri: Oops, something went wrong.");
	});*/




});