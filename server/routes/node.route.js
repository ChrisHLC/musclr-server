const express = require('express');
const nodeRouter = express.Router();
const fs = require('fs');


const {Node} = require('../models/node.model');
const {Edge} = require('../models/edge.model');


nodeRouter.get('/group/:group', async (req, res) => {
    try {
        const group = req.params.group;
        let nodes = [];
        let edges = [];
        if(group === '99'){
            nodes = await Node.find({});
            edges = await Edge.find({});
        } else {
            nodes = await Node.find({group: group});

            let nodeIds = [];
            nodes.forEach(n => {
                nodeIds.push(n.id);
            });

            edges = await Edge.find({$and: [{source: {$in: nodeIds}}, {target: {$in: nodeIds}}]});
        }

        res.send({nodes, edges});

    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = nodeRouter;