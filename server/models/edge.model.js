const mongoose = require('mongoose');

const EdgeSchema = new mongoose.Schema({
    source: {
        type: Number,
    },
    target: {
        type: Number,
    },
    value: {
        type: Number,
    }
});


const Edge = mongoose.model('Edge', EdgeSchema);

module.exports = {Edge};
