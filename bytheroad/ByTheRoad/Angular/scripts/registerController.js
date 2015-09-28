(function () {
    angular
        .module('byTheRoad')
        .controller('registerController', function (roadService) {
            var self = this;

            self.register = function () {
                roadService.register(self);
            };
        });
})();