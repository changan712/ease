var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    sex: String,
    avatar: {
        type: String,
        default: '/img/avatar.jpg'
    },
    newsCollected: Array,
    signature: {
        type: String,
        default: '这个家伙很懒，什么也没留下'
    }
}, {
    collection: 'user'
});

UserSchema.statics = {
    fetch: function (options, cb) {
        return this
            .find({})
            .skip(options.skip || 0)
            .limit(options.limit || 20)
            .sort({'time': -1})
            .exec(cb);


    },

    updateByUserName: function (username, info, cb) {
        var _this = this;
        return this
            .update({username: username}, {"$set": info})
            .exec(function () {
                _this.findOne({username: username},{password:0}).exec(cb);
            })

    },
    getByUserName: function (username, cb) {
        return this
            .findOne({username: username})
            .exec(cb);

    }
    /* getById: function (id, cb) {
     return this
     .findOne({_id:ObjectID(id)})
     .exec(cb);

     }*/
};

module.exports = UserSchema;

