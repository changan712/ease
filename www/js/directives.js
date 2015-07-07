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
            scope: {
                newsId: '='
            }

        }
    })
    .directive('replied', function () {

        return {
            restrict: 'EA',
            scope: {},
            replace: true,
            template: '<ul class="rpList small gray"><li ng-repeat="rp in rpLists" class="replied-li"><div class="rp-tp ">{{rp.userName}}</div>{{rp.text}}</li></ul>',
            link: function (scope, element, attrs) {
                scope.rpLists = [];
                getReplyList(scope.$parent.li);
                function getReplyList(li) {
                    var rp = li.reply;
                    if (rp) {
                        scope.rpLists.push(rp);
                        getReplyList(rp)
                    }
                }
            }
        };


    })
;

