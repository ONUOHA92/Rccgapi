const express = require('express');
const { createBackup, getMinistryBackup, deleteMinistryBackup, updateMinistryBackup } = require("../controllers/Backup");
const verify = require('../middleware/auth')


const router = express.Router()

//create at /api/user/songs
router.post('/ministries/:ministryId/backup', createBackup);
router.get('/ministries/:ministryId/backup', getMinistryBackup);
router.delete('/ministries/delete/:ministryId/backup/:backupId', deleteMinistryBackup);
router.put('/ministries/update/:ministryId/backup/:backupId', updateMinistryBackup);


module.exports = { router }
