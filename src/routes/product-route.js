const express = require("express")

const {
    get,
    getById,
    create,
    update,
    destroy
} = require("../controllers/product-controller.js")
const { verifyAuth } = require("../middleware/auth.js")

const router = express.Router()

router.get("/product", verifyAuth, get)
router.get("/product/:id", verifyAuth, getById)
router.post("/product/create", verifyAuth, create)
router.post("/product/update", verifyAuth, update)
router.post("/product/delete", verifyAuth, destroy)

module.exports = router