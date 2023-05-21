const expect = require('chai').expect;
const authMiddleware = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

describe('Auth middleware', function () {
  //unit test
  it('should throw an error if the authorization header is not present', function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated',
    );
  });

  //integration test
  it('should throw an error if the authorization header is only one string', function () {
    const req = {
      get: function (headerName) {
        return dfe;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

   it('should bear an userId after sending the token', function () {
     const req = {
       get: function (headerName) {
         return 'Bearer kasdij2i2';
       },
     };
     sinon.stub(jwt, 'verify');
     jwt.verify.returns({ userId: '2asdas' });
     authMiddleware(req, {}, () => {});
     expect(req).to.have.property('userId');
     expect(req).to.have.property('userId', '2asdas');
     expect(jwt.verify.called).to.be.true;
     jwt.verify.restore();
   });

  it('should throw an error if the token cannot be verified', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer kasdij2i2';
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

});
