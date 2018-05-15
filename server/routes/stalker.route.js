const express = require('express');
const stalkerRouter = express.Router();
const fs = require('fs');

const {Node} = require('../models/node.model');

stalkerRouter.get('/nodes', async (req, res) => {
    try {
        let rawdata = fs.readFileSync('./server/assets/stalker-nodes.json');
        let nodes = JSON.parse(rawdata);
        res.send(nodes);
    } catch (e) {
        res.status(400).send(e);
    }
});

stalkerRouter.get('/edges', async (req, res) => {
    try {
        let rawdata = fs.readFileSync('./server/assets/stalker-edges.json');
        let edges = JSON.parse(rawdata);
        res.send(edges);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = stalkerRouter;