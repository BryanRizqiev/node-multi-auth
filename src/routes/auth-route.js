const express = require("express")
const { login, check, logout } = require("../controllers/auth-controller.js")

const route = express.Router()

route.post("/login", login)
route.get("/check", check)
route.post("/logout", logout)

module.exports = route