var http = require('http');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var News = require('./newsModel');
var later = require('later');
var url = "http://www.ce.cn/spaqw/sawsaxw/";

var fds = {
    insetNewsList: function () {

        getNews(url, function ($) {

                var lis = $('.lb li');
                console.log('start to get news list from "www.ce.cn"');
                for (var i = 0; i < lis.length; i++) {
                    var obj = {};
                    var item = lis.eq(i);
                    var link = 'http://www.ce.cn/' + item.find('a').attr('href').replace('../../', '');

                    obj.title = item.find('a').text();
                    (/\/t(\w*)_(\w*).shtml$/g).test(link);
                    var gstr = RegExp.$1;

                    obj.time = new Date(gstr.substr(0, 4) + '-' + gstr.substr(4, 2) + '-' + gstr.substr(6, 2));
                    obj.id = RegExp.$2;

                    (function () {
                        var _id = obj.id;
                        var _obj = obj;
                        getNews(link, function ($) {
                            _obj.description = $('.TRS_Editor').html();
                            _obj.keywords = fds.getKeywords($);

                            News.findById(_id, function (err, data) {
                                if (err) {
                                    console.log(err);
                                }

                                if (data) {
                                    return false;
                                } else {
                                    var newNews = new News(_obj);
                                    newNews.save();
                                }
                            })
                        })
                    })();
                }
            }
        );
    },
    getKeywords: function ($) {
   var metas = $('html meta');
        var keywords = [];
        for (var i = 0; i < metas.length; i++) {
            if (metas.eq(i).attr('name')&&metas.eq(i).attr('name').toLowerCase() == 'keywords') {
                keywords = metas.eq(i).attr('content').split(';');
                break;
            }
        }
        return keywords;

    },
    run: function () {
        var _this = this;
        var textSched = later.parse.text('every 1 hour');
        this.time = later.setInterval(function () {
            _this.insetNewsList();
        }, textSched);
    },
    stop: function () {
        this.time.clear();
    }
};


function getNews(url, callback) {

    http.get(url, function (res) {
        res.setEncoding('binary');
        var source = "";

        res.on('data', function (data) {
            source += data;
        });

        res.on('end', function () {
            var buf = new Buffer(source, 'binary');
            var str = iconv.decode(buf, 'GBK');

            var $ = cheerio.load(str, {
                xmlMode: false, decodeEntities: false
            });
            callback($);
        });
    })
}


module.exports = fds;




