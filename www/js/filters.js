angular.module('ease.filters', [])

    .filter('sex', function () {
        var sexConf = {
            female: 'ion-female',
            male: 'ion-male'
        };

        var sexTxtConf = {
            female: '女',
            male: '男'
        };

        return function (input,type) {
            if(type == 0){
                return sexTxtConf[input];
            }else{
                return sexConf[input];
            }

        }
    });