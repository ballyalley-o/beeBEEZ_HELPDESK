const express = require("express");
const feedController = require('../controllers/feed');
const authProtect = require('../middleware/is-auth')
const { sanitizePost } = require('../helper/sanitize');

const router = express.Router();


// Method: GET
//Path: /feed/posts
router.get("/posts", authProtect, feedController.getPosts);

// Method: GET
//Path: /feed/posts/:postId
router.get("/post/:postId", authProtect, feedController.getPost);

// Method: POST
//Path: /feed/posts
router.post("/post", authProtect, sanitizePost, feedController.addPost);

// Method: PUT
//Path: /feed/posts/:postId
router.put(
  "/post/:postId",
  authProtect,
  sanitizePost,
  feedController.updatePost
);

// Method: DELETE
//Path: /feed/posts/:postId
router.delete("/post/:postId", authProtect, feedController.deletePost);




module.exports = router;