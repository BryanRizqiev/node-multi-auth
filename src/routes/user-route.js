const express = require("express")

const {
    get,
    getById,
    create,
    update,
    destroy
} = require("../controllers/user-controller.js")

const router = express.Router()

router.get("/user", get)
router.get("/user/:id", getById)
router.post("/user/create", create)
router.post("/user/update", update)
router.post("/user/delete", destroy)

module.exports = router