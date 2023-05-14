const express = require("express");
const feedController = require('../controllers/feed');
const authProtect = require('../middleware/is-auth')
const { sanitizePost } = require('../helper/sanitize');

const router = express.Router();


//GET /feed/posts
router.get("/posts", authProtect, feedController.getPosts);

//GET /feed/posts/:postId
router.get("/post/:postId", authProtect, feedController.getPost);

//POST /feed/posts
router.post("/post", authProtect, sanitizePost, feedController.addPost);

//PUT /feed/posts/:postId
router.put("/post/:postId", authProtect, sanitizePost, feedController.updatePost);

//DELETE /feed/posts/:postId
router.delete("/post/:postId", authProtect, feedController.deletePost);


module.exports = router;