const User = require("../models/user.js")
const argon2 = require("argon2")

const get = async (req, res) => {
    try {

        const datas = await User.findAll({
            attributes: ["name", "email", "role"]
        })

        return res.status(200).json(datas)    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

const getById = async (req, res) => {
    try {

        const id = req.params.id
        const data = await User.findOne({
            where: {
                uuid: id
            },
            attributes: ["name", "email", "role"]
        })

        if (!data) return res.status(400).json({message: "Data tidak ditemukan"})  

        return res.status(200).json(data)    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

const create = async (req, res) => {
    try {

        const {
            name, 
            email, 
            password, 
            confirmPassword, 
            role
        } = req.body

        const hashedPassword = argon2.hash(password)

        if (password !== confirmPassword) return res.status(400).json({message: "Password tidak sama"})
        
        await User.create({
            name,
            email,
            password: await hashedPassword,
            role
        })
        
        return res.status(200).json({message: "Register berhasil"})    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

const update = async (req, res) => {
    try {

        const {
            id,
            name, 
            email, 
            password, 
            confirmPassword, 
            role
        } = req.body

        const user = await User.findOne({
            where: {
                uuid: id
            },
            attributes: ["id", "password"]
        })

        if (!user) return res.status(400).json({message: "Update gagal"})  

        let hashedPassword
        if (password === "" || password === null) {
            password = user.password
        } else {
            hashedPassword = argon2.hash(password)
        }

        // meski update namun masih membutuhkan password lama, lebih baik confirmPassword diganti old password dan menambahkan new password
        if (password !== confirmPassword) return res.status(400).json({message: "Password tidak sama"})

        await User.update({
            name,
            email,
            password: await hashedPassword,
            role
        }, {
            where: {
                id: user.id
            }
        })
        
        return res.status(200).json({message: "Update berhasil"})    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

// karena delete tidak boleh menjadi nama variabel
const destroy = async (req, res) => {
    try {
        
        const id = req.body.id
        const user = await User.findOne({
            where: {
                uuid: id
            },
            attributes: ["id"]
        })

        if (!user) return res.status(400).json({message: "Delete gagal"})  

        await User.destroy({
            where: {
                id: user.id
            }
        })

        return res.status(200).json({message: "Delete berhasil"})    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

module.exports = { get, getById, create, update, destroy }
