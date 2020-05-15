const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requiredLogin = require('../middleware/requiredLogin')

router.get('/allpost', requiredLogin, (req, res) => {
    Post.find()
    .populate("postedBy", "_id name")
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        res.json({message: err})
    })
})

router.get('/mypost', requiredLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name")
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        res.json({message: err})
    })
})

router.post('/createpost', requiredLogin, (req, res) => {
    const { title, body, pic } = req.body
    if(!title || !body || !pic){
        return res.status(442).json({error: "Please make all field fill"})
    }

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })

    post.save().then(result => {
        res.json({message: "Successfully created post", post: result})
    })
    .catch(err => {
        return res.status(500).json({message: err})
    })
})

module.exports = router
