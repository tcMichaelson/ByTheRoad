(function () {
    angular
        .module('byTheRoad')
        .controller('homeController', function ($location, $http) {
            var self = this;
            self.login = function () {
                $http.post('/token', "grant_type=password&username=" + self.username + "&password=" + self.password,
                    {
                        hearders: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                .success(function (data) {
                    token = data.access_token;
                    $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
                    $location.path('/list');
                })
                .error(function () {
                    con.error('Error loggin in.');
                });
            };
        });
})();