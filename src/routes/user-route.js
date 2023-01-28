const express = require("express")
const { verifyAuth, adminOnly } = require("../middleware/auth.js")
const {
    get,
    getById,
    create,
    update,
    destroy
} = require("../controllers/user-controller.js")

const router = express.Router()

router.get("/user", verifyAuth, get)
router.get("/user/:id", verifyAuth, getById)
router.post("/user/create", verifyAuth, adminOnly, create)
router.post("/user/update", verifyAuth, adminOnly, update)
router.post("/user/delete", verifyAuth, adminOnly, destroy)

module.exports = router