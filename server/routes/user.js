var User = require('../model/userModel');

module.exports = function (app) {
    // console.log(apiConfig.api_url_newslist);
    app.namespace('/api/user', function () {
        app.get('/', function (req, res) {

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
                    res.status(401).send('用户名或密码错误');
                }


            })
        });

        app.get('/:username', function (req, res) {
            User.getByUserName(req.params.username, function (err, data) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    data.password = '';
                    res.send(data)
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

        app.post('/:username/avatar-edit', function (req, res) {
            User.updateByUserName(req.params.username, {avatar: req.body.avatar}, function (err, data) {
                if (err) {
                    console.log(err);
                    return false;
                }
                res.status(200).send(data)
            })
        })


    });


};