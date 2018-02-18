require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user.model');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/users', require('./routes/user.route'));

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
