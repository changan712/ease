var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;


var CommentSchema = new mongoose.Schema({
    userName: String,
    newsId: String,
    text: String,
    reply: Object,
    time: Date,
    liked: {
        type: Number,
        default: 0
    },
    replayed: {
        type: Number,
        default: 0
    }
}, {
    collection: 'comment'
});
CommentSchema.statics = {
    findByUserName: function (userName, options, cb) {
        return this
            .find({userName: userName})
            .sort({time: -1})
            .skip(options.skip || 0)
            .limit(options.limit | 20)
            .exec(cb);

    },
    findByNewsId: function (newsId, options, cb) {
        return this
            .find({newsId: newsId})
            .sort({time: -1})
            .skip(options.skip || 0)
            .limit(options.limit | 40)
            .exec(cb);

    },
    findHot: function () {
        return this
            .find({newsId: newsId})
            .sort({replayed: 1, liked: 1})
            .limit(options.limit | 10)
            .exec(cb);
    },
    addLicked: function (commentId, cb) {
        return this
            .update({_id: new ObjectID(commentId)}, {"$inc": {liked: 1}})
            .exec(cb);
    },
    removeLicked: function (commentId, user, cb) {
        return this
            .update({_id: new ObjectID(commentId)}, {"$pull": {liked: user}})
            .exec(cb);
    }
};

module.exports = CommentSchema;

