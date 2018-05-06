const express = require('express');
const workoutRouter = express.Router();

const {Workout} = require('../models/workout.model');
const {authenticate} = require('../middleware/authenticate');

workoutRouter.get('/', authenticate, async (req, res) => {
    let user = await req.user.addWorkouts();
    res.send(user.workouts);
});


module.exports = workoutRouter;