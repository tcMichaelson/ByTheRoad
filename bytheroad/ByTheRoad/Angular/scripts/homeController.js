(function () {
    angular
        .module('byTheRoad')
        .controller('homeController', function ($location, $http) {
            var self = this;

            self.registering = false;
            self.loggingin = false;
            self.start = false;
            self.search = false;
            self.mainbtn = false;
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
                })
                .error(function () {
                    console.error('Error loggin in.');
                });
            };

            self.register = function () {
                roadService.register(self);
            };

            self.nearbySearch = function () {
                nearbySearch(self.selectedItem, function (data) {
                    self.results = data;
                    console.log(
                        "results = " + self.results);
                });
            };

        });

})();