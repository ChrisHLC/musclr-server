const express = require('express');
const userRouter = express.Router();
const _ = require('lodash');

const {User} = require('../models/user.model');
const {authenticate} = require('../middleware/authenticate');

// method used to delete the token of a user, not the user itself
userRouter.delete('/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send(e);
    }
});

userRouter.get('/all', authenticate, async (req, res) => {
    try {
        const users = await User.find({}).sort('username');
        res.send(users);
    } catch (e) {
        res.status(400).send(e);
    }
});

userRouter.get('/workouts', authenticate, async (req, res) => {
    try {
        let user = await req.user.addWorkouts();
        res.send(user.workouts);
    } catch (e) {
        res.status(400).send(e)
    }
});

userRouter.get('/carousel/:id', authenticate, async (req, res) => {
    const users = await User.find({'_id': {$ne: req.user._id}}).limit(9);
    res.send(users);
});

userRouter.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

userRouter.get('/friends', authenticate, async (req, res) => {
    try {
        let user = await req.user.addFriends();
        res.send(user.friends);
    } catch (e) {
        res.status(400).send(e)
    }
});

userRouter.get('/friends/:username', authenticate, async (req, res) => {
    const username = req.params.username;
    try {
        let user = await req.user.addFriends();
        res.send(user.friends.filter(friend => friend.username.toLowerCase().startsWith(username.toLowerCase())));
    } catch (e) {
        res.status(400).send(e)
    }
});

userRouter.get('/events', authenticate, async (req, res) => {
    try {
        let user = await req.user.addEvents();
        res.send(user.events);
    } catch (e) {
        res.status(400).send(e)
    }
});

userRouter.get('/:id', authenticate, async (req, res) => {

    try {
        const id = req.params.id;
        const user = await User.find({_id: id});
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

userRouter.patch('/me', authenticate, async (req, res) => {
    try {
        const body = req.body;
        const user = await User.findOneAndUpdate({_id: req.user._id}, {$set: body}, {new: true});
        res.send({user});
    } catch (e) {
        res.status(400).send(e)
    }
});

userRouter.patch('/workouts/add', authenticate, async (req, res) => {
    try {
        const body = req.body.id;
        const user = await User.findOneAndUpdate({_id: req.user._id}, {$push: {workouts: body}}).lean();
        res.send({user});
    } catch (e) {
        res.status(400).send(e)
    }
});

userRouter.post('/', async (req, res) => {
    try {
        const body = req.body;
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-authorization', token).send(user);
    } catch (e) {
        res.status(400).send(e)
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-authorization', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = userRouter;