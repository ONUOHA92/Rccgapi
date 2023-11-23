const { Ministry } = require('../models/MinistrySongs');
const { User } = require('../models/User')




const createMinistry = async (req, res) => {
    try {
        const ministryData = req.body;
        ministryData.user = req.user.user_id;
        ministryData.last_name = req.user.last_name;

        // Fetch user information based on the user ID
        const user = await User.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status_code: 404,
            });
        }

        const newMinistry = new Ministry(ministryData);
        await newMinistry.save();

        res.status(201).json({
            newMinistry: {
                ...newMinistry.toObject(), // Convert the Mongoose document to a plain JavaScript object
                userMinistries: {
                    id: user._id,
                    last_name: user.last_name,
                },
            },
            message: "Ministry Created successfully",
            status_code: 200,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};





const getAllMinistries = async (req, res) => {
    try {
        // Find all ministries
        const ministries = await Ministry.find().populate('user', 'first_name email is_Admin');

        return res.status(200).json({
            ministries,
            message: "Retrieved all ministries successfully",
            status_code: 200
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getAllMinistry = async (req, res) => {
    try {
        // Find Ministries associated with the logged-in user
        const userMinistries = await Ministry.find({ user: req.user.user_id });

        // Get information of the logged-in user
        const loggedInUser = await User.findById(req.user.user_id);

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found",
                status_code: 404,
            });
        }

        // Map userMinistries to include additional information
        const userMinistriesWithInfo = userMinistries.map(ministry => ({
            ...ministry.toObject(),
            userMinistries: {
                first_name: loggedInUser.first_name,
            },
        }));

        res.status(200).json({
            userMinistries: userMinistriesWithInfo,
            message: "Retrieved all Ministries successfully",
            status_code: 200
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




const updateMinistry = async (req, res) => {

    const { ministryId } = req.params;
    const updatedMinistryData = req.body;

    try {

        const updatedMinistry = await Ministry.findByIdAndUpdate(ministryId, updatedMinistryData, { new: true });

        if (!updatedMinistry) {
            return res.status(404).json({ message: "Ministry song not found" });
        }

        res.status(200).json({
            updatedMinistry,
            message: "Ministry updated successfully",
            status_code: 200
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



const deleteMinistry = async (req, res) => {
    const { ministryId } = req.params;

    try {
        const deletedMinistry = await Ministry.findByIdAndRemove(ministryId);
        if (!deletedMinistry) {
            return res.status(404).json({ message: "Ministry song not found" });
        }


        res.status(200).json({
            message: "Ministry deleted successfully",
            status_code: 200
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getAllMinistriesWithSongsAndBackup = async (req, res) => {
    try {
        const allMinistries = await Ministry.find().populate({
            path: 'user',
            select: 'is_Admin' // Select the specific field(s) you want to populate
        })
            .populate('songs')
            .populate('backup');

        res.status(200).json({ allMinistries });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getSongsAndBackupById = async (req, res) => {
    try {
        const { ministryId } = req.params;

        // Find the ministry by ID and retrieve songs and backup fields
        const ministry = await Ministry.findById(ministryId).select('songs backup');

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }

        res.status(200).json({ songs: ministry.songs, backup: ministry.backup });

    } catch {
        res.status(500).json({ error: error.message });
    }
}






module.exports = { createMinistry, getAllMinistry, updateMinistry, deleteMinistry, getAllMinistries, getAllMinistriesWithSongsAndBackup, getSongsAndBackupById }