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

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

module.exports = {FriendRequest};
