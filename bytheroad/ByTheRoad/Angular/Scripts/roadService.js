(function () {
    angular
    .module('byTheRoad')
    .service('roadService', ['$resource', 'routeUrls', '$route', '$location', '$http', function ($resource, routeUrls, $route, $location, $http) {
        var Register = $resource(routeUrls.registerApi, {}, {});
        var self = this;

        self.register = function (user, success, fail) {
            new Register(user).$save(function (data) {

                success();

                $http.post('/token', "grant_type=password&username=" + user.Email + "&password=" + user.Password,
                    { 
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                    })

                .success(function (data) {
                    token = data.access_token;
                    $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
                    

                })

                .error(function () {
                    console.error('Error logging in.');
                    //self.RegisterError = true;
                    //callBack("Failed to reister");
                });

                console.log(data);
            }, function (response) {
                error();
            })
            self.update = function (revievToUpdate) {
                revievToUpdate.$save();
                self.updateReview = null;
            };
            self.remove = function (ReviewToRemove) {
                ReviewToRemove.$remove({ id: ReviewToRemove.Id }, function () {
                    self.reviews = self.reviews.filter(function (review) {
                        return review.Id !== ReviewToRemove.Id;
                    });
                });
            };
        }
    }]);
})();



