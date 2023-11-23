const { MinistryType } = require('../models/MinistrationType');
const { User } = require('../models/User')




const createMinistryTpe = async (req, res) => {
    try {
        // Extract relevant data from the request body
        const { days, nameType, minDateType } = req.body;

        // Fetch user information based on the user ID from the authenticated request
        const user = await User.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status_code: 404,
            });
        }

        // Create a new MinistryType document and associate it with the user
        const newMinistryType = new MinistryType({
            user: user._id, // Associate the ministry with the user's ID
            days,
            nameType,
            minDateType
        });

        // Save the new MinistryType to the database
        await newMinistryType.save();

        res.status(201).json({
            message: 'Ministry Type created successfully',
            ministryType: newMinistryType
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getMinistyType = async (req, res) => {
    try {
        // Fetch user information based on the user ID from the authenticated request
        const user = await User.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status_code: 404,
            });
        }

        // Fetch all MinistryType documents associated with the user
        const ministryTypes = await MinistryType.find({ user: user._id });

        res.status(200).json({
            message: 'Ministry Types retrieved successfully',
            ministryTypes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




module.exports = { createMinistryTpe, getMinistyType }
