const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const passport = require('passport');
require('../passport')(passport);
const User = require('../models/user');
require('../mongo').connect();
const secrets = require('../secrets');
const uuid = require('uuid/v4');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = {
    accessKeyId: secrets.aws.accessKeyId, secretAccessKey: secrets.aws.secretAccessKey, region: secrets.aws.region
};
AWS.config.update(config);
const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'rumble-roast-images',
        key: function (req, file, cb) {
            cb(null, `${uuid()}.jpg`);
        }
    })
});

router.post('/signup', upload.single('profilePic'), (req, res) => {
    const { email, userName, password, name, gender, sexualOrientation, bio, ethnicity } = req.body;
    const profilePic = req.file.location;
    const user = new User({
        email,
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
                        const token = jwt.encode( user, secrets.secret);
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