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

                res.status(200).json(data);

            });

        });

        app.post('/addLiked', function (req, res) {
            Comment.addLicked(req.body.commentId ,function (err, data) {
                if (err) {
                    console.log(err);
                    res.status(300).send({msg: err});
                    return false;
                }
                res.send({msg:'支持成功！'})

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