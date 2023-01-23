const user = require("../models/user.js")
const argon2 = require("argon2")

const get = async (req, res) => {
    try {

        const datas = await user.findAll({
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
        const data = await user.findOne({
            where: {
                uuid: id
            },
            attributes: ["name", "email", "role"]
        })

        return res.status(200).json(data)    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

const create = async (req, res) => {
    try {

        const {
            // oteweee
        } = req.body

        const datas = await user.findAll({
            attributes: ["name", "email", "role"]
        })
        
        return res.status(200).json(datas)    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

const update = async (req, res) => {
    
}

// karena delete tidak boleh menjadi nama variabel
const destroy = async (req, res) => {
    
}

module.exports = { get, getById, create, update, destroy }
