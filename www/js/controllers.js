angular.module('ease.controllers', [])

    .controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $ionicPopover, $state, $timeout, User, UserInfo, md5) {
        // Form data for the login modal
        $scope.loginData = {};
        $scope.loginErrorText = '';
        $rootScope.userInfo = UserInfo.get();

        $scope.$on('userinfochange', function (e, data) {
            $rootScope.userInfo = data;
        });

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.closeLogin = function () {
            $scope.modal.hide();
        };
        $scope.login = function () {
            $scope.modal.show();
        };
        $scope.doLogin = function () {
            if ($scope.loginData.username && $scope.loginData.password) {

                User.login({}, {
                    username: $scope.loginData.username,
                    password: md5.createHash($scope.loginData.password)
                }, function (res) {
                    UserInfo.save(res);
                    $scope.closeLogin();
                }, function (err) {
                    $scope.loginErrorText = err.data;
                });

            } else {
                $scope.loginErrorText = '请输入用户名和密码';
            }
        };


        $scope.loginInputChange = function () {
            $scope.loginErrorText = '';
        };

        $scope.showUserInfo = function () {
            $state.go('app.user', {username: $scope.userInfo.username});
        }
    })


    .controller('NewsCtrl', ['$scope', '$timeout', 'News', function ($scope, $timeout, News) {
        $scope.newslist = [];
        // $scope.newslist = News.query();
        var page = 0;
        $scope.loadMore = function () {
            News.query({skip: page * 20}, function (newsArray) {
                $timeout(function () {
                    $scope.newslist = $scope.newslist.concat(newsArray);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.resize');
                    page++;
                }, 1000)
            });
        }
    }])
    .controller('NewsAtCtrl', ['$scope', '$state', '$sce', 'News', function ($scope, $state, $sce, News) {

        $scope.rendHtml = function (html) {
            return $sce.trustAsHtml(html)
        };
        $scope.news = News.get({id: $state.params.id})
    }])

    .controller('UserCtrl', function ($scope, FileUploader, $ionicActionSheet, User, UserInfo) {

        $scope.showAvatarActionSheet = function () {
            $ionicActionSheet.show({
                buttons: [
                    {text: '拍照'},
                    {text: '<div>选择一张照片</div>'}
                ],

                titleText: '请选择图片来源',
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    switch (index) {
                        case 0:
                            return true;
                            break;
                        case 1:
                            alert(2);
                            break;
                    }

                    return false;
                }
            });
        }

    })
    .controller('UserSigEditCtrl', function ($rootScope, $scope, $state, $ionicLoading, $ionicPopup, User, UserInfo) {

        var vm = $scope.vm = {};
        var maxLength = 50;

        vm.sig = $rootScope.userInfo.signature;

        $scope.$watch('vm.sig', function () {
            vm.remainLength = maxLength - vm.sig.length;
        });


        $scope.updateSig = function () {
            //$ionicLoading.show();
            User.save({
                username: $rootScope.userInfo.username,
                method: 'sig-edit'
            }, {signature: vm.sig}, function (data) {
                UserInfo.set({signature: data.signature});
                $ionicLoading.hide();
                window.history.back();

            }, function () {
                $ionicPopup.alert(
                    {
                        title: '错误',
                        template: ' 更新失败，请稍后再试！'
                    }
                );
            })
        }

    });
