const User = require("../models/user.js")
const { workerData } = require('worker_threads')

const createUser = async () => {

    const {
        name,
        email,
        password,
        role
    } = workerData
    
    await User.create({
        name,
        email,
        password,
        role
    })
    
}

createUser()