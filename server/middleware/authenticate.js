// PRO TIP
// this is a middleware allowing us to check that the token send by the user is a correct one, giving us a bit of
// security, check the methods in the routes folder and you will see that most of them use this middleware

const {User} = require('../models/user.model');

const authenticate = async (req, res, next) => {
    const token = req.header('x-authorization');

    try {
        const user = await User.findByToken(token);
        if (!user) {
            res.status(404).send();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send();
    }
};

module.exports = {authenticate};
