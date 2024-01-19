const User = require('../models/User.model')
const router = require('express').Router()
const { isAuthenticated } = require('../middleware/route-guard.middleware')



router.get('/:id', async (req, res) => {
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

/* router.get('/:id', isAuthenticated, async(req,res)=>{
    console.log(req.tokenPayload)
    const currentUser = await User.findById(req.tokenPayload.userId)
    res.status(200).json(currentUser)
})*/


module.exports = router