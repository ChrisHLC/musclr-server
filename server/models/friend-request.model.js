const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String
    }
});

const Workout = mongoose.model('Workout', FriendRequestSchema);

module.exports = {Workout};
