const express = require('express');
const { createMinistry, getAllMinistry, updateMinistry, getAllMinistriesWithSongsAndBackup, deleteMinistry, getAllMinistries, getSongsAndBackupById } = require("../controllers/MinistrySongs");
const { isAdmin } = require('../middleware/isAdmin')
const verify = require('../middleware/auth')


const router = express.Router()

//create at /api/user/ministry
router.post('/create/ministries', verify, createMinistry);

//get a /api/user/note
router.get("/get/all", verify, getAllMinistry);

//get a /api/user/note
router.get("/get/all-ministries", verify, isAdmin, getAllMinistries);

// put to update ministry songs
router.put('/update/:ministryId', verify, updateMinistry);


// delete ministry songs
router.delete('/ministries/:ministryId', verify, deleteMinistry)

router.get('/allMinistriesWithSongsAndBackup', getAllMinistriesWithSongsAndBackup);

router.get('/ministries/:ministryId/songs-backup', getSongsAndBackupById);




module.exports = { router }