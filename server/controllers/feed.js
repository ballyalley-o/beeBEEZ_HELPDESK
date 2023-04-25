const { validationResult } = require('express-validator');
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
    const title = req.body.title;
    const content = req.body.content;
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res
                .status(422)
                .json({
                        message: 'Validation Failed',
                        errors: errors.array()
                    })
     }
    res
        .status(201)
        .json({
                message: 'Post created successfully',
                post: {
                        id: new Date().toISOString(),
                        title: title,
                        content: content,
                        creator: {
                            name: 'dawg_doe'
                        },
                        createdAt: new Date()
                    }
                })
        }