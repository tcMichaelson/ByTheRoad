(function () {
    angular
        .module('byTheRoad')
        .controller('homeController', function ($location, $http) {
            var self = this;
            self.searching = false;
            self.registering = false;
            self.loggingin = false;
            self.login = function () {
                $http.post('/token', "grant_type=password&username=" + self.username + "&password=" + self.password,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                .success(function (data) {
                    token = data.access_token;
                    $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
                    $location.path('/list');
                })
                .error(function () {
                    console.error('Error loggin in.');
                });
            };
        });
})();