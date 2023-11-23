const express = require('express');
const { createSongs, getMinistrySongs, deleteMinistrySong, updateMinistrySong, addExistingSongAsNew, getAllMinistriesSongs } = require("../controllers/Song");
const verify = require('../middleware/auth')


const router = express.Router()

//create at /api/user/songs
router.post('/ministries/:ministryId/songs', createSongs);
router.get('/ministries/:ministryId/songs', getMinistrySongs);
router.delete('/ministries/delete/:ministryId/songs/:songId', deleteMinistrySong);
router.put('/ministries/update/:ministryId/songs/:songId', updateMinistrySong);
router.post('/add-existing/:ministryId/songs/:songId', addExistingSongAsNew);
router.get('/all-ministries-songs', getAllMinistriesSongs)



module.exports = { router }