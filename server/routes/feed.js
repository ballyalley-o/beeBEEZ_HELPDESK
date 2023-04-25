const express = require("express");
const feedController = require('../controllers/feed');
const { sanitizePost } = require('../helper/sanitize');

const router = express.Router();


// Method: GET
//Path: /feed/posts
router.get("/posts", feedController.getPosts);

// Method: POST
//Path: /feed/posts
router.post("/post", sanitizePost, feedController.addPost);




module.exports = router;