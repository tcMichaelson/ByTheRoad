(function () {
    angular
        .module('byTheRoad')
        .controller('homeController', function ($location, $http, mapService) {
            var self = this;

            self.registering = false;
            self.loggingin = false;
            self.start = false;
            self.viewingPlaces = false;

            self.mainbtn = false;
            self.value1 = false;
            self.value2 = false;
            self.value3 = false;
            self.b1 = false;
            self.b2 = false;
            self.b3 = false;

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

            self.nearbySearch=function () {
                mapService.categorySearch(self.selectedItem);}

                self.textSearch = function () {
                    mapService.initTextSearch();
                }
            });
        
})();