const User = require("../models/user.js")

const verifyAuth = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(400).json({message: "Mohon login ke akun anda"}) 
    }
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }, 
        attributes: ["id", "role"]
    })

    if (!user) return res.status(400).json({message: "Tidak auth (user tidak ditemukan)"}) 

    req.user_id = user.id
    req.role = user.role
    return next()
}

const adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }, 
        attributes: ["uuid", "role"]
    })

    if (!user) return res.status(400).json({message: "Tidak auth (user tidak ditemukan)"}) 
    if (req.role !== "admin") return res.status(400).json({message: "Akes terlarang (tidak terotorisasi)"}) 
    return next()
}

module.exports = { verifyAuth, adminOnly }