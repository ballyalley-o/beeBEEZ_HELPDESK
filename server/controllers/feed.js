const { validationResult } = require('express-validator');
const logMsg = require('../helper/logger');
const Post = require('../models/Post');
require('colors');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
      posts: [
                {
                _id: "6",
                title: "hey",
                content: "PORT is working",
                imageUrl: "images/images.jpeg",
                creator: {
                    name: "dawg_doe"
                },
                createdAt: new Date()
                },
            ],
    });
}

exports.addPost = (req, res, next) => {
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res
                .status(422)
                .json({
                        message: 'Validation Failed',
                        errors: errors.array()
                    })
     }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: "images/images.jpeg",
      creator: {
        name: "dawg_doe",
      },
    });
    post
        .save()
        .then(result => {
           logMsg.logPOST(result)
           res.status(201).json({
             message: logMsg.logSUCCESS("POST"),
             post: result
           });
        })
        .catch(err => {
            logMsg.logERR(err)
    });
    }