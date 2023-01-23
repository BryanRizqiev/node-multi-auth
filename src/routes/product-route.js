const express = require("express")

const {
    get,
    getById,
    create,
    update,
    destroy
} = require("../controllers/product-controller.js")

const router = express.Router()

router.get("/product", get)
router.get("/product/:id", getById)
router.post("/product/create", create)
router.post("/product/update", update)
router.post("/product/delete", destroy)

module.exports = router