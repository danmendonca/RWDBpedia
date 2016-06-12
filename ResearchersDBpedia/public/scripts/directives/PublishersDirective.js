var app = angular.module('dbpResearchModule');

app.directive('dbppublishers', function () {
	return {
		templateUrl: 'views/publishers.html'
	};

});
app.directive('dbppublisher', function () {
	return {
		templateUrl: 'views/publisher.html'
	};

});