const express = require('express');
const passport = require('passport');
const router = express.Router();

const { User, Company, Contract } = require('../models');

// Create company
router.post('/company', (req, res) => {
    if(!req.body || !req.body.name || !req.body.address || !req.body.rnc) {
        return res.json({success: false, msg: 'Missing fields'});
    }

    let companyData = {
        name: req.body.name,
        address: req.body.address,
        rnc: req.body.rnc
    }

    new Company(companyData).save((err, company) => {
        if(err) {
            res.json({success: false, msg: 'Failed to create company'});
            console.error('[CREATE COMPANY] ' + err);
        } else {
            res.json({success: true, msg: 'Company created', company});
        }
    });
});

// View Companies
router.get('/company', (req, res) => {
    Company.find({active: true})
        .exec((err, results) => {
            if(err) {
                res.json({success: false, msg: 'Error while getting companies'});
                console.error('[FIND COMPANIES] ' + err);
            } else {
                res.json({success: true, results});
            }
        });
});

// Create Contract
router.post('/contract', (req, res) => {
    if(!req.body || !req.body.userId || !req.body.number) {
        return res.json({success: false, msg: 'Missing fields'});
    }
    
    let contractData = {
        number: req.body.number,
        user: req.body.userId
    }

    new Contract(contractData).save((err, contract) => {
        if(err) {
            res.json({success: false, msg: 'Failed to create contract'});
            console.error('[CREATE CONTRACT] ' + err);
        } else {
            res.json({success: true, msg: 'Contract created', contract});
        }
    });
});

module.exports = router;
