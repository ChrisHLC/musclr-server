const express = require('express');
const eventRouter = express.Router();
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {Event} = require('../models/event.model');
const {authenticate} = require('../middleware/authenticate');

const event_params = ['start_date', 'end_date', 'text', 'max_participant_number', 'participant_list'];

eventRouter.get('/', authenticate, (req, res) => {
    Event.find({
        creator: req.user._id
    }).then((events) => {
        res.send({events});
    }, (e) => {
        res.status(400).send(e);
    });
});

eventRouter.get('/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Event.findOne({
        _id: id,
        creator: req.user._id
    }).then((event) => {
        if (!event) {
            return res.status(404).send();
        }

        res.send({event});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

eventRouter.delete('/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Event.findOneAndRemove({
        _id: id,
        creator: req.user._id
    }).then((event) => {
        if (!event) {
            return res.status(404).send();
        }

        res.send({event});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

eventRouter.patch('/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, event_params);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Event.findOneAndUpdate({_id: id, creator: req.user._id}, {$set: body}, {new: true}).then((event) => {
        if (!event) {
            return res.status(404).send();
        }

        res.send({event});
    }).catch((e) => {
        res.status(400).send(e);
    })
});

eventRouter.post('/', authenticate, (req, res) => {
    let body = _.pick(req.body, event_params);
    body.creator = req.user._id;
    let event = new Event(body);

    event.save().then((doc) => {
        res.status(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

module.exports = eventRouter;