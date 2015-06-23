// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ease', ['ngResource', 'angular-md5','angular-underscore','ionic', 'angularFileUpload','ease.controllers', 'ease.services', 'ease.filters','ease.directives'])

    .run(function ($rootScope,$ionicPlatform,$stateParams) {

        $rootScope.$stateParams = $stateParams;

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                }
            })

            .state('app.about', {
                url: "/about",
                views: {
                    'menuContent': {
                        templateUrl: "templates/about.html"
                    }
                }
            })

            .state('app.news', {
                url: "/news",
                views: {
                    'menuContent': {
                        templateUrl: "templates/news.html",
                        controller: 'NewsCtrl'
                    }
                }
            })

            .state('app.news-article', {
                url: "/news/:id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/news-article.html",
                        controller: 'NewsAtCtrl'
                    }
                }
            })
            .state('app.user', {
                url: "/user/:username",
                views: {
                    'menuContent': {
                        templateUrl: "templates/user/user.html",
                        controller: 'UserCtrl'
                    }
                }

            })
            .state('app.sig-edit', {
                url: "/user/:username/sig-edit",
                views: {
                    'menuContent': {
                        templateUrl: "templates/user/sig-edit.html",
                        controller: 'UserSigEditCtrl'
                    }
                }

            })
            .state('app.comment',{
                url:"/comment?newsId&userId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/comment.html",
                        controller: 'commentCtrl'
                    }
                }
            })


        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/news');
    });
