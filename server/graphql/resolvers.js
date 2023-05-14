const bcrypt = require('bcryptjs')
const validator = require('validator');
const jwt = require('jsonwebtoken')
const Models = require('../models');
require('dotenv').config()

const User = Models.User;
const Post = Models.Post;

module.exports = {
  createUser: async function({ userInput }, req) {
    const errors = [];
    if(!validator.isEmail(userInput.email)) {
        errors.push({
          message: "EMAIL IS INVALID",
          error:  userInput.email
        })
    }
    if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
        errors.push({
          message: 'PASSWORD NEEDS ATLEAST 5 CHARACTERS'
        });
    }
    if (errors.length > 0) {
      const error = new Error('INVALID INPUT');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // const email = args.userInput.email;
    const existingUser = await User.findOne({email: userInput.email});
    if (existingUser) {
        const error = new Error('USER EXISTS')
        throw error;
    }
    const hashedPwd = await bcrypt.hash(userInput.password, 12);
    const user = new User({
        email: userInput.email,
        name: userInput.name,
        password: hashedPwd
    })
    const createdUser = await user.save();
    return {...createdUser._doc, _id: createdUser._id.toString()}
  },
  login: async function({ email, password}) {
    const user = await User.findOne({email: email});
    if (!user) {
        const error = new Error('USER NOT FOUND');
        error.code = 401;
        throw error
    }
    const isEqual = await bcrypt.compare(password, user.password)

    if (!isEqual) {
      const error = new Error('INVALID CREDENTIALS');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET, {
        expiresIn: '1h'
      }
    );
    return { token: token, userId: user._id.toString() }
  },
  createPost: async function({ postInput }, req) {
    if (!req.isAuth) {
        const error = new Error('NOT AUTHENTICATED');
        error.code = 403;
        throw error;
    }
    const errors = [];
    if (validator.isEmpty(postInput.title) ||
        !validator.isLength(postInput.title, { min: 5 })) {
      errors.push({message: 'Error in title input'})
    }
     if (
       validator.isEmpty(postInput.content) ||
       !validator.isLength(postInput.content, { min: 5 })
     ) {
       errors.push({ message: 'Error in content input' });
     }
      if (errors.length > 0) {
        const error = new Error('INVALID INPUT');
        error.data = errors;
        error.code = 422;
        throw error;
      }
      const user = await User.findById(req.userId);
      if (!user) {
         const error = new Error('INVALID USER');
         error.data = errors;
         error.code = 401;
         throw error;
      }
      const post = new Post({
        title: postInput.title,
        content: postInput.content,
        imageUrl: postInput.imageUrl,
        creator: user
      });
      const createdPost = await post.save();
      user.Posts.push(createdPost);
      await user.save();
      return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString(),
            updatedAt: createdPost.updatedAt.toISOString(),
        };
      },
      posts: async function(args, req) {
        if (!req.isAuth) {
          const error = new Error('NOT AUTHENTICATED');
          error.code = 403;
          throw error;
        }
        const totalPosts = await Post
                                    .find()
                                    .countDocuments();
        const posts = await Post
                                .find()
                                .sort({ createdAt: -1 })
                                .populate('creator');
        return {
                posts: posts.map(p => {
                                  return {
                                          ...p._doc,
                                          _id: p._id.toString(),
                                          createdAt: p.createdAt.toISOString(),
                                          updatedAt: p.updatedAt.toISOString()
                                  }}),
                totalPosts: totalPosts
              };
      }
}