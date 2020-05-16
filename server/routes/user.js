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

router.put('/follow', requiredLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    },{
        new: true
    }, (err, result) => {
        if(err) {
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followId}
        }, {
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            return res.status(422).json({error: err})
        })
    })
})

router.put('/unfollow', requiredLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {followers: req.user._id}
    },{
        new: true
    }, (err, result) => {
        if(err) {
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.unfollowId}
        }, {
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            return res.status(422).json({error: err})
        })
    })
})

module.exports = router
