require('./config/config');
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/users', require('./routes/user.route'));
app.use('/events', require('./routes/event.route'));

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
