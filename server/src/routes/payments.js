const express = require('express');
const passport = require('passport');
const router = express.Router();

const { User, PaymentMethod } = require('../models');

const { 
    MISSING_FIELDS,
    INVALID_CARD_DIGITS, 
    INVALID_CARD_LENGTH,
    INVALID_PAYMENT_TYPE,
    INVALID_CARD_EXPIRATION,
    INVALID_CARD_CVV
} = require('../../config/errors');

const SUPPORTED_TYPES = ['visa', 'mastercard', 'amex'];
const MIN_CARD_DIGITS = 15;
const MAX_CARD_DIGITS = 16;


const displayMethodRecord = (record) => {
    return {
        id: record._id,
        name: record.name,
        number: record.number.substr(-4),
        type: record.type
    };
}

// Create payment method
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(!req.body || !req.body.name || !req.body.type || !req.body.number || !req.body.cvv || !req.body.expiration) {
        res.status(400);
        return res.json({success: false, code: MISSING_FIELDS, msg: 'Missing fields'});
    }

    if(!SUPPORTED_TYPES.includes(req.body.type)) {
        res.status(400);
        return res.json({success: false, code: INVALID_PAYMENT_TYPE, msg: 'Invalid payment method type.'});
    }

    if(req.body.number.length > MAX_CARD_DIGITS || req.body.number.length < MIN_CARD_DIGITS) {
        res.status(400);
        return res.json({success: false, code: INVALID_CARD_LENGTH, msg: 'Invalid card number.'});
    }

    if(!(/^\d+$/.test(req.body.number))) {
        res.status(400);
        return res.json({success: false, code: INVALID_CARD_DIGITS, msg: 'Invalid card number.'});
    }

    if(!(/^\d+$/.test(req.body.cvv))) {
        res.status(400);
        return res.json({success: false, code: INVALID_CARD_CVV, msg: 'Invalid CVV.'});
    }

    if(!(/^(((0)[0-9])|((1)[0-2]))(\/)\d{2}$/.test(req.body.expiration))) {
        res.status(400);
        return res.json({success: false, code: INVALID_CARD_EXPIRATION, msg: 'Invalid expiration date'});
    }

    let method = {
        name: req.body.name,
        type: req.body.type,
        number: req.body.number,
        cvv: req.body.cvv,
        expiration: req.body.expiration,
        description: req.body.description,
        user: req.user.uid
    }

    new PaymentMethod(method).save((err, paymentMethod) => {
        if(err) {
            res.status(500);
            res.json({success: false, msg: 'Failed to create payment method'});
            // console.error('[CREATE PAYMENT METHOD] ' + err);
        } else {
            res.json({success: true, msg: 'Payment method created', paymentMethod: displayMethodRecord(paymentMethod)});
        }
    });
});

// View Payment Methods
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    PaymentMethod.find({user: req.user.uid})
        .exec((err, results) => {
            if(err) {
                res.status(500);
                res.json({success: false, msg: 'Error while getting payment methods'});
                console.error('[FIND PAYMENT METHODS] ' + err);
            } else {
                let showResults = [];
                for(let i=0; i<results.length; i++) {
                    showResults.push(displayMethodRecord(results[i]));
                }
                res.json({success: true, results: showResults});
            }
        });
});

// Delete method
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    PaymentMethod.findById(req.params.id, (err, paymentMethod) => {
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
                PaymentMethod.deleteOne({_id: paymentMethod._id}, (err) => {
                    if(err) {
                        res.json({success: false, msg: 'Error while deleting payment method'});
                        // console.error('[DELETE METHOD] ' + err);
                    } else {
                        res.json({success: true, msg: 'Payment method deleted successfully'});
                    }
                });
                
            } else {
                res.json({success: false, msg: 'You do not own this payment method'});
            }
        }
    });
});


module.exports = router;