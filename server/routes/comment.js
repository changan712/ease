var Comment = require('../model/commentModel.js');

module.exports = function (app) {
    // console.log(apiConfig.api_url_newslist);

    app.namespace('/api/comment', function () {

        app.post('/', function (req, res) {
            Comment.create(req.body, function (err, data) {
                if (err) {
                    console.log(err);
                    return false;
                }

                res.status(200).json({msg: '评论成功！'});

            });

        });

        app.post('/addLiked', function (req, res) {
            Comment.addLicked(req.body.commentId,req.body.user, function (err, data) {
                if (err) {
                    console.log(err);
                    res.status(300).send({msg: err});
                    return false;
                }

                res.send(data)

            })

        });

        app.post('/removeLiked', function (req, res) {

            console.log(req.body);
            Comment.removeLicked(req.body.commentId,req.body.user, function (err, data) {
                if (err) {
                    console.log(err);
                    res.status(300).send({msg: err});
                    return false;
                }

                res.send(data)

            })

        });
        app.get('/', function (req, res) {

            if (req.query.newsId) {
                Comment.findByNewsId(req.query.newsId, req.query, function (err, data) {
                    if (err) console.log(err);
                    res.send(data);
                });

            } else if (req.query.userName) {
                Comment.findByUserName(req.query.userName, req.query, function (err, data) {
                    if (err) console.log(err);
                    res.send(data);
                });
            } else {
                res.json({msg: '参数错误'})
            }

        });

    })

};