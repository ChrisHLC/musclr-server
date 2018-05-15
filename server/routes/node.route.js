const express = require('express');
const nodeRouter = express.Router();
const fs = require('fs');


const {Node} = require('../models/node.model');

nodeRouter.get('/group/:group', async (req, res) => {
    try {
        const group = req.params.group;
        const nodes = await Node.find({group: group});
        fs.writeFileSync('./server/assets/stalker.json', JSON.stringify(nodes));
        res.send(nodes);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = nodeRouter;