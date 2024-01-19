const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const router = require('express').Router()
const { isAuthenticated, isAdmin } = require('../middleware/route-guard.middleware')

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

router.post('/login', async(req, res) => {
    const payload = req.body
    try {
        //queries the database
        const potentialUser = await User.findOne({ email: payload.email.toLowerCase().trim()})
        //handling user existence
        if(potentialUser) {
            //password comparison
            if(bcrypt.compareSync(payload.password, potentialUser.passwordHash)) {

                //token generation
                const authToken = jwt.sign({
                //If the password is correct, it generates a JSON Web Token (JWT) 
                userId: potentialUser._id
                },
                //the token is signed using a secret key (
                process.env.TOKEN_SECRET,
                    {
                // widely used algorithm for JWTs.
                       algorithm: 'HS256',
                //valid for 6 hours
                        expiresIn: '6h',
                    }
                )
                res.status(200).json({token: authToken})             
            } else {
                res.status(403).json({message: 'Incorrect password'})
            }          
        } else {
            res.status(404).json({message: 'User not found'})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.get('/verify', isAuthenticated, isAdmin, async(req,res)=>{
    console.log(req.tokenPayload)
    const currentUser = await User.findById(req.tokenPayload.userId)
    res.status(200).json(currentUser)
})


module.exports = router






