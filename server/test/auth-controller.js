const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
require('dotenv').config()

const Models = require('../models');
const authController = require('../controllers');

const MONGODB_URI_TEST = process.env.MONGODB_URI_TEST;

const User = Models.User;

describe('Auth Controller - Login', function() {
    before(function(done) {
          mongoose
            .connect(MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: '123456',
                    name: 'Test',
                    posts: [],
                    _id: '60c4b0b4d4b8b1f9a8f7a3c5'
                })
                return user.save();
            })
            .then(() => {
                done()
            })
    })


    it('should throw an error with code 500 if accessing the database fails', function(done) {
        sinon.stub(User, 'findOne')
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: '123456'
            }
        };
        authController.auth.login(req, {}, () => {}).then((result) => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
          });
        User.findOne.restore();
    });

    it('it should send a response with a valid user status for an existing user', function(done) {
                const req = {userId: '60c4b0b4d4b8b1f9a8f7a3c5'}
                const res = {
                    statusCode: 500,
                    userStatus: null,
                    status: function(code) {
                        this.statusCode = code;
                        return this;
                    },
                    json: function(data) {
                        this.userStatus = data.status;
                    }
                }
                authController.auth.getUserStatus(req, res, () => {

                }).then(() => {
                    expect((res.statusCode)).to.be.equal(200);
                    expect((res.userStatus)).to.be.equal('NEWBIE');
                    done();
                })
    });
    after(function(done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    })
})

