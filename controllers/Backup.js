const mongoose = require("mongoose");
const BackupSchema = require('../models/BackUp'); // Import your SongSchema
const { Ministry } = require('../models/MinistrySongs');
const Backup = mongoose.model('Backup', BackupSchema);






const createBackup = async (req, res) => {

    try {
        const { ministryId } = req.params;
        const { name } = req.body

        // Find the ministry by ID
        const ministry = await Ministry.findById(ministryId);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }

        // Create a new back up
        const newBackup = new Backup({ name });

        // Add the backup to the ministry's songs array
        ministry.backup.push(newBackup);

        // Save the ministry with the new song
        await ministry.save();

        res.status(201).json({
            newMinistry: ministry,
            message: 'Back Singer Created successfully',
            status_code: 200,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const getMinistryBackup = async (req, res) => {
    try {
        const { ministryId } = req.params;

        // Find the ministry by ID
        const ministry = await Ministry.findById(ministryId);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }

        // Return the back up associated with the ministry
        res.status(200).json({ backup: ministry.backup });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const deleteMinistryBackup = async (req, res) => {
    try {
        const { ministryId, backupId } = req.params;

        // Find the ministry by ID
        const ministry = await Ministry.findById(ministryId);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }

        // Find the song by ID within the ministry
        const backup = ministry.backup.id(backupId);

        if (!backup) {
            return res.status(404).json({ message: 'back Singer not found' });
        }
        // Remove the song from the ministry's songs array
        ministry.backup.pull(backup);

        // Save the updated ministry
        await ministry.save();

        res.status(200).json({ message: 'Backup deleted successfully' });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateMinistryBackup = async (req, res) => {
    try {
        const { ministryId, backupId } = req.params;
        const { name } = req.body;

        // Find the ministry by ID
        const ministry = await Ministry.findById(ministryId);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }

        // Find the song by ID within the ministry
        const backup = ministry.backup.id(backupId);

        if (!backup) {
            return res.status(404).json({ message: 'Back up not found' });
        }

        // Update the song with new data
        backup.set({ name });

        await ministry.save();

        res.status(200).json({ message: 'Back up updated successfully' });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}


module.exports = { createBackup, getMinistryBackup, deleteMinistryBackup, updateMinistryBackup }




