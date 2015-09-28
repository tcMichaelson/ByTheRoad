(function () {
    angular
        .module("bugTracker")
        .controller('registerController', function (roadService) {
            var self = this;

            self.register = function () {
                roadService.register(self);
            };
        });
})();