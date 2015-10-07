(function () {
    angular
    .module('byTheRoad')
    .service('roadService', ['$resource', 'routeUrls', '$route', '$location', '$http', function ($resource, routeUrls, $route, $location, $http) {
        var Register = $resource(routeUrls.registerApi, {}, {});
        var self = this;

        self.register = function (user) {
            new Register(user).$save(function (data) {

                $http.post('/token', "grant_type=password&username=" + self.username + "&password=" + self.password, 
                    { 
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                    })

                .success(function (data) {
                    token = data.access_token;
                    $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
                   

                })

                .error(function () {
                    console.error('Error logging in.');
                });

                console.log(data);
            })
        }
    }]);
})();



