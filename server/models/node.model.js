const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
    group: {
        type: Number,
    },
    name: {
        type: String,
    },
    istrain: {
        type: Boolean,
    },
    lon: {
        type: Number,
    },
    lat: {
        type: Number,
    },
    id: {
        type: Number,
    }
});


const Node = mongoose.model('Node', NodeSchema);

module.exports = {Node};
