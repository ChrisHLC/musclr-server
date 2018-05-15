const express = require('express');
const stalkerRouter = express.Router();
const fs = require('fs');

const {Node} = require('../models/node.model');

stalkerRouter.get('/', async (req, res) => {
    try {
        let rawdata = fs.readFileSync('./server/assets/stalker.json');
        let student = JSON.parse(rawdata);
        res.send(student);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = stalkerRouter;