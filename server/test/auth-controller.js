const expect = require('chai').expect;
const sinon = require('sinon');

const Models = require('../models');
const authController = require('../controllers');

const User = Models.User;

describe('Auth Controller - Login', function() {
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
    })
})

