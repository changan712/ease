var Comment = require('../model/commentModel.js');

module.exports = function (app) {
    // console.log(apiConfig.api_url_newslist);

    app.namespace('/api/comment', function () {

        app.post('/', function (req, res) {
            Comment.create({
                userName: 'ddd',
                newsId: '5693463'
            }, function (err, data) {
                if (err) {
                    console.log(err);
                    return false;
                }

                res.status(200).json({msg:'评论成功！'});

            });

        });
        app.get('/', function (req, res) {
            News.fetch(req.query, function (err, data) {
                if (err) {
                    console.log(err);

                }
                res.send(data)
            });
        });
        app.get('/:id', function (req, res) {
            News.findById(req.params.id, function (err, data) {
                if (err) {
                    console.log(err);
                }
                res.send(data);
            })
        });
    })

};