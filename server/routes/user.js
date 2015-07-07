var User = require('../model/userModel');
var multipart = require('connect-multiparty')();
var fs = require('fs.extra');
var im = require('imagemagick');


module.exports = function (app) {
    // console.log(apiConfig.api_url_newslist);
    app.namespace('/api/user', function () {
        app.get('/', function (req, res) {

        });

        app.put('/reg', function (req, res) {
            User.getByUserName(req.body.username, function (err, data) {
                if (err) {
                    console.log(err)
                }
                if (data) {
                    res.status(300).send({msg: '该用户已存在'})
                } else {
                    User.create(req.body, function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                        res.json(data);
                    })
                }
            });


        });

        app.post('/login', function (req, res) {

            User.getByUserName(req.body.username, function (err, data) {
                if (err) {
                    console.log(err);
                    return false;
                }

                if (data && data.password == req.body.password) {
                    data.password = '';
                    res.send(data)
                } else {
                    res.status(300).send('用户名或密码错误');
                }


            })
        });

        app.get('/getUsers', function (req, res) {
            var userArr = typeof  req.query.arrUserName == "string"? [req.query.arrUserName]:req.query.arrUserName;

            User.getUsers(userArr, function (err, data) {
                if (err) {
                    console.log(err);
                }
                if (data && data.length) {
                    res.json(data)
                } else {
                    res.status(300).json({msg: '没有查询用户'});
                }

            });
        });

        app.get('/:username', function (req, res) {
            User.getByUserName(req.params.username, function (err, data) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    if (data) {
                        data.password = '';
                        res.send(data);
                    } else {
                        res.status(404).json({msg: '用户不存在'});
                    }
                }
            )
        });

        app.post('/:username/sig-edit', function (req, res) {
            User.updateByUserName(req.params.username, {signature: req.body.signature}, function (err, data) {
                if (err) {
                    console.log(err);
                    return false;
                }
                res.status(200).send(data)
            })
        });

        app.post('/:username/avatar-edit', multipart, function (req, res) {
            var file = req.files.file;

            if (file.headers['content-type'] != 'image/jpeg' && file.headers['content-type'] != 'image/jpg' && file.headers['content-type'] != 'image/gif' && file.headers['content-type'] != 'image/png') {
                res.status(300).json({msg: '请上传正确的图片格式'});
                return;
            }
            if (file.size > (1024 * 1024 * 10)) {
                res.status(300).json({msg: '图片太大，请选择小于10m的图片'});
                return;
            }

            var tmp_path = file.path;
            var nName = (new Date()).getTime() + file.name;
            var target_path = './www/upload/' + nName;


            fs.move(tmp_path, target_path, function (err) {
                if (err) console.log(err);

                User.updateByUserName(req.params.username, {avatar: '/upload/' + nName}, function (err, data) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    res.status(200).send(data)
                })

            });

            /*   im.resize({
             srcData: fs.readFileSync(tmp_path, 'binary'),
             width: 100,
             height: 100
             }, function (err, stdout, stderr) {

             if (err) {
             console.log(err);
             }
             */

        });
    });
};