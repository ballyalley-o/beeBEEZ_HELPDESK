const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
// const io = require('../helper/socket');
const logMsg = require('../helper/logger');
const Post = require('../models/Post');
const User = require('../models/User')
require('colors');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
     const totalItems = await Post
                                .find()
                                .countDocuments()
     const Posts = await Post
                    .find()
                    .populate('creator')
                    .sort({createdAt: -1})
                    .skip((currentPage - 1) * perPage)
                    .limit(perPage);
        res.status(200).json({
          message: logMsg.logSUCCESS('POSTS FOUND'),
          posts: Posts,
          totalItems: totalItems,
        });
      } catch (err) {
          if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
      }
    }

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId)
    try {
       if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "POST FOUND", post: post });
    }
    catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
};

exports.addPost = async (req, res, next) => {
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
        const error = new Error('Validation Failed')
        error.statusCode = 422;
        throw error;
     }
     if (!req.file) {
      const error = new Error('NO IMAGE PROVIDED')
      error.statusCode = 422;
      throw error
     }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId
    });
    try {
    await post.save()
    const user = await User.findById(req.userId)
    user.Posts.push(post)
    //just put in variable to return  this for testing
   const savedUser = await user.save();
          // io
          // .getIO()
          // .emit('Posts', {
          //                 action: 'create',
          //                 post: {
          //                       ...post._doc,
          //                         creator: {
          //                           _id: req.userId,
          //                           name: user.name
          //                         }
          //                       }
          //                 });
           res.status(201).json({
             message: "POSTED SUCCESSFULLY",
             post: post,
             creator: {
                        _id: user._id,
                        name: user.name
              }
           });
           //for testing
           return savedUser;
    }
    catch (err) {
       if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
    }
  }

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
     if (!errors.isEmpty()) {
        const error = new Error('Validation Failed')
        error.statusCode = 422;
        throw error;
     }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path
  }
  if (!imageUrl) {
    const error = new Error('No file selected');
    error.statusCode = 422;
    throw error;
  }
   try {
     const post = await Post.findById(postId).populate('creator')

     if (!post) {
       const error = new Error("Could not find the post");
       error.statusCode = 404;
       throw error;
     }
     if (post.creator._id.toString() !== req.userId) {
       const error = new Error("NOT AUTHENTICATED TO EDIT THIS POST");
       error.statusCode = 403;
       throw error;
     }
     if (imageUrl !== post.imageUrl) {
       deleteImage(post.imageUrl);
     }
     post.title = title;
     post.imageUrl = imageUrl;
     post.content = content;
     const result = await post.save();
     io.getIO().emit('Posts', { action: 'update', post: result})
     res.status(200).json({
       message: "Post UPDATED!",
       post: result,
     });
   } catch (err) {
     if (!err.statusCode) {
       err.statusCode = 500;
     }
     next(err);
   }
}

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId)
        if (!post) {
          const error = new Error("Could not find the post");
          error.statusCode = 404;
          throw error;
        }
        if (post.creator.toString() !== req.userId) {
          const error = new Error("NOT AUTHENTICATED TO DELETE THIS POST");
          error.statusCode = 403;
          throw error;
        }
        deleteImage(post.imageUrl);
        await Post.findByIdAndRemove(postId)
        const user = User.findById(req.userId)

        user.Posts.pull(postId)
        await user.save();
        io.getIO().emit('Posts', {action: 'delete', post: postId})
        logMsg.logSUCCESS("POST DELETED");
        res.status(200).json({ message: "POST DELETED", result: {}
      });
  }
  catch (err) {
    if (!err.statusCode) {
           err.statusCode = 500;
         }
         next(err);
  }
}

const deleteImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};

module.exports = {
  deleteImage
}
