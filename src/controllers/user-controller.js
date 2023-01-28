const User = require("../models/user.js")
const argon2 = require("argon2")
const { Worker, threadId } = require('worker_threads')

// perlu dipertimbangkan (kalau membiarkan promise kebuka atau pakai worker (yang disini diimplementasikan)) 
// karena proses berhasil tidaknya kurang sync 

const get = async (req, res) => {
    try {

        let datas
        console.log(req.role)
        if (req.role === "common") {
            datas = await User.findAll({
                where: {
                    role: "common"
                },
                attributes: ["name", "email", "role"]
            })
        } else {
            datas = await User.findAll({
                attributes: ["name", "email", "role"]
            })
        }

        return res.status(200).json(datas)    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

const getById = async (req, res) => {
    try {

        let data
        console.log(req.role)
        if (req.role === "common") {
            data = await User.findOne({
                where: {
                    uuid: req.params.id,
                    role: "common"
                },
                attributes: ["name", "email", "role"]
            })
        } else {
            data = await User.findOne({
                where: {
                    uuid: req.params.id
                },
                attributes: ["name", "email", "role"]
            })
        }

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
        
        const data = {
            name,
            email,
            password: await hashedPassword,
            role
        }

        // dibawah buat validasi, lebih baik ada service sendiri buat validasi seperti validasi email ada service sendiri
        // biar bisa realtime dan lebih oke dalam pembagian resource 

        // async tapi yang mengerjakan thread lain
        const isOk = new Promise((resolve, reject) => {
            const worker = new Worker("./src/worker/user-controller-worker.js", { workerData: {
                action: "create_user",
                data
            } })

            worker.on("message", resolve)
            worker.on("error", reject)
            worker.on("exit", code  => {
                if (code  !==  0)
                    reject(new  Error(`Worker stopped with exit code ${code}`))
            })
        })

        // bisa tidak sync?
        // User.create({
        //     name,
        //     email,
        //     password: await hashedPassword,
        //     role
        // })

        await isOk
        
        return res.status(200).json({message: "Register berhasil"})    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

const update = async (req, res) => {
    try {

        const { id, oldPassword ,confirmPassword } = req.body

        let {
            name, 
            email, 
            newPassword, 
            role
        } = req.body

        const user = await User.findOne({
            where: {
                uuid: id
            },
            attributes: ["id", "password"]
        })

        if (!user) return res.status(400).json({message: "Update gagal"})  

        // meski update namun masih membutuhkan password lama (di form confirmPassword), lebih baik confirmPassword diganti old password dan menambahkan new password

        if (!await argon2.verify(user.password, oldPassword)) {
            return res.status(400).json({message: "Gagal update (anda tidak ter-auth)"})
        } 

        if (newPassword === "" || newPassword === null) {
            newPassword = user.password
        } else {
            if (newPassword !== confirmPassword) return res.status(400).json({message: "Password tidak sama"})
            newPassword = await argon2.hash(newPassword)
        }

        User.update({
            name,
            email,
            password: newPassword,
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
        console.log("Oke")
        
        const id = req.body.id
        const user = await User.findOne({
            where: {
                uuid: id
            },
            attributes: ["id"]
        })

        if (!user) return res.status(400).json({message: "Delete gagal (user tidak ditemukan)"})

        const isOk = new Promise((resolve, reject) => {
            const worker = new Worker("./src/worker/user-controller-worker.js", { workerData: {
                action: "delete_user",
                data: user.id
            }}
            )
            worker.on("message", resolve)
            worker.on("error", reject)
            worker.on("exit", code  => {
                if (code  !==  0)
                    reject(new  Error(`Worker stopped with exit code ${code}`))
            })
        })

        await isOk 

        // User.destroy({
        //     where: {
        //         id: user.id
        //     }
        // })

        return res.status(200).json({message: "Delete berhasil"})    

    } catch (err) {
        console.log(err)
        return res.status(400).json({message: "Error"})  
    }
}

module.exports = { get, getById, create, update, destroy }
