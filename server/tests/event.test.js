const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Event} = require('../models/event.model');
const {events, populateEvents, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateEvents);

describe('Tests on Events', () => {

    describe('DELETE /events/:id', () => {
        it('user should remove his event', (done) => {
            const hexId = events[1]._id.toHexString();

            request(app)
                .delete(`/events/${hexId}`)
                .set('X-Authorization', users[1].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.event.id).toBe(hexId);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Event.findById(hexId).then((event) => {
                        expect(event).toBeFalsy();
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should not delete the event created by other user', (done) => {
            const hexId = events[0]._id.toHexString();

            request(app)
                .delete(`/events/${hexId}`)
                .set('X-Authorization', users[1].tokens[0].token)
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Event.findById(hexId).then((event) => {
                        expect(event).toBeTruthy();
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should return 404 if event not found', (done) => {
            const hexId = new ObjectID().toHexString();

            request(app)
                .delete(`/events/${hexId}`)
                .set('X-Authorization', users[1].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 if object id is invalid', (done) => {
            request(app)
                .delete('/events/123wtf')
                .set('X-Authorization', users[1].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });

    describe('GET /events', () => {
        it('should get user\'s one event', (done) => {
            request(app)
                .get('/events')
                .set('X-Authorization', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.events.length).toBe(1);
                })
                .end(done);
        });
    });

    describe('GET /events/:id', () => {
        it('should return event doc', (done) => {
            request(app)
                .get(`/events/${events[0]._id.toHexString()}`)
                .set('X-Authorization', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.event.text).toBe(events[0].text);
                })
                .end(done);
        });

        it('should not return event doc created by other user', (done) => {
            request(app)
                .get(`/events/${events[1]._id.toHexString()}`)
                .set('X-Authorization', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 if event not found', (done) => {
            const hexId = new ObjectID().toHexString();

            request(app)
                .get(`/events/${hexId}`)
                .set('X-Authorization', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', (done) => {
            request(app)
                .get('/events/123wtf')
                .set('X-Authorization', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /events/:id', () => {
        it('should update the event', (done) => {
            const hexId = events[0]._id.toHexString();
            const text = 'This should be the new text';

            request(app)
                .patch(`/events/${hexId}`)
                .set('X-Authorization', users[0].tokens[0].token)
                .send({
                    text,
                    max_participant_number: 2,
                    participant_list: [users[1]._id]
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.event.text).toBe(text);
                    expect(res.body.event.max_participant_number).toBe(2);
                    expect(res.body.event.participant_list[0]).toBe(users[1]._id.toHexString());
                })
                .end(done);
        });

        it('should not update the event created by other user', (done) => {
            const hexId = events[0]._id.toHexString();
            const text = 'This should be the new text';

            request(app)
                .patch(`/events/${hexId}`)
                .set('X-Authorization', users[1].tokens[0].token)
                .send({
                    text
                })
                .expect(404)
                .end(done);
        });
    });

    describe('POST /events', () => {
        it('should create a new event', (done) => {
            const event = {
                start_date: "2018-02-19 08:00",
                end_date: "2018-02-19 09:00",
                text: "random new event",
                creator: new ObjectID(),
                max_participant_number: 1,
                participant_list: []
            };

            request(app)
                .post('/events')
                .set('X-Authorization', users[0].tokens[0].token)
                .send(event)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBeTruthy();
                    expect(res.body._id).toBeFalsy();
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Event.find({'_id': res.body.id}).then((events) => {
                        expect(events.length).toBe(1);
                        expect(events[0].start_date).toBe(event.start_date);
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should not create event with invalid body data', (done) => {
            request(app)
                .post('/events')
                .set('X-Authorization', users[0].tokens[0].token)
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Event.find().then((events) => {
                        expect(events.length).toBe(2);
                        done();
                    }).catch((e) => done(e));
                });
        });
    });
});