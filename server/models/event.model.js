const mongoose = require('mongoose');
const _ = require('lodash');

const event_schema_params = ['id', 'start_date', 'end_date', 'text', 'creator', 'max_participant_number', 'participant_list'];

const EventSchema = new mongoose.Schema({
    start_date: {
        type: String,
        required: true,
        minlength: 1
    },
    end_date: {
        type: String,
        required: true,
        minlength: 1
    },
    text: {
        type: String,
        required: true,
        minlength: 1
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    max_participant_number: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },
    participant_list: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
});

EventSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

EventSchema.set('toObject', {
    virtuals: true
});

EventSchema.methods.toJSON = function () {
    const event = this;
    const eventObject = event.toObject();

    return _.pick(eventObject, event_schema_params);
};

const Event = mongoose.model('Event', EventSchema);

module.exports = {Event};
