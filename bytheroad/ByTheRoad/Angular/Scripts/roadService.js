(function () {
    angular
    .module('byTheRoad')
    .service('roadService', ['$resource', 'routeUrls', '$route', '$location', function ($resource, routeUrls, $route, $location) {
        var Register = $resource(routeUrls.registerApi, {}, {});
        var self = this;

        self.register = function (user) {
            new Register(user).$save(function(data) {
                console.log(data);
            })
        }
    }]);
})();