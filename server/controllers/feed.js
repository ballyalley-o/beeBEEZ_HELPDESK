const { validationResult } = require('express-validator');
const logMsg = require('../helper/logger');
const Post = require('../models/Post');
require('colors');

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
          res
            .status(200)
            .json({
              message: logMsg.logSUCCESS("POSTS FOUND"),
              posts: posts
            })
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err)
        });
}

exports.addPost = (req, res, next) => {
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
        const error = new Error('Validation Failed')
        error.statusCode = 422;
        throw error;
     }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: 'images/duck.png',
      creator: {
        name: "dawg_doe",
      },
    });
    post
        .save()
        .then(result => {
           logMsg.logPOST(result)
           res.status(201).json({
             message: logMsg.logSUCCESS("POSTED SUCCESSFULLY"),
             post: result
           });
        })
        .catch(err => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
        });
    }

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "POST FOUND", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};