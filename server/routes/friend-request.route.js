const express = require('express');
const friendRequestRouter = express.Router();

const {FriendRequest} = require('../models/friend-request.model');
const {authenticate} = require('../middleware/authenticate');

friendRequestRouter.get('/', authenticate, async (req, res) => {
    try {
        let friendRequests = await FriendRequest.find({to: req.user._id});
        res.send(friendRequests);
    } catch (e) {
        res.status(400).send(e);
    }
});

friendRequestRouter.post('/', async (req, res) => {
    try {
        const body = req.body;
        const friendRequest = new FriendRequest(body);
        await friendRequest.save();
        res.send(friendRequest);
    } catch (e) {
        res.status(400).send(e)
    }
});


module.exports = friendRequestRouter;