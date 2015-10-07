(function () {
    angular
        .module('byTheRoad', ['ngRoute', 'ngResource'])
    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'angular/views/home.html',
            controller: 'homeController',

            controllerAs: 'self'
        })

    })
})();