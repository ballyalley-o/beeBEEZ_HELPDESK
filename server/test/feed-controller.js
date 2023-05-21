const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
require('dotenv').config();

const Models = require('../models');
const feedController = require('../controllers/feed');

const MONGODB_URI_TEST = process.env.MONGODB_URI_TEST;

const User = Models.User;

describe('Feed Controller', function () {
  before(function (done) {
    mongoose
      .connect(MONGODB_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((result) => {
        const user = new User({
          email: 'test@test.com',
          password: '123456',
          name: 'Test',
          posts: [],
          _id: '60c4b0b4d4b8b1f9a8f7a3c5',
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function () {});

  afterEach(function () {});

  it('should add a created post to the post of the creator', function (done) {
    const req = {
      body: {
        title: 'A Test Post',
        content: 'This is a test post',
      },
      file: {
        path: 'abc',
      },
      userId: '60c4b0b4d4b8b1f9a8f7a3c5',
    };
    const res = {
        status: function() {
            return this;
        },
        json: function() {}
    };
    feedController.addPost(req, res, () => {})
      .then((savedUser) => {
        expect(savedUser).to.have.property('posts');
        expect(savedUser.Posts).to.have.length(1);
        done();
      });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
