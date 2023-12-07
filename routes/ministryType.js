const express = require('express');
const { createMinistryTpe, getMinistyType } = require("../controllers/MinistrationType");
const { isAdmin } = require('../middleware/isAdmin')
const verify = require('../middleware/auth')


const router = express.Router()

//create at /api/user/ministry
router.post('/create/ministry-types', createMinistryTpe);
router.get('/get/ministry-types', getMinistyType);






module.exports = { router }