const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requiredLogin = require('../middleware/requiredLogin')
const nodemailer = require('nodemailer')
const sengridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sengridTransport({
    auth: {
        api_key: "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"
    }
}))

// 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

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if(!email || !password || !name){
        return res.status(442).json({error: "Please make all field fill"})
    }

    User.findOne({email: email})
    .then((savedUser) => {
        if(savedUser) {
            return res.status(442).json({error: "User already exists"})
        }

        bcrypt.hash(password, 12)
        .then(hashPass => {
            const user = new User({
                name,
                email,
                password: hashPass,
                photo: pic
            })

            user.save()
            .then(user => {
                transporter.sendMail({
                    to: user.email,
                    from: "instagram@geriblogger.com",
                    subject: "Signup Success",
                    html: "<h1>Welcome to Instagram</h1>"
                })
                res.json({message: "Saved Successful"})
            })
            .catch(err => {
                res.json({message: err})
            })
        })
        .catch(err => {
            res.json({message: err})
        })
    })
    .catch(err => {
        res.json({message: err})
    })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if(!email && !password){
        res.status(422).json({error: "Pleas make all field fill"})
    }

    User.findOne({email: email})
    .then(match => {
        if(!match){
            return res.status(442).json({error: "Invalid Email or password"})
        }

        bcrypt.compare(password, match.password)
        .then(doMatch => {
            if(doMatch){
                const token = jwt.sign({_id: match._id}, JWT_SECRET)
                const {_id, name, email, photo, followers, following} = match
                res.json({message: "Successful Login", token: token, user: {_id, name, email, photo, followers, following}})
            } else {
                return res.status(442).json({error: "Invalid Email or password"})
            }
        })
        .catch(err => {
            res.json({message: err})    
        })
    })
    .catch(err => {
        res.json({message: err})
    })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                return res.status(422).json({error: "User doesn't exists with that email"})
            }

            user.resetToken = token
            user.expireToken = Date.now() + 360000
            user.save().then((result) => {
                transporter.sendMail({
                    to: user.email,
                    from: "instagram@geriblogger.com",
                    subject: "Reset Password Success",
                    html: `
                    <p>You requested for password reset</p>
                    <h5>Click in this <a href="http://localhost:3000/reset-password/${token}">link</a>to Reset Password</h5>
                    `
                })
                res.json({"message": "Check your email"})
            })
        })
        .catch(err => {
            res.json({message: err})
        })
    })
})


router.post('/new-password', (req, res) => {
    const newpassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken: sentToken, expireToken: {$gt: Date.now()}})
    .then(user => {
        if(!user){
            return res.status(422).json({error: "User not found"})
        }

        bcrypt.hash(newpassword, 12).then(hashedPassword => {
            user.password = hashedPassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((savedUser) => {
                res.json({"message": "Password updated"})
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router
