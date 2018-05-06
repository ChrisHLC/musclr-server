const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    }
});

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = {Workout};
