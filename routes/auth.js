const express = require('express');
const jwt = require('jwt-simple');
const passport = require('passport');
require('../passport')(passport);
const User = require('../models/user');
require('../mongo').connect();
const secrets = require('../secrets');

const router = express.Router();

router.post('/signup', (req, res) => {
    const { userName, password, name, profilePic, gender, sexualOrientation, bio, ethnicity } = req.body;

    const user = new User({
        userName,
        password,
        name,
        profilePic,
        gender,
        sexualOrientation,
        bio,
        ethnicity
    });

    user.save()
        .then(() => res.json(user))
        .catch((err) => res.status(500).send(err));
});

router.post('/login', (req, res) => {
    const { userName, password } = req.body;
    User.findOne({ userName })
        .then((user) => {
            if (!user) {
                res.status(500).send('User not found');
            } else {
                user.comparePassword(password, (err, isMatch) => {
                    if (isMatch && !err) {
                        const token = jwt.encode(user, secrets.secret);
                        res.json('JWT ' + token);
                    } else {
                        res.status(500).send('Authentication failed: Wrong password');
                    }
                });
            }
        })
        .catch((err) => res.status(500).send(err));
});

// Example of a protected route
// Requires { Authorization: 'JWT token' } in headers
router.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

module.exports = router;