const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { authSecret } = require('../../config/secrets');
const { User } = require('../models');

const genToken = uid => {
    return jwt.sign({uid}, authSecret, {
        expiresIn: 604800 // 1 week
    });
}

// Registration
router.post('/register', (req, res) => {
    if(!req.body || !req.body.email || !req.body.password || !req.body.name || !req.body.companyId) {
        return res.json({success: false, msg: 'Missing fields'});
    }

    let newUser = new User({
        company: req.body.companyId,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        imageUrl: req.body.imageUrl
    });

    bcrypt.genSalt(10, (err, salt) => {
        if(err) throw err;
        bcrypt.hash(newUser.password, salt, (hashErr, hash) => {
            if(hashErr) {
                throw hashErr;
            } else {
                newUser.password = hash;
                newUser.save((err, user) => {
                    if(err) {
                        res.json({success: false, msg: 'Failed to register user.'});
                    } else {
                        res.json({success: true, msg: 'User registered.'});
                    }
                });
            }
        });
    });

});

// LOGIN
router.post('/', (req, res) => {
    if(!req.body || !req.body.email || !req.body.password || !req.body.companyId) {
        return res.json({success: false, msg: 'Missing fields'});
    }

    const userObj = {
        email: req.body.email,
        password: req.body.password,
        companyId: req.body.companyId
    }

    User.findOne({email: userObj.email, company: userObj.companyId}, (err, user) => {
        if(err) throw err;

        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }

        bcrypt.compare(userObj.password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = genToken(user._id);

                res.json({
                    success: true,
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        imageUrl: user.imageUrl
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

// CHECK LOGIN
router.get('/check', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({user: req.user});
});

module.exports = router;
