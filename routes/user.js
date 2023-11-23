const express = require('express');
const verify = require('../middleware/auth')
const { isAdmin } = require('../middleware/isAdmin')
const { signUp, login,
    verifyOTP,
    deleteUsers,
    deleteUserById,
    getCurrentProfile,
    upateProfile,
    getAllUsers,
    makeAdmin,
    makeMeAdmin,
    removeAdmin
} = require("../controllers/user")


const router = express.Router()

//signup at /api/user/signup
router.post('/signup', signUp);

//login a /api/user/login
router.post("/login", login)


router.post("/verifyotp", verifyOTP)

//delete all users
router.delete("/deleteall", deleteUsers);

router.delete('/delete/:id', deleteUserById);

//get user profile
router.get("/profile", verify, getCurrentProfile);

router.put("/profile", verify, upateProfile)

router.get('/users', getAllUsers);

// Endpoint to make a user an admin
router.patch('/make-admin/:userId', makeAdmin);

router.delete('/remove-admin/:userId', removeAdmin);

router.patch('/make-me-admin', verify, makeMeAdmin);


module.exports = { router }