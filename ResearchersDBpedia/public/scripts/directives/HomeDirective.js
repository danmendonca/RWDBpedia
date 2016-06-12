var app = angular.module('dbpResearchModule', []);

app.factory("MyData", function() {
    return {
        data: {
            queryParam: null
        }
    };
});

app.directive('dbphome', function () {
	return {
		templateUrl: 'views/home.html'
	};

});
