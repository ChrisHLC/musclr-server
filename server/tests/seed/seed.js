const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Event} = require('../../models/event.model');
const {User} = require('./../../models/user.model');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'romeo@gmail.com',
    password: '123456',
    profile: {
        username: "Roméo",
        haltr: 2000
    },
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'julia@gmail.com',
    password: '654321',
    profile: {
        username: "Julia",
        haltr: 2000
    },
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const events = [{
    _id: new ObjectID(),
    start_date: "2018-02-19 08:00",
    end_date: "2018-02-19 09:00",
    text: "private solo workout",
    creator: userOneId,
    max_participant_number: 1,
    participant_list: []
}, {
    _id: new ObjectID(),
    start_date: "2018-02-18 22:00", // yyyy-mm-dd hh:mm
    end_date: "2018-02-18 23:00",
    text: "public duo workout",
    creator: userTwoId,
    max_participant_number: 2,
    participant_list: [userOneId]
}];

const populateEvents = (done) => {
    Event.remove({}).then(() => {
        return Event.insertMany(events);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {events, populateEvents, users, populateUsers};
