process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { PaymentMethod, User, Company } = require('../src/models'); 

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../');
const should = chai.should();

chai.use(chaiHttp);

const ERRORS = require('../config/errors');

describe('Payments', () => {
    let token = false;
    beforeEach((done) => {
        PaymentMethod.deleteMany({}, (err) => {
            User.deleteMany({}, (err) => {
                Company.deleteMany({}, (err) => {
                    new Company({
                        name: 'Claro',
                        address: 'Amelia Francasci 22',
                        rnc: '5494261'
                    }).save((err, company) => {
                        const companyId = company._id;
                        chai.request(server)
                            .post('/auth/register')
                            .send({
                                companyId,
                                name: 'Customer',
                                email: 'customer@gmail.com',
                                password: 'password'
                            })
                            .end((err, res) => {
                                chai.request(server)
                                    .post('/auth')
                                    .send({
                                        companyId,
                                        email: 'customer@gmail.com',
                                        password: 'password'
                                    })
                                    .end((err, res) => {
                                        token = res.body.token;
                                        done();
                                    });
                            });
                    });
                });
            });
        });
    });

    // TEST Create payment method
    describe('POST /payments', () => {
        it('should create payment method', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '102',
                    number: '1238567890123456',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    done();
                });
        });

        it('should fail with authentication error', (done) => {
            chai.request(server)
                .post('/payments')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should fail with missing fields (name)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    cvv: '102',
                    number: '1238567890123456',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.MISSING_FIELDS);
                    done();
                });
        });

        it('should fail with missing fields (cvv)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    number: '1238567890123456',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.MISSING_FIELDS);
                    done();
                });
        });

        it('should fail with missing fields (number)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '102',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.MISSING_FIELDS);
                    done();
                });
        });

        it('should fail with missing fields (expiration)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '102',
                    number: '1238567890123456',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.MISSING_FIELDS);
                    done();
                });
        });

        it('should fail with missing fields (type)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '102',
                    number: '1238567890123456',
                    expiration: '10/22'                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.MISSING_FIELDS);
                    done();
                });
        });

        it('should fail with invalid type', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '102',
                    number: '1238567890123456',
                    expiration: '10/22',
                    type: 'other'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.INVALID_PAYMENT_TYPE);
                    done();
                });
        });

        it('should fail with invalid card number (too short)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '102',
                    number: '123456',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.INVALID_CARD_LENGTH);
                    done();
                });
        });

        it('should fail with invalid card number (too long)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '102',
                    number: '12345678901234567890',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.INVALID_CARD_LENGTH);
                    done();
                });
        });

        it('should fail with invalid card number (not a number)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '102',
                    number: '12385asd90123456',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.INVALID_CARD_DIGITS);
                    done();
                });
        });

        it('should fail with invalid cvv (not a number)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: 'abc',
                    number: '1238534590123456',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.INVALID_CARD_CVV);
                    done();
                });
        });

        it('should fail with invalid expiration date (format)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '123',
                    number: '1238534590123456',
                    expiration: '10/2022',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.INVALID_CARD_EXPIRATION);
                    done();
                });
        });

        it('should fail with invalid expiration date (format 2)', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '123',
                    number: '1238534590123456',
                    expiration: '1022',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.INVALID_CARD_EXPIRATION);
                    done();
                });
        });

        it('should fail since card is already registered', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '123',
                    number: '1238534590123456',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    chai.request(server)
                        .post('/payments')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            name: 'Jose Reyes',
                            cvv: '123',
                            number: '1238534590123456',
                            expiration: '10/22',
                            type: 'visa'
                            
                        })
                        .end((err, res) => {
                            res.should.have.status(500);
                            res.body.success.should.eql(false);
                            done();
                        });
                });
        });
    });

    // TEST View payment methods
    describe('GET /payments', () => {
        it('should fail with authentication error', (done) => {
            chai.request(server)
                .get('/payments')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should return empty list', (done) => {
            chai.request(server)
                .get('/payments')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    res.body.results.length.should.eql(0);
                    done();
                });
        });

        it('should return payment method list', (done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '123',
                    number: '1238534590123456',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    chai.request(server)
                        .post('/payments')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            name: 'Jose Reyes',
                            cvv: '123',
                            number: '0238534590123456',
                            expiration: '10/22',
                            type: 'amex'
                            
                        })
                        .end((err, res) => {
                            chai.request(server)
                                .get('/payments')
                                .set('Authorization', 'Bearer ' + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.success.should.eql(true);
                                    res.body.results.length.should.eql(2);
                                    done();
                                });
                        });
                });
        });
    });

    // TEST Delete payment method
    describe('DELETE /payments', () => {
        let methodId;
        beforeEach((done) => {
            chai.request(server)
                .post('/payments')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'Jose Reyes',
                    cvv: '102',
                    number: '1238567890123456',
                    expiration: '10/22',
                    type: 'visa'
                    
                })
                .end((err, res) => {
                    methodId = res.body.paymentMethod.id;
                    done();
                });
        });
        
        it('should delete payment method', (done) => {
            chai.request(server)
                .delete(`/payments/${methodId}`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    done();
                });
        });

        it('should fail with authentication error', (done) => {
            chai.request(server)
                .delete(`/payments/${methodId}`)
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should fail with payment method not found', (done) => {
            chai.request(server)
                .delete(`/payments/${methodId + 'a'}`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.success.should.eql(false);
                    done();
                });
        });

    });
});