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
;