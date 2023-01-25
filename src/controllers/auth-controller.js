const User = require("../models/user.js")
const argon2 = require("argon2")

const login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }, 
        attributes: ["uuid", "name", "email", "role"]
    })

    if (!user) return res.status(400).json({message: "User tidak ditemukan"}) 
    if (!await argon2.verify(user.password, req.body.password)) return res.status(400).json({message: "Tidak ter-auth"})
    
    req.session.userId = user.uuid

    return res.status(201).json(user)
}