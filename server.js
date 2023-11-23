const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { application } = require('express');
const user = require('./routes/user').router

const ministry = require('./routes/ministry').router
const songs = require("./routes/song").router
const backup = require("./routes/backup").router


require('dotenv').config()

const app = express()
app.use(bodyParser.json());
app.use(cors())



//test api  at /api/user/text
app.use("/api/user", user);
app.use("/api/", ministry);
app.use("/api", songs)
app.use("/api", backup)
//to test nodejs app

app.get('/', (req, res) => {
    res.send('Hello world nodejs is working');
})



//db config
const mongoURL = process.env.MONGODB_URL



const port = 5000;

mongoose.set("strictQuery", true);

mongoose.connect(mongoURL, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
}).catch((err) => {
    console.log(err.message + "000 errrrror")
})


app.listen(port, () => {
    console.log(`listening at port ${port}`, `connected to mongodb`)
})

module.exports = app