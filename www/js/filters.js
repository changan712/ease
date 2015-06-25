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

        return function (input, type) {
            if (type == 0) {
                return sexTxtConf[input];
            } else {
                return sexConf[input];
            }

        }
    })
    .filter('myDate', function () {
        return function (input) {
            if (input) {

                var time = new Date(input).getTime(),
                    now = new Date().getTime(),
                    dt = now - time;

                if (2 * 24 * 60 * 60 * 1000 > dt && dt >= 24 * 60 * 60 * 1000) {
                    return '前天';
                }
                else if (2 * 24 * 60 * 60 * 1000 > dt && dt >= 24 * 60 * 60 * 1000) {
                    return '昨天';
                } else if (24 * 60 * 60 * 1000 > dt && dt >= 60 * 60 * 1000) {
                    return Math.round(dt / (60 * 60 * 1000)) + '小时前'
                } else if (60 * 60 * 1000 > dt && dt >= 60 * 1000) {
                    return Math.round(dt / (60 * 1000)) + '分钟前'
                }
                else if (60 * 1000 > dt && dt >= 1000) {
                    return Math.round(dt / 1000) + '秒前'
                }
                else {
                    return input;
                }
            } else {
                return '未知时间'
            }
        }
    });

