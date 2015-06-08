var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    userName: String,
    newsId: String,
    at: String,
    liked: {
        type: string,
        default: 0
    }
}, {
    collection: 'comment'
});
NewsSchema.statics = {
    findByUserName: function (userName,options,cb) {
        return this
            .find({userName: userName})
            .skip(options.skip||0)
            .skip(options.limit|20)
            .exec(cb);

    },
    findByNewsId: function (newsId,options,cb) {
        return this
            .find({newsId: newsId})
            .skip(options.skip||0)
            .skip(options.limit|40)
            .exec(cb);

    }
};

module.exports = NewsSchema;

