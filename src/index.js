require("dotenv").config()
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const userRoute = require("./routes/user-route")
const productRoute = require("./routes/product-route")

const app = express()

// app.use(express.urlencoded({
//     extended: false
// }))

app.use(cors({
    credentials: true,
    origin: "localhost:3000"
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: "auto"
    }
}))

app.use(express.json())

app.use(userRoute)
app.use(productRoute)

app.listen(process.env.PORT, () => {
    console.log("localhost:" + process.env.PORT)
})