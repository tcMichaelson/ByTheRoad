'use strict';
(function () {
    angular
        .module('byTheRoad')
        .service('authUserService', function ($http) {
            var self = this;
            this.getData = function (callbackFunc) {
                $http({

                    method: 'GET',
                    url: 'Api/Profile',
                    headers: { 'Authorization': 'bearer ' + sessionStorage.getItem('token') }
                }).success(function (data) {

                    callbackFunc(data);
                }).error(function () {
                    alert("error");
                });
            }



            this.update = function (user) {
                $http({
                    method: 'POST',
                    url: 'Api/Profile',
                    data: {
                        FirstName: user.FirstName,
                        LastName: user.LastName,
                        Email: user.Email
                    }
                }).success(function (data) {

                    this.status = "The Person Saved Successfully!!!";

                    GetUser();
                })
                       .error(function (error) {

                           this.status = 'Unable to create a person: ' + error.message;
                       });
            }


          

          this.delete = function (userId, success, error) {
                //Defining $http service for deleting a person
                $http({
                    method: 'DELETE',
                    url: '/Api/Profile/' + userId
                  
                })
                .success(function (data) {
                    success("This was a success");
                   self.status = "The Person Deleted Successfully!!!";
                   
                  getData();
                })
                .error(function (error) {
                    error();
                    self.status = 'Unable to delete a person: ' + error.message;
                });
            }



       
        });
})();

