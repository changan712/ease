angular.module('ease.controllers', [])

    .controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $ionicPopover, $state, $timeout, User, UserInfo, md5, Tips) {
        // Form data for the login modal

        $rootScope.userInfo = UserInfo.get();

        $scope.showUserInfo = function () {
            $state.go('app.user', {username: $scope.userInfo.username});
        };

        $scope.$on('userinfochange', function (e, data) {
            $rootScope.userInfo = data;
        });

        //modal login
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalLogin = modal;
        });

        $scope.closeLogin = function () {
            $scope.modalLogin.hide();
        };
        $scope.login = function () {
            $scope.modalLogin.show();
        };

        //logout
        $scope.logout = function () {
            UserInfo.remove();

            $state.go('app.news')
        };


        //modal reg
        $ionicModal.fromTemplateUrl('templates/reg.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalReg = modal;
        });

        $scope.closeReg = function () {
            $scope.modalReg.hide();
        };
        $scope.reg = function () {
            $scope.modalReg.show();
        };


    })
    .controller('loginCtrl', function ($rootScope, $scope, $ionicModal, $ionicPopover, $state, $timeout, User, UserInfo, md5, Tips) {
        // login

        $scope.loginData = {};
        $scope.loginErrorText = '';
        $scope.doLogin = function () {
            if ($scope.loginData.username && $scope.loginData.password) {

                User.login({}, {
                    username: $scope.loginData.username,
                    password: md5.createHash($scope.loginData.password)
                }, function (res) {
                    console.log(res);
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
    })


    .controller('regCtrl', function ($rootScope, $scope, $ionicModal, $ionicPopover, $state, $timeout, User, UserInfo, md5, Tips) {
        //reg

        $scope.regData = {};
        $scope.regErrorText = '';

        $scope.doReg = function () {
            if ($scope.regData.username && $scope.regData.password && (  $scope.regData.password == $scope.regData.password2)) {
                User.reg({},
                    {
                        username: $scope.regData.username,
                        password: md5.createHash($scope.regData.password)
                    }
                ).$promise.then(function (res) {
                        Tips.show('注册成功！');
                        $scope.closeReg();
                        UserInfo.save(res);
                        $state.go('app.user', {username: res.username});

                    }, function (data) {
                        console.log(data);
                        Tips.show(data.msg)
                    })
            }

        };

    })


    .controller('NewsCtrl', ['$scope', '$timeout', '$ionicScrollDelegate', 'News', function ($scope, $timeout, $ionicScrollDelegate, News) {
        $scope.newslist = [];
        //
        var page = 0;
        $scope.doRefresh = function () {
            page = 0;
            News.query({skip: 0}, function (newsArray) {
                $ionicScrollDelegate.$getByHandle('news-content').scrollTop();
                $scope.newslist = newsArray;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.resize');
                page++;

            }, function (e) {
                console.log(e);
            });
        };

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


    .controller('UserCtrl', function ($rootScope, $scope, FileUploader, $ionicActionSheet, Tips, User, apiHost, UserInfo) {
        var vm = $scope.vm = {};
        var uploader = $scope.uploader = new FileUploader({
            url: apiHost + '/api/user/' + $rootScope.userInfo.username + '/avatar-edit'

        });
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            Tips.show(response.msg);
            vm.avatar = '';

        };

        uploader.onSuccessItem = function (i, data) {
            UserInfo.set({avatar: data.avatar});
            Tips.show('修改成功');

        };

        //
        $scope.readerError = function () {

            Tips.show('文件格式错误');
            vm.avatar = '';
        };


        $scope.$watch('vm.avatar', function (n, o) {
            if (n)
                $scope.showAvatarActionSheet();
        });

        $scope.showAvatarActionSheet = function () {
            $ionicActionSheet.show({
                buttons: [
                    {text: '确定'}
                ],

                titleText: '确认选中图片',
                cancelText: '取消',
                cancel: function () {
                    vm.avatar = '';
                },
                buttonClicked: function (index) {
                    switch (index) {
                        case 0:
                            uploader.uploadAll();
                            return true;
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

    })
    .controller('commentCtrl', ['$scope', '$q', '$state', 'Comment', 'User', function ($scope, $q, $state, Comment, User) {
        $scope.newsId = $state.params.newsId;
        getComment().then(function (data) {
            $scope.list = data;

        });

        function getAvatarByUserName(userName, userArr) {

            var userFinded = _.find(userArr, function (user) {
                return userName == user.username
            });

            return userFinded.avatar;

        }

        function getComment(skip) {
            var def = $q.defer();
            Comment.query({newsId: $scope.$parent.newsId, skip: skip || 0}).$promise.then(function (data) {
                var arrUserName = [];
                _.each(data, function (ar) {
                    arrUserName.push(ar.userName)
                });

                arrUserName = _.uniq(arrUserName);

                User.getUsers({arrUserName: arrUserName}).$promise.then(function (userData) {
                    _.each(data, function (comment) {
                        comment.avatar = getAvatarByUserName(comment.userName, userData);
                    })
                }, function () {
                    // console.log(data.mes)
                });

                def.resolve(data);

            }, function () {
                def.reject('获取评论失败');
            });

            return def.promise;
        }
    }])
    .controller('NewsAtCtrl', ['$rootScope', '$scope', '$state', '$sce', '$ionicModal', 'Tips', 'News', 'Comment', function ($rootScope, $scope, $state, $sce, $ionicModal, Tips, News, Comment) {

        var newsId = $scope.newsId = $state.params.id;
        $scope.rendHtml = function (html) {
            return $sce.trustAsHtml(html)
        };

        $scope.news = News.get({id: newsId});

        //modal comments
        $ionicModal.fromTemplateUrl('templates/comment.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalComments = modal;
        });


        $scope.showComments = function () {
            $scope.modalComments.show();
        };

        $scope.closeComment = function () {
            $scope.modalComments.hide();
        }


    }])

;
