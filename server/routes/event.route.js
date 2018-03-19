const express = require('express');
const eventRouter = express.Router();
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {Event} = require('../models/event.model');
const {authenticate} = require('../middleware/authenticate');

const event_params = ['start_date', 'end_date', 'text', 'max_participant_number', 'participant_list'];

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
        const events = await Event.find({creator: req.user._id});
        res.send({events});
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
    const body = _.pick(req.body, event_params);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    try {
        const event = await Event.findOneAndUpdate({_id: id, creator: req.user._id}, {$set: body}, {new: true});
        if (!event) {
            return res.status(404).send();
        }

        res.send({event});
    } catch (e) {
        res.status(400).send(e);
    }
});

eventRouter.post('/', authenticate, async (req, res) => {
    const body = _.pick(req.body, event_params);
    body.creator = req.user._id;
    const event = new Event(body);

    try {
        const doc = await event.save();
        res.status(200).send(doc);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = eventRouter;