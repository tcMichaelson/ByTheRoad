'use strict';
(function () {
    angular
        .module('byTheRoad')
        .service('authUserService', function ($http) {
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


                    GetUser();
                })
                       .error(function (error) {

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
                   
                  getData();
                })
                .error(function (error) {
                    error();
                });
            }



       
        });
})();

