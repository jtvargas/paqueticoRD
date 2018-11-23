const express = require('express');
const passport = require('passport');
const router = express.Router();

const { User, Contract } = require('../models');

// GET CONTRACTS
router.get('/contracts', passport.authenticate('jwt', {session: false}), (req, res) => {
    Contract.find({user: req.user.uid})
        .exec((err, results) => {
            if(err) {
                res.json({success: false, msg: 'Error while getting contracts'});
                console.error('[GET CONTRACTS] ' + err);
            } else {
                let contracts = [];
                for(let i=0; i<results.length; i++) {
                    let result = results[i];

                    contracts.push({
                        number: result.number,
                        voiceBalance: result.voiceBalance,
                        dataBalance: result.dataBalance
                    })
                }
                res.json({success: true, contracts});
            }
        });
});

module.exports = router;
