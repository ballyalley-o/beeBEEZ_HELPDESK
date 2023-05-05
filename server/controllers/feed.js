const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const logMsg = require('../helper/logger');
const Post = require('../models/Post');
require('colors');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
    Post.find()
      .countDocuments()
      .then((count) => {
        totalItems = count;
        return Post
                    .find()
                    .skip((currentPage - 1) * perPage)
                    .limit(perPage);
      })
      .then((posts) => {
        res.status(200).json({
          message: logMsg.logSUCCESS("POSTS FOUND"),
          posts: posts,
          totalItems: totalItems
        });
      })
      .catch((err) => {
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

exports.addPost = (req, res, next) => {
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

exports.updatePost = (req, res, next) => {
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
  Post.findById(postId)
  .then(post => {
    if (!post) {
      const error = new Error('Could not find the post')
      error.statusCode = 404;
      throw error
    }
    if (imageUrl !== post.imageUrl) {
      deleteImage(post.imageUrl)
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    return post.save();
  })
  .then(result => {
    res.status(200).json({
      message: 'Post UPDATED!',
      post: result
    })
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error("Could not find the post");
          error.statusCode = 404;
          throw error;
        }
        deleteImage(post.imageUrl);
        return Post.findByIdAndRemove(postId)
      })
      .then(result => {
        logMsg.logSUCCESS('POST DELETED')
        res.status(200)
            .json({message: 'POST DELETED', result: {}})
      })
      .catch(err => {
         if (!err.statusCode) {
           err.statusCode = 500;
         }
         next(err);
      })
}


const deleteImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
