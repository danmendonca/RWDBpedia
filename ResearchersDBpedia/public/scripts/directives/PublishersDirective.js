var app = angular.module('PublishersDirective', []);

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