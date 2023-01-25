const express = require("express")
const { login } = require("../controllers/auth-controller.js")

const route = express.Router()

route.post("/login", login)

module.exports = route