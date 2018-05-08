const express = require('express');
const eventRouter = express.Router();
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {Event} = require('../models/event.model');
const {User} = require('../models/user.model');
const {Workout} = require('../models/workout.model');
const {authenticate} = require('../middleware/authenticate');

// PRO TIP
// notice the async and await, it's just an aesthetic change, but it allows you to manipulate Promise in a more "synchronous" way
// no more then and the catch is replaced by a general try/catch
eventRouter.delete('/:id', authenticate, async (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    try {
        const event = await Event.findOneAndRemove({_id: id, creator: req.user._id});

        if (!event) {
            return res.status(404).send();
        }

        res.send({event});
    } catch (e) {
        res.status(400).send(e);
    }
});

eventRouter.get('/', authenticate, async (req, res) => {
    try {
        let events = await Event.find({creator: req.user._id});
        res.send(events);
    } catch (e) {
        res.status(400).send(e);
    }
});

eventRouter.get('/friends/:username', authenticate, async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({username: username});
        if (!user) {
            return res.status(404).send();
        }
        const events = await Event.find({creator: user._id}).lean();
        for (const event of events) {
            let workout = await Workout.findOne({_id: event.workout});
            event.workout_name = workout.name;
            event.id = event._id;
        }
        res.send(events);
    } catch (e) {
        res.status(400).send(e);
    }
});

eventRouter.get('/:id', authenticate, async (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    try {
        const event = await Event.findOne({_id: id, creator: req.user._id});
        if (!event) {
            return res.status(404).send();
        }
        res.send({event});
    } catch (e) {
        res.status(400).send(e);
    }
});

eventRouter.patch('/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    try {
        if (body.participate) {
            body.participant_list.push(req.user._id);
        } else if (body.participate === false) {
            _.pull(body.participant_list, req.user._id);
        }
        const event = await Event.findOneAndUpdate({_id: id}, {$set: body}, {new: true});
        if (!event) {
            return res.status(404).send();
        }

        res.send(event);
    } catch (e) {
        res.status(400).send(e);
    }
});

eventRouter.post('/', authenticate, async (req, res) => {
    const body = req.body;
    body.creator = req.user._id;
    const event = new Event(body);

    try {
        const doc = await event.save();
        await User.findOneAndUpdate({_id: req.user._id}, {$push: {events: doc._id}});
        res.status(200).send(doc);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = eventRouter;