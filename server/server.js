require('./config/config');
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Expose-Headers', 'X-Authorization');
    next();
});

app.use('/users', require('./routes/user.route'));
app.use('/events', require('./routes/event.route'));

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
