(function () {
    angular
    .module('byTheRoad')
    .service('roadService', ['$resource', 'routeUrls', '$route', '$location', '$http', function ($resource, routeUrls, $route, $location, $http) {
        var Register = $resource(routeUrls.registerApi, {}, {});
        var self = this;

        self.register = function (user, success, fail) {
            new Register(user).$save(function (data) {
                console.log("user in register/login", user);
                

                $http.post('/token', "grant_type=password&username=" + user.Email + "&password=" + user.Password,
                    { 
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                    })

                .success(function (data) {
                    token = data.access_token;
                    $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
                    

                    success(data.access_token);
                   

                })

                .error(function () {
                    console.error('Error logging in.');
                    self.hasError = true;
                    self.errorMessage = "Error logging in during registration";
                });

                console.log(data);
            }, function (response) {
                fail(response);
            })
            
        }

    }]);
})();



