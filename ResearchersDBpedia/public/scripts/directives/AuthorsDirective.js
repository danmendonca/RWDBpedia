var app = angular.module('AuthorsDirective', []);

app.directive('dbpauthors', function () {
	return {
		templateUrl: 'views/authors.html'
	};

});

//app.directive('dbpauthor', function () {
//	return {
//		templateUrl: 'views/author.html'
//	};

//});