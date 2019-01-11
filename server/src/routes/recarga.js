const express = require('express');
const passport = require('passport');
const router = express.Router();

const { User, Contract, PaymentMethod } = require('../models');

const { 
    MISSING_FIELDS,
    INVALID_BALANCE_TYPE,
    INVALID_ORDER_AMOUNT
} = require('../../config/errors');

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
                        id: result._id,
                        number: result.number,
                        voiceBalance: result.voiceBalance,
                        dataBalance: result.dataBalance,
                        lastRecharge: result.lastRecharge
                    })
                }
                res.json({success: true, contracts});
            }
        });
});

// ORDER
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(!req.body || !req.body.contractId || !req.body.paymentMethodId || !req.body.type || !req.body.amount) {
        res.status(400);
        return res.json({success: false, code: MISSING_FIELDS, msg: 'Missing fields'});
    }

    if(req.body.type != 'voice' && req.body.type != 'data') {
        res.status(400);
        return res.json({success: false, code: INVALID_BALANCE_TYPE, msg: 'Invalid balance type'});
    }

    if(typeof req.body.amount != 'number') {
        res.status(400);
        return res.json({success: false, code: INVALID_ORDER_AMOUNT, msg: 'Invalid amount'});
    }

    PaymentMethod.findById(req.body.paymentMethodId, (err, paymentMethod) => {
        if(err) {
            res.status(500);
            res.json({success: false, msg: 'Error while getting payment method'});
            // console.error('[FIND METHOD] ' + err);
        } else {
            if(!paymentMethod) {
                res.status(404);
                res.json({success: false, msg: 'The requested payment method does not exist'});
                return;
            }

            if(paymentMethod.user.equals(req.user.uid)) {
                
                Contract.findById(req.body.contractId, (err, contract) => {
                    if(err) {
                        res.status(500);
                        res.json({success: false, msg: 'Error while getting contract'});
                        // console.error('[FIND CONTRACT] ' + err);
                    } else {
                        if(!contract) {
                            res.status(400);
                            res.json({success: false, msg: 'The requested contract does not exist'});
                            return;
                        }
            
                        if(contract.user.equals(req.user.uid)) {
                            
                            if(req.body.type == 'data') {
                                contract.dataBalance += req.body.amount;
                            } else {
                                contract.voiceBalance += req.body.amount;
                            }

                            contract.lastRecharge = {type: req.body.type, amount: req.body.amount}

                            contract.save((err, updatedContract) => {
                                if(err) {
                                    res.status(500);
                                    res.json({success: false, msg: 'Error while updating contract'});
                                    // console.error('[UPDATE CONTRACT] ' + err);
                                } else {
                                    res.json({success: true, msg: 'Contract updated successfully', updated: {
                                        dataBalance: updatedContract.dataBalance,
                                        voiceBalance: updatedContract.voiceBalance
                                    }});
                                }        
                            });
                            
                        } else {
                            res.status(401);
                            res.json({success: false, msg: 'You do not own this contract'});
                        }
                    }
                });
                
            } else {
                res.status(401);
                res.json({success: false, msg: 'You do not own this payment method'});
            }
        }
    });

});

module.exports = router;
