const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const router = require('express').Router()
const { isAuthenticated, isAdmin } = require('../middleware/route-guard.middleware')



router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Requested user ID:", id);

    try {
        const oneUser = await User.findById(id)
        console.log("User found:", oneUser);
        res.json(oneUser);
    } catch (error) {
        console.error("Error fetching user from database", error);
        res.status(500).json({ error: error.message, stack: error.stack, message: 'Something went wrong while fetching User' });
    }
});



module.exports = router