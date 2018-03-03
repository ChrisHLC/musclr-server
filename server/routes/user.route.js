const express = require('express');
const userRouter = express.Router();
const _ = require('lodash');

const {User} = require('../models/user.model');
const {authenticate} = require('../middleware/authenticate');

userRouter.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

userRouter.delete('/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (e) => {
        res.status(400).send(e);
    });
});

userRouter.post('/', (req, res) => {
    let body = _.pick(req.body, ['email', 'password', 'profile']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

userRouter.post('/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

module.exports = userRouter;