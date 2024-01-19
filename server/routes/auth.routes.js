const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const router = require('express').Router()

const SALT_ROUNDS = 13

router.post('/signup', async (req,res) => {
    const payload = req.body // {email, password, name}
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const passwordHash = bcrypt.hashSync(payload.password, salt);

    const userToRegister = { email: payload.email, passwordHash, name: payload.name }
    try{
        const newUser = await User.create(userToRegister)
        res.status(201).json({ message: 'User Created', newUser})
    } catch(error) {
        console.log(error)
        res.status(500).json(error)

    }

})



module.exports = router

