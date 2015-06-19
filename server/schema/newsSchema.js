var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    time: Date,
    updateTime: Date,
    keywords: Array,
    liked: {
        type: Number,
        default: 0
    },
    intro: {
        type: String,
        default: '暂无描述'
    },
    commented: {
        type: Number,
        default: 0
    },
    viewed: {
        type: Number,
        default: 0
    }
});

NewsSchema.statics = {
    fetch: function (options, cb) {
        return this
            .find({})
            .skip(options.skip || 0)
            .limit(options.limit || 20)
            .sort({'time': -1})
            .exec(cb);
    },
    findById: function (id, cb) {
        var _this = this;
        this
            .update({id: id}, {$inc: {viewed: 1}})
            .exec(function () {
                _this
                    .findOne({id: id})
                    .exec(cb);
            });
    }

};

module.exports = NewsSchema;

