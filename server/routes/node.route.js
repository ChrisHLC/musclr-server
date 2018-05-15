const express = require('express');
const nodeRouter = express.Router();
const fs = require('fs');


const {Node} = require('../models/node.model');
const {Edge} = require('../models/edge.model');


nodeRouter.get('/group/:group', async (req, res) => {
    try {
        const group = req.params.group;
        const nodes = await Node.find({group: group});
        fs.writeFileSync('./server/assets/stalker-nodes.json', JSON.stringify(nodes));

        let nodeIds = [];
        nodes.forEach(n => {
            nodeIds.push(n.id);
        });

        const edges = await Edge.find({$and: [{source: {$in: nodeIds}}, {target: {$in: nodeIds}}]});
        fs.writeFileSync('./server/assets/stalker-edges.json', JSON.stringify(edges));

        res.sendStatus(200);

    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = nodeRouter;