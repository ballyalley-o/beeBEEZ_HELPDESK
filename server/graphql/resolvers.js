const bcrypt = require('bcryptjs')
const validator = require('validator');
const jwt = require('jsonwebtoken')
const Models = require('../models');
const { deleteImage } = require('../helper/delete-image')
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
        !validator.isLength(postInput.title, { min: 5 })
      ) {
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
      posts: async function({page}, req) {
        if (!req.isAuth) {
          const error = new Error('NOT AUTHENTICATED');
          error.code = 401;
          throw error;
        }
        if (!page) {
          page = 1;
        }
        const perPage = 2;
        const totalPosts = await Post
                                    .find()
                                    .countDocuments();
        const posts = await Post.find()
                                .sort({ createdAt: -1 })
                                .skip((page - 1) * perPage)
                                .limit(perPage)
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
      },
      post: async function({ id }, req) {
        if (!req.isAuth) {
          const error = new Error('NOT AUTHENTICATED');
          error.code = 401;
          throw error;
        }
        const post = await Post.findById(id)
                               .populate('creator');
        if (!post) {
          const error = new Error('POST NOT FOUND');
          error.code = 404;
          throw error;
        }
        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString()
        }
      },
      updatePost: async function({id, postInput}, req) {
          if (!req.isAuth) {
            const error = new Error('NOT AUTHENTICATED');
            error.code = 401;
            throw error;
          }
          const post = await Post.findById(id).populate('creator');
          if (!post) {
            const error = new Error('POST NOT FOUND');
            error.code = 404;
            throw error;
          }
          if (post.creator._id.toString() !== req.userId.toString()) {
             const error = new Error('NOT AUTHORIZED');
             error.code = 403;
             throw error;
          }
          const errors = [];
          if (
            validator.isEmpty(postInput.title) ||
            !validator.isLength(postInput.title, { min: 5 })
          ) {
            errors.push({ message: 'Error in title input' });
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
          post.title = postInput.title;
          post.content = postInput.content;
          if (postInput.imageUrl !== 'undefined') {
            post.imageUrl = postInput.imageUrl;
          }
          const updatedPost = await post.save();
          return {
            ...updatedPost._doc,
            _id: updatedPost._id.toString(),
            createdAt: updatedPost.createdAt.toISOString(),
            updatedAt: updatedPost.updatedAt.toISOString()
          }
      },
      deletePost: async function({id}, req) {
         if (!req.isAuth) {
           const error = new Error('NOT AUTHENTICATED');
           error.code = 401;
           throw error;
         }
         const post = await Post.findById(id);
          if (!post) {
            const error = new Error('POST NOT FOUND');
            error.code = 404;
            throw error;
          }
          if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error('NOT AUTHORIZED');
            error.code = 403;
            throw error;
          }
          deleteImage(post.imageUrl);
            try {
               await Post.findByIdAndRemove(id);
               const user = await User.findById(req.userId);
               user.Posts.pull(id);
               await user.save();
            } catch (err) {
              const error = new Error(err);
              error.code = 403;
              throw error
            }
            return true;
      },
      user: async function(args, req) {
        if (!req.isAuth) {
          const error = new Error('NOT AUTHENTICATED');
          error.code = 401;
          throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
          const error = new Error('USER NOT FOUND');
          error.code = 404;
          throw error;
        }
        return {...user._doc,
        _id: user._id.toString()}
      },
      updateStatus: async function({status}, req) {
        if (!req.isAuth) {
          const error = new Error('NOT AUTHENTICATED');
          error.code = 401;
          throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
          const error = new Error('USER NOT FOUND');
          error.code = 404;
          throw error;
        }
        user.status = status;
        await user.save();
        return {...user._doc, id: user._id.toString()}
      }

}