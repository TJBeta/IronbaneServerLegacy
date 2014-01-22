// preferences.js
angular.module('IronbaneApp')
    .controller('PreferencesCtrl', ['User', '$scope', '$http', '$log', '$rootScope', '$anchorScroll',
        function(User, $scope, $http, $log, $rootScope, $anchorScroll) {
            $scope.user = angular.copy($rootScope.currentUser);
            $rootScope.currentUser.info_gender === 0 ? $scope.user.info_gender = 'male' : $scope.user.info_gender = 'female';
            $log.log($scope.user);
            $scope.genderOptions = [{
                gender: "male"
            }, {
                gender: "female"
            }];

            $scope.togglePW = false;
            $scope.saveError = false;
            $scope.saveSuccess = false;

            $scope.save = function() {
                $log.debug("save user: ", $scope.user);
                $scope.saveError = false;
                $scope.saveSuccess = false;

                if($scope.user.password_new) {
                    if(!$scope.user.password_old) {
                        $scope.saveError = true;
                        $scope.saveErrorMsg = "You must enter your old password to set a new one.";
                        $anchorScroll();
                        return;
                    }
                }

                $http.post('/api/user/preferences', $scope.user)
                    .success(function(response) {
                        User.getCurrentUser()
                            .then(function(user) {
                                angular.copy(user, $rootScope.currentUser);
                            });
                        $scope.saveSuccess = true;
                        $scope.saveSuccessMsg = "Update succesful!";

                        // clear values for further submissions
                        delete $scope.user.password_old;
                        delete $scope.user.password_new;

                        $anchorScroll();
                    })
                    .error(function(response) {
                        $log.warn('update error', response);
                        $scope.saveError = true;
                        $scope.saveErrorMsg = response;
                        $anchorScroll();
                    });
            };
        }
    ]);