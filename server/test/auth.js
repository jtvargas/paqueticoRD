process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { User, Company } = require('../src/models'); 

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../');
const should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
    let companyId = false;

    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            Company.deleteMany({}, (err) => {
                new Company({
                    name: 'Claro',
                    address: 'Amelia Francasci 22',
                    rnc: '5494261'
                }).save((err, company) => {
                    if(err) {
                        throw err;
                    } else {
                        companyId = company._id;
                        done();
                    }
                });
            });
        });
    });

    // TEST Registration
    describe('POST /register', () => {
        it('should register user', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({
                    companyId,
                    name: 'Customer',
                    email: 'customer@gmail.com',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    done();
                });
        });

        it('should fail with missing fields (no name)', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({
                    companyId,
                    email: 'customer@gmail.com',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    done();
                });
        });

        it('should fail with missing fields (no company id)', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({
                    name: 'Customer',
                    email: 'customer@gmail.com',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    done();
                });
        });

        it('should fail with missing fields (no email)', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({
                    companyId,
                    name: 'Customer',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    done();
                });
        });

        it('should fail with missing fields (no password)', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({
                    companyId,
                    name: 'Customer',
                    email: 'customer@gmail.com'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    done();
                });
        });
    });

    // TEST Login
    describe('POST /login', () => {
        beforeEach((done) => {
            chai.request(server)
                .post('/auth/register')
                .send({
                    companyId,
                    name: 'Customer',
                    email: 'customer@gmail.com',
                    password: 'password'
                })
                .end((err, res) => {
                    done();
                });
        });

        it('should log in successfully', (done) => {
            chai.request(server)
                .post('/auth')
                .send({
                    companyId,
                    email: 'customer@gmail.com',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    done();
                });
        });

        it('should fail with missing fields (email)', (done) => {
            chai.request(server)
                .post('/auth')
                .send({
                    companyId,
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.msg.should.eql('Missing fields');
                    done();
                });
        });

        it('should fail with missing fields (password)', (done) => {
            chai.request(server)
                .post('/auth')
                .send({
                    companyId,
                    email: 'email'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.msg.should.eql('Missing fields');
                    done();
                });
        });

        it('should fail with missing fields (companyId)', (done) => {
            chai.request(server)
                .post('/auth')
                .send({
                    email: 'email',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql(false);
                    res.body.msg.should.eql('Missing fields');
                    done();
                });
        });

        it('should fail with wrong password', (done) => {
            chai.request(server)
                .post('/auth')
                .send({
                    companyId,
                    email: 'customer@gmail.com',
                    password: 'pasword'
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.success.should.eql(false);
                    res.body.msg.should.eql('Wrong password');
                    done();
                });
        });

        it('should fail with user not found', (done) => {
            chai.request(server)
                .post('/auth')
                .send({
                    companyId,
                    email: 'customer',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.success.should.eql(false);
                    res.body.msg.should.eql('User not found');
                    done();
                });
        });
    });
});