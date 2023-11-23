const nodemailer = require("nodemailer")
require('dotenv').config()

const user = process.env.AUTH_EMAIL
const pass = process.env.USER_PASS


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass
    }
})


module.exports = { transporter }