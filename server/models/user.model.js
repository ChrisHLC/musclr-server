const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// PRO TIP
// notice the friends and events, we just store the id of the doc, not the whole doc
// how can we get back the document with completed info? use mongoose.populate! see the addFriends method below
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    username: {
        type: String,
        trim: true,
        minlength: 1,
        unique: true,
    },
    role: {
        type: String,
        default: 'MusclR'
    },
    birthday: {
        type: Date
    },
    gender: {
        type: String
    },
    level: {
        type: String,
        default: 'Bronze'
    },
    image: {
        type: String,
        default: 'Default.png'
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    workouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout'
    }],
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// PRO TIP
// use _.pick to select which items you want to send in the response, for example, why should we send back the password?
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.omit(userObject, ['password', 'tokens', '__v']);
};

// PRO TIP
// This is a basic implementation of a token, using the id of the user, the JWT_SECRET is here to prevent someone to
// access someone's else data, that's why the config is not in the git
UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access, role: user.role}, process.env.JWT_SECRET).toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    const user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.methods.addFriends = function () {
    let user = this;
    return user.populate('friends').execPopulate();
};

UserSchema.methods.addEvents = function () {
    let user = this;
    return user.populate('events').execPopulate();
};

UserSchema.methods.addWorkouts = function () {
    let user = this;
    return user.populate('workouts').execPopulate();
};

// PRO TIP
// notice the difference between UserSchema.statics and UserSchema.methods, methods will apply to an User object
// while the statics will apply the UserSchema
UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({email})
        .then((user) => {
            if (!user) {
                return Promise.reject();
            }

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        resolve(user);
                    } else {
                        reject();
                    }
                });
            });
        });
};

// PRO TIP
// Mongoose allows many hooks, her for example before saving a User, you encrypt his password (you never keep a clear
// password in a database
UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
