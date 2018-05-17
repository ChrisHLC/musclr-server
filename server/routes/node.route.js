const express = require('express');
const nodeRouter = express.Router();
const fs = require('fs');

const {Node} = require('../models/node.model');
const {Edge} = require('../models/edge.model');

nodeRouter.post('/filter', async (req, res) => {
    try {
        const body = req.body;
        const group = parseInt(body.group);
        const minAge = parseInt(body.minAge);
        const maxAge = parseInt(body.maxAge);
        const gymId = parseInt(body.gymId);

        let nodes = [];
        let edges = [];

        if (group === -1) {
            if (gymId === -1) {
                nodes = await Node.find({age: {$gte: minAge, $lte: maxAge}});
            } else {
                nodes = await Node.find({age: {$gte: minAge, $lte: maxAge}, salle: gymId});
            }
        } else {
            if (gymId === -1) {
                nodes = await Node.find({group: group, age: {$gte: minAge, $lte: maxAge}});
            } else {
                nodes = await Node.find({group: group, age: {$gte: minAge, $lte: maxAge}, salle: gymId});
            }
        }

        let nodeIds = [];
        nodes.forEach(n => {
            nodeIds.push(n.id);
        });
        edges = await Edge.find({$and: [{source: {$in: nodeIds}}, {target: {$in: nodeIds}}]});

        res.send({nodes, edges});

    } catch (e) {
        res.status(400).send(e);
    }
});

//
// nodeRouter.get('/group/:group', async (req, res) => {
//     try {
//         const group = req.params.group;
//         let nodes = [];
//         let edges = [];
//         if (group === '99') {
//             nodes = await Node.find({});
//             edges = await Edge.find({});
//         } else {
//             nodes = await Node.find({group: group});
//
//             let nodeIds = [];
//             nodes.forEach(n => {
//                 nodeIds.push(n.id);
//             });
//             edges = await Edge.find({$and: [{source: {$in: nodeIds}}, {target: {$in: nodeIds}}]});
//         }
//
//         res.send({nodes, edges});
//
//     } catch (e) {
//         res.status(400).send(e);
//     }
// });
//
// nodeRouter.get('/gym/:gym', async (req, res) => {
//     try {
//         const gym = parseInt(req.params.gym);
//
//         const nodes = await Node.find({salle: gym});
//
//         let nodeIds = [];
//         nodes.forEach(n => {
//             nodeIds.push(n.id);
//         });
//         const edges = await Edge.find({$and: [{source: {$in: nodeIds}}, {target: {$in: nodeIds}}]});
//
//
//         res.send({nodes, edges});
//
//     } catch (e) {
//         res.status(400).send(e);
//     }
// });
//
// nodeRouter.get('/age/:min/:max', async (req, res) => {
//     try {
//         const ageMin = parseInt(req.params.min);
//         const ageMax = parseInt(req.params.max);
//
//         const nodes = await Node.find({
//             age: {$gte: ageMin, $lte: ageMax}
//         });
//
//         let nodeIds = [];
//         nodes.forEach(n => {
//             nodeIds.push(n.id);
//         });
//         const edges = await Edge.find({$and: [{source: {$in: nodeIds}}, {target: {$in: nodeIds}}]});
//
//         res.send({nodes, edges});
//
//     } catch (e) {
//         res.status(400).send(e);
//     }
// });

module.exports = nodeRouter;