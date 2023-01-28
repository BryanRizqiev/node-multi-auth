const User = require("../models/user.js")
const { workerData, parentPort, threadId } = require('worker_threads')

const createUser = async (data) => {

    const {
        name,
        email,
        password,
        role
    } = data
    
    await User.create({
        name,
        email,
        password,
        role
    })

    parentPort.postMessage({done: true})
}

const deleteUser = async (id) => {
    
    await User.destroy({
        where: {
            id
        }
    })

    parentPort.postMessage({done: true})
}

switch (workerData.action) {
    case "create_user":
        createUser(workerData.data)
        break
    
    case "delete_user":
        deleteUser(workerData.data)
        break
    default:
        break
}