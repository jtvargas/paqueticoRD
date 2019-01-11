process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { User, Company, Contract, PaymentMethod } = require('../src/models'); 

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../');
const should = chai.should();

const ERRORS = require('../config/errors');

chai.use(chaiHttp);

describe('Recarga', () => {
    let token = false;
    let userId = false;
    let companyId = false;

    beforeEach((done) => {
        Contract.deleteMany({}, (err) => {
            User.deleteMany({}, (err) => {
                Company.deleteMany({}, (err) => {
                    new Company({
                        name: 'Claro',
                        address: 'Amelia Francasci 22',
                        rnc: '5494261'
                    }).save((err, company) => {
                        if(err) throw err;
                        companyId = company._id;
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
                                        userId = res.body.user.id;
                                        done();
                                    });
                            });
                    });
                });
            });
        });
    });

    // TEST View contracts
    describe('GET /contracts', () => {
        it('should list contracts (empty)', (done) => {
            chai.request(server)
                .get('/recarga/contracts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    res.body.contracts.length.should.eql(0);
                    done();
                });
        });

        it('should list contracts (list)', (done) => {
            new Contract({
                number: '8095486748',
                user: userId
            }).save((err, contract) => {
                if(err) throw err;
                new Contract({
                    number: '8493525369',
                    user: userId
                }).save((err, contract) => {
                    if(err) throw err;
                    chai.request(server)
                        .get('/recarga/contracts')
                        .set('Authorization', `Bearer ${token}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.success.should.eql(true);
                            res.body.contracts.length.should.eql(2);
                            done();
                        });
                });
            });
        });

        it('should fail with authentication error', (done) => {
            chai.request(server)
                .get('/recarga/contracts')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    // TEST Create order
    describe('POST /recarga', (done) => {
        let paymentMethodId, contractId;

        beforeEach((done) => {
            PaymentMethod.deleteMany({}, () => {
                new PaymentMethod({
                    name: 'Jose Reyes',
                    cvv: '102',
                    number: '1238567890123456',
                    expiration: '10/22',
                    type: 'visa',
                    user: userId
                }).save((err, paymentMethod) => {
                    if(err) throw err;
                    paymentMethodId = paymentMethod._id;
                    
                    new Contract({
                        number: '8095486748',
                        user: userId
                    }).save((err, contract) => {
                        if(err) throw err;
                        contractId = contract._id;
                        done();
                    });

                });
            });
        });

        it('should create data order successfully', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    type: 'data',
                    amount: 500,
                    paymentMethodId,
                    contractId
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    res.body.updated.dataBalance.should.eql(500);
                    res.body.updated.voiceBalance.should.eql(0);
                    done();
                });
        });

        it('should create voice order successfully', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    type: 'voice',
                    amount: 500,
                    paymentMethodId,
                    contractId
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    res.body.updated.dataBalance.should.eql(0);
                    res.body.updated.voiceBalance.should.eql(500);
                    done();
                });
        });

        it('should add balance successfully', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    type: 'data',
                    amount: 500,
                    paymentMethodId,
                    contractId
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    res.body.updated.dataBalance.should.eql(500);
                    res.body.updated.voiceBalance.should.eql(0);

                    chai.request(server)
                        .post('/recarga')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            type: 'data',
                            amount: 200,
                            paymentMethodId,
                            contractId
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.success.should.eql(true);
                            res.body.updated.dataBalance.should.eql(700);
                            res.body.updated.voiceBalance.should.eql(0);
                            done();
                        });
                });
        });

        it('should fail with missing fields (contractId)', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    type: 'voice',
                    amount: 500,
                    paymentMethodId,
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.MISSING_FIELDS);
                    done();
                });
        });

        it('should fail with missing fields (paymentMethodId)', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    type: 'voice',
                    amount: 500,
                    contractId
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.MISSING_FIELDS);
                    done();
                });
        });

        it('should fail with missing fields (amount)', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    type: 'voice',
                    amount: 0,
                    paymentMethodId,
                    contractId
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
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    amount: 500,
                    contractId,
                    paymentMethodId
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.MISSING_FIELDS);
                    done();
                });
        });

        it('should fail with invalid balance type', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    amount: 500,
                    contractId,
                    paymentMethodId,
                    type: 'other'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.INVALID_BALANCE_TYPE);
                    done();
                });
        });

        it('should fail with invalid order amount', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    amount: '500',
                    contractId,
                    paymentMethodId,
                    type: 'data'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.code.should.eql(ERRORS.INVALID_ORDER_AMOUNT);
                    done();
                });
        });

        it('should fail with payment method not found', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    amount: 500,
                    contractId,
                    paymentMethodId: '123',
                    type: 'data'
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.success.should.eql(false);
                    done();
                });
        });

        it('should fail with payment method not owned', (done) => {
            new User({
                name: 'Cliente 2',
                email: 'cliente2@gmail.com',
                password: '123456',
                company: companyId
            }).save((err, user) => {
                if(err) throw err;

                new PaymentMethod({
                    name: 'John Kingston',
                    cvv: '102',
                    number: '5238567890123456',
                    expiration: '10/22',
                    type: 'visa',
                    user: user._id
                }).save((err, paymentMethod) => {
                    if(err) throw err;
                    const otherMethodId = paymentMethod._id;
                    
                    chai.request(server)
                        .post('/recarga')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            amount: 500,
                            contractId,
                            paymentMethodId: otherMethodId,
                            type: 'data'
                        })
                        .end((err, res) => {
                            res.should.have.status(401);
                            res.body.success.should.eql(false);
                            done();
                        });

                });

            });
        });

        it('should fail with contract not found', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    amount: 500,
                    contractId: '123',
                    paymentMethodId,
                    type: 'data'
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.success.should.eql(false);
                    done();
                });
        });
        
        it('should fail with contract not owned', (done) => {
            new User({
                name: 'Cliente 2',
                email: 'cliente2@gmail.com',
                password: '123456',
                company: companyId
            }).save((err, user) => {
                if(err) throw err;

                new Contract({
                    number: '8492231543',
                    user: user._id
                }).save((err, contract) => {
                    if(err) throw err;
                    const otherContractId = contract._id;
                    
                    chai.request(server)
                        .post('/recarga')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            amount: 500,
                            contractId: otherContractId,
                            paymentMethodId,
                            type: 'data'
                        })
                        .end((err, res) => {
                            res.should.have.status(401);
                            res.body.success.should.eql(false);
                            done();
                        });

                });

            });
        });

        it('should update last recharge details (data)', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    amount: 245,
                    contractId,
                    paymentMethodId,
                    type: 'data'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);

                    Contract.findById(contractId, (err, contract) => {
                        if(err) throw err;

                        contract.lastRecharge.type.should.eql('data');
                        contract.lastRecharge.amount.should.eql(245);

                        done();
                    });
                });
        });

        it('should update last recharge details (voice)', (done) => {
            chai.request(server)
                .post('/recarga')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    amount: 255,
                    contractId,
                    paymentMethodId,
                    type: 'voice'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);

                    Contract.findById(contractId, (err, contract) => {
                        if(err) throw err;

                        contract.lastRecharge.type.should.eql('voice');
                        contract.lastRecharge.amount.should.eql(255);

                        done();
                    });
                });
        });
    });
});