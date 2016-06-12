var app = angular.module('dbpResearchModule')
.controller('publishersController', function ($scope, $http) {
	
	$scope.publishers = null;
	$scope.publisher = null;
	$scope.publisherIriParam = null;
	$scope.publisherNameParam = null;
	$scope.isPublisherView = false;
	$scope.isPublishersView = false;
	
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
			$scope.publisher = data;
			setViewsDisplay(true, false);
		})
			.error(function () {
			console.log("publishersController-findBublisherByIri: Oops, something went wrong.");
		});
	};
	//
	//
	//TEST
	$http.get("/publisher/name/Virgin")
	.success(function (data) {
		$scope.publishers = data;
		setViewsDisplay(true, false);
	})
	.error(function () {
		console.log("publishersController-findBublisherByIri: Oops, something went wrong.");
	});




});