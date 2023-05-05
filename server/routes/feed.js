const express = require("express");
const feedController = require('../controllers/feed');
const { sanitizePost } = require('../helper/sanitize');

const router = express.Router();


// Method: GET
//Path: /feed/posts
router.get("/posts", feedController.getPosts);

// Method: GET
//Path: /feed/posts/:postId
router.get("/post/:postId", feedController.getPost);

// Method: POST
//Path: /feed/posts
router.post("/post", sanitizePost, feedController.addPost);

// Method: PUT
//Path: /feed/posts/:postId
router.put("/post/:postId", sanitizePost, feedController.updatePost);

// Method: DELETE
//Path: /feed/posts/:postId
router.delete("/post/:postId", feedController.deletePost);




module.exports = router;