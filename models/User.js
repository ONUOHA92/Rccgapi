const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = Schema({
    userMinistries: [{ type: Schema.Types.ObjectId, ref: 'Ministry' }],

    first_name: {
        type: String,
        required: [true, "please provide your firstName"]
    },
    last_name: {
        type: String,
        required: [true, "please provide your middleName"]
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "email is required"],
        unique: [true, "email has already been registered"]
    },
    password: {
        type: String,
        required: [true, " password is required"],
        minlength: [8, "minimum password length is 8"],

    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/eminence222/image/upload/v1680795655/images_apvf0q.png"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Pending", "Active"],
        default: "Pending"
    },
    is_Admin: {
        type: Number,
        default: 0
    },

    data: {
        type: Date,
        default: Date.now()
    }

})
userSchema.methods.generateAuthToken = async () => {
    const user = this
    const token = jwt.sign({
        user_id: user._id.toString()
    }, "user token", { expiresIn: '1h' })

    return token
}


const User = mongoose.model("User", userSchema)

module.exports = { User }