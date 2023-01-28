const { Op, QueryTypes } = require("sequelize")
const Product = require("../models/product.js")
const User = require("../models/user.js")
const db = require("../config/database.js")

const get = async (req, res) => {
    let response
    try {
        
        if (req.role === "admin") {
            response = await Product.findAll({
                include: {
                    model: User,
                    required: true
                }
            })
        } else {
            response = await Product.findAll({
                // bodoh
                where: {
                    userId: req.user_id
                },
                include: {
                    model: User,
                    required: true,
                    attributes: ["email", "name"]
                }
            })
        }

    return res.status(200).json({
        role: req.role,
        datas: response
    })

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

// oke ini
const getById = async (req, res) => {
    const { id } = req.params

    let response
    try {
        
        if (req.role === "admin") {
            response = await Product.findOne({
                where: {
                    uuid: id
                }
            })
        } else {
            // dikasih kebebasan dan mencoba 
            // response = await Product.findOne({
            //     where: {
            //         uuid: id
            //     },
            //     attributes: ["name", "price"],
            //     include: {
            //         model: User,
            //         where: {
            //             role: "common"
            //         },
            //         required: true
            //     }
            // })
            response = await db.query(`SELECT prd.name, price FROM products prd INNER JOIN users usr 
                                        ON usr.id = prd.userId WHERE usr.role = "common" LIMIT 1;`, { type: QueryTypes.SELECT })
            response = response[0]
        }

    return res.status(200).json({
        role: req.role,
        data: (response) ? response : "Data tidak ada"
    })

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

const create = async (req, res) => {
    try {
        
        const { name, price, userId } = req.body

        let product
        if (req.role === "admin") {
            if (userId) {
                product = await Product.create({
                    name,
                    price,
                    userId
                })
            } else {
                product = await Product.create({
                    name,
                    price,
                    userId: req.user_id
                })
            }
        } else {
            product = await Product.create({
                name,
                price,
                userId: req.user_id
            })
        }

        return res.status(200).json({
            message: "Create sukses",
            data: product
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

const update = async (req, res) => {
    try {

        const { id, name, price, userId } = req.body

        const product = await Product.findOne({
            where: {
                uuid: id
            }
        })
        if (!product) return res.status(400).json({message: "Data (produk) tidak ditemukan"})

        let updatedProduct
        if (req.role === "admin") {
            if (userId) {
                updatedProduct = await Product.update({
                    name,
                    price,
                    userId
                }, {
                    where: {
                        id: product.id
                    },
                    limit: 1
                })
            } else {
                updatedProduct = await Product.update({
                    name,
                    price,
                }, {
                    where: {
                        id: product.id
                    },
                    limit: 1
                })
            }
        } else {
            if (req.user_id !== product.userId) return res.status(400).json({message: "Akes terlarang (tidak terotorisasi)"})
            updatedProduct = await Product.update({
                name,
                price,
            }, {
                where: {
                    userId: req.user_id,
                    id: product.id 
                },
                limit: 1
            })
        }

        if (updatedProduct[0] === 0) return res.status(400).json({message: "Data tidak ter-update"})  

        return res.status(200).json({
            message: "Update sukses"
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

// karena delete tidak boleh menjadi nama variabel
const destroy = async (req, res) => {
    try {

        const { id } = req.body

        const product = await Product.findOne({
            where: {
                uuid: id
            }
        })
        if (!product) return res.status(400).json({message: "Data (produk) tidak ditemukan"})
        
        let deletedProduct
        if (req.role === "admin") {
            deletedProduct = await Product.destroy({
                where: {
                    id: product.id
                }
            })
        } else {
            deletedProduct = await Product.destroy({
                where: {
                    userId: req.user_id,
                    id: product.id 
                }
            })
        }

        if (!deletedProduct) return res.status(400).json({message: "Data tidak ter-delete"})  

        return res.status(200).json({
            message: "Delete sukses"
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

module.exports = { get, getById, create, update, destroy }
