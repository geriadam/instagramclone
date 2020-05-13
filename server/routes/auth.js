const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requiredLogin = require('../middleware/requiredLogin')

router.get('/', (req, res) => {
    res.send('Hello')
})

router.get('/protected', requiredLogin, (req, res) => {
    res.send('hello user')
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
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
                password: hashPass
            })

            user.save()
            .then(user => {
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
                res.json({message: "Successful Login", token: token})
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

module.exports = router
