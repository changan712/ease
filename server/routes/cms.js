var crypto = require('crypto');
var User = require('../models/cmsuser');

module.exports = function (app) {


    app.get('/cms', checkLogin);
    app.get('/cms', function (req, res) {

        res.render('main', {
            title: '主页',
            user: req.session.cmsuser,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });


    app.get('/cms/login', function (req, res) {
        res.render('login', {
            title: '登陆',
            user: req.session.cmsuser,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    });

    app.post('/cms/login', function (req, res) {

        var name = req.body.name,
            md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');

        User.get(name, function (err, user) {

            if (user && user.password == password) {

                req.flash('success', '登陆成功!');
                req.session.cmsuser = user;
                res.redirect('/cms');

            } else {
                req.flash('error', '用户不存在或密码不正确！');
                res.redirect('cms/login');
            }
        })

    });

    app.get('/cms/logout', function (req, res) {

        req.session.cmsuser = null;
        req.flash('success', '退出成功!');
        res.redirect('/cms/login');//登出成功后退回到登陆页
    });

    app.get('/cms/reg', function (req, res) {

        res.render('reg', {
            title: '注册',
            user: req.session.cmsuser,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/cms/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        if (password_re != password) {
            req.flash('error', '两次密码输入不一致！');
            return res.redirect('/cms/reg');//返回注册页
        }

        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email
        });

        //检查用户名是否已经存在
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/cms/reg');//返回注册页
            }
            //如果不存在则新增用户

            newUser.save(function (err, user) {
                if (err) {

                    req.flash('error', err);
                    return res.redirect('/cms/reg');//注册失败返回主册页
                }
                req.session.user = user;//用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/cms');//注册成功后返回主页
            });
        });
    });


    app.get('/cms/ifr/:page', function (res, req) {
        var page = res.params.page;

        req.render('ifr/'+page,{});


    })
};


function checkLogin(req, res, next) {

    if (!req.session.cmsuser) {
        req.flash('error', '未登陆');
        res.redirect('/cms/login');
    }
    next();
}

function checkNotLogin(req, res, next) {

    if (req.session.cmsuser) {
        req.flash('error', '已登陆');
        res.redirect('/cms');
    }
    next();
}
