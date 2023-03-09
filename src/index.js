require("dotenv").config()
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const userRoute = require("./routes/user-route")
const productRoute = require("./routes/product-route")
const multer = require("multer")
const auth = require("./routes/auth-route")
const ConnectSessionSequelize = require("connect-session-sequelize")
const db = require("./config/database.js")

const app = express()
const upload = multer()
const sessionStore = ConnectSessionSequelize(session.Store)

const store = new sessionStore({
    db
})

app.use(express.json())
app.use(upload.array())
app.use(express.urlencoded({
    extended: true
}))

app.use(cors({
    credentials: true,
    origin: "localhost:3000"
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
        // bisa dikasih expires tapi rekom maxAge
        maxAge: 3600000,
        secure: "auto"
    }
}))

// (async () => {
//     await db.sync({
//         force: true
//     })
// })()

app.get('/testing', (req, res) => {
    res.send('Hello World!')
})

app.use(auth)
app.use(userRoute)
app.use(productRoute)

app.use((err, req, res, next) => {
    console.error(err.stack)
    return res.status(500).json({message: "Error"})
})

app.listen(3000, () => {
    console.log("localhost:" + process.env.PORT)
})
