angular.module('ease.directives', [])
    .directive("fileread", [function () {
        return {
            scope: {
                fileread: "=",
                readerError: "&"
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {

                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);

                    reader.onerror = function () {
                        scope.readerError();
                    }
                });


            }
        }
    }])
    .directive('contenteditable', ['$sce', function ($sce) {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                };

                // Listen for change events to enable binding
                element.on('blur keyup change', function () {
                    scope.$evalAsync(read);
                });
                read(); // initialize

                // Write data to the model
                function read() {
                    var text = element.text();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if (attrs.stripBr && text == '<br>') {
                        text = '';
                    }
                    ngModel.$setViewValue(text);
                }
            }
        };
    }])

    .directive('commentFooter', function () {
        return {
            restrict: 'EA',
            templateUrl: 'templates/comment-footer.html',
            scope:{
                newsId:'='
            },
            controller:function($rootScope,$scope,Comment,Tips,News){
                //发表评论

                var newsId = $scope.newsId;
                $scope.sendComment = function () {
                    if ($scope.comments.trim().length) {
                        Comment.save({}, {
                            userName: $rootScope.userInfo.username,
                            newsId: newsId,
                            text: $scope.comments,
                            time: new Date()
                        }, function (data) {

                            Tips.show(data.msg);
                            $scope.comments = '';
                            News.updateCommented({id: newsId, method: 'addCommented'});
                            $scope.$parent.news.commented++;
                        }, function () {
                            Tips.show('评论失败，请稍后再试!');
                            $scope.comments = '';
                        })
                    }
                };
            },
            link:function(scope){
                console.log(scope.newsId)
            }

        }
    })
;
