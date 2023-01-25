const User = require("../models/user.js")
const argon2 = require("argon2")

const login = async (req, res) => {
    const {
        email,
        password
    } = req.body

    const user = await User.findOne({
        where: {
            email
        }, 
        attributes: ["uuid", "name", "email", "password", "role"]
    })

    if (!user) return res.status(400).json({message: "User tidak ditemukan"}) 
    
    if (!await argon2.verify(user.password, (password === "" || password === undefined) ? "" : password)) return res.status(400).json({message: "Tidak ter-auth"})
    
    req.session.userId = user.uuid
    delete user.dataValues.password
    return res.status(200).json(user)
}

const check = async (req, res) => {
    if (!req.session.userId) {
        return res.status(400).json({message: "Mohon login ke akun anda"}) 
    }

    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }, 
        attributes: ["uuid", "name", "email", "role"]
    })

    if (!user) return res.status(400).json({message: "User tidak ditemukan"}) 

    return res.status(200).json(user)
}

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({message: "Tidak dapat logout"}) 
        return res.status(200).json({message: "Berhasil logout"})
    })
}

module.exports = { login, check, logout }