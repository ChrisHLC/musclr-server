const mongoose = require('mongoose');
const _ = require('lodash');

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
    max_participant_number: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },
    participant_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    workout:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

// PRO TIP
// this allows us to have an object with an id instead of the mongo _id, useful for our scheduler
EventSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

EventSchema.set('toObject', {
    virtuals: true
});

EventSchema.methods.addWorkout = function () {
    let event = this;
    return event.populate('workout').execPopulate();
};

EventSchema.methods.toJSON = function () {
    const event = this;
    return event.toObject();
};

const Event = mongoose.model('Event', EventSchema);

module.exports = {Event};
