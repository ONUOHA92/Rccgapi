const bcrypt = require("bcrypt")
const { User } = require("../models/User")
const jwt = require("jsonwebtoken")
const { UserOTPVerification } = require("../models/UserOtpverification")
const { transporter } = require("../utils/nodemailer.config")
const { response } = require("express")
require('dotenv').config()


const signUp = async (req, res) => {
    // get user validate input
    const { first_name, last_name, email, is_Admin, password, confirmPassword } = req.body;
    try {
        if (!(first_name, is_Admin, password, last_name, email)) {
            return res.status(400).send("Kindly fill all required input")
        }


        //check if user already exist
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            // console.log(existingUser)
            return res.status(409).send("User with this email already exist")
        } else {


            if (password != confirmPassword) {
                return res.status(400).send("password doestn't match")
            }

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10)

            //add user to DB
            const user = await User.create({
                first_name,
                last_name,
                is_Admin,
                email: email.toLowerCase(),
                password: encryptedPassword
            })

            //create a   token
            const token = jwt.sign({
                user_id: user._id,
                email,

            },
                process.env.TOKEN_KEY
            )

            user.token = token

            // await sendOTPVerificationMail(user, res)
            res.status(201).json({
                user,
                token,
                message: "User created successfully",
                status_code: 201
            })

        }

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
            status_code: 400
        })
    }

}



const login = async (req, res) => {
    const { email, password } = req.body
    try {
        //validate
        if (!(email && password)) {
            return res.status(400).send("Kindly fill all input")
        }

        //get user
        const user = await User.findOne({ email })
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign(
                    { user_id: user._id, email, is_Admin: user.is_Admin },
                    process.env.TOKEN_KEY
                )
                user.token = token
                res.status(200).json({
                    user, token,
                    message: "Login Successfull",
                    status_code: 200
                })
            } else {
                res.status(400).send("password Incorrect")
            }
        } else {
            res.status(404).send("No account with this email")
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            status_code: 400,
            message: error.message
        })
    }
}


const deleteUsers = async (req, res) => {

    try {
        const allUsers = await User.deleteMany()
        res.status(200).json(allUsers)
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
            status_code: 200
        })
    }
}


// delete user by id 
const deleteUserById = async (req, res) => {
    const userId = req.params.id; // Assuming the user ID is sent as a parameter
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
}



const verifyOTP = async (req, res) => {
    const { otp, userid } = req.body
    try {
        if (!otp || !userid) {
            throw Error("Empty otp details  not allowed!!")
        } else {
            const userRecords = await UserOTPVerification.find({ userId: userid })
            if (userRecords <= 0) {
                throw new Error("User doesn't exist")
            } else {
                const { expiresAt } = userRecords[0]
                const hashedOTP = userRecords[0].otp
                if (expiresAt < Date.now()) {
                    throw new Error("otp has expired try to resend")
                } else {
                    const validatedOTP = await bcrypt.compare(otp, hashedOTP)
                    console.log(validatedOTP)
                    if (!validatedOTP) {
                        throw new Error("Enter  a valid otp")
                    } else {
                        await User.updateOne({ _id: userid }, { isVerified: true })
                        await userRecords[0].delete({ _id: userid });
                        res.status(202).json({
                            status: "SUCCESS",
                            message: "User email verified",
                            status_code: 200
                        })
                    }

                }
            }
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
            status_code: 400
        })
    }
}

const sendOTPVerificationMail = async ({ _id, email }, res) => {

    try {

        //Generate token
        const otp = Math.floor(10000 + Math.random() * 90000)
        const stringOTP = otp.toString()
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'verify your email',
            html: `<p>Enter <b>${otp}</b> in your verified email address and complete your verification</p> 
         <p>Note: This OTP will expire in the next 1 hours</p>`

        }

        const hashedOTP = await bcrypt.hash(stringOTP, 10)

        await UserOTPVerification.create({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        })

        await transporter.sendMail(mailOptions);
        return {
            status: "PENDING",
            message: " verification otp email sent",
            data: {
                userId: _id,
                email
            },
        }
        //  res.status(200).json({
        //    status:"PENDING",
        //    message: " verification otp email sent",
        //    data: {
        //       userId : _id,
        //       email                                     
        //    },
        //  })
    } catch (error) {
        return {
            status: "FAILED",
            message: error.message
        }
        // res.json({
        //    status:"FAILED",
        //    message: error.message
        // })
    }
}


const getCurrentProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id);

        res.status(200)
            .json({
                status: "SUCCESS",
                _id: user.id,
                first_name: user.first_name,
                middle_name: user.middle_name,
                last_name: user.last_name,
                email: user.email,
                address: user.address,
                age: user.age,
                gender: user.gender,
                status_code: 200
            })

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }

}


const upateProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user.user_id);
        if (user) {
            user.first_name = req.body.first_name || user.first_name;
            user.middle_name = req.body.middle_name || user.middle_name;
            user.last_name = req.body.last_name || user.last_name;
            user.email = req.body.email || user.email;
            user.address = req.body.address || user.address;
            user.age = req.body.age || user.age;
            user.gender = req.body.gender || user.gender;
            user.class_level = req.body.class_level || user.class_level;
            user.qualification = req.body.qualification || user.qualification;
            user.interview = req.body.interview || user.interview;


            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                first_name: updatedUser.first_name,
                middle_name: updatedUser.middle_name,
                last_name: updatedUser.last_name,
                email: updatedUser.email,
                address: updatedUser.address,
                age: updatedUser.age,
                gender: updatedUser.gender,
                class_level: updatedUser.class_level,
                qualification: updatedUser.qualification,
                interview: updatedUser.interview,
                status_code: 200

            })
        }

    } catch (error) {
        res.status(404).json({
            status: "FAILED",
            message: error.message,
        })

    }

}


// const getAllUsers = async (req, res) => {
//     try {
//         // Get all users
//         const users = await User.find({}, { password: 0 }); // Exclude password field from the response

//         return res.status(200).json({ users });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }).populate('userMinistries');

        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




const removeAdmin = async (req, res) => {
    const { userId } = req.params;

    try {
        // Logic to remove admin role from the user
        const updatedUser = await User.findByIdAndUpdate(userId, { is_Admin: 0 }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User is no longer an admin', user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};







const makeAdmin = async (req, res) => {
    const { userId } = req.params;

    try {
        // Logic to update the user to admin
        const updatedUser = await User.findByIdAndUpdate(userId, { is_Admin: 1 }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User is now an admin', user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



const makeMeAdmin = async (req, res) => {
    try {
        // Get the ID of the authenticated user
        const userId = req.user.user_id;


        //Update the user to be an admin
        const updatedUser = await User.findByIdAndUpdate(userId, { is_Admin: 1 }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'You are now an admin', user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




module.exports = { signUp, login, verifyOTP, deleteUsers, deleteUserById, getCurrentProfile, upateProfile, getAllUsers, makeAdmin, makeMeAdmin, removeAdmin }