const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const requiredLogin = require('../middleware/requiredLogin')

router.get('/user/:id', requiredLogin, (req, res) => {
    User.findOne({_id: req.params.id})
    .select("-password")
    .then(user => {
        console.log(user)
        Post.find({postedBy: req.params.id})
        .exec((err, posts) => {
            if(err) {
                return res.status(422).json({error: err})
            }
            res.json({user, posts})
        })
    })
    .catch(err => {
        return res.status(404).json({message: "User not found"})
    })
})

module.exports = router
