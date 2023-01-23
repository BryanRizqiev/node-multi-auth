const { Sequelize, DataTypes } = require("sequelize")
const db = require("../config/database.js")
const user = require("./user.js")

const product = db.define("products", {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 50]
        } 
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        } 
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        } 
    }
}, {
    freezeTableName: true
})

user.hasMany(product)
product.belongsTo(user, {foreignKeyConstraint: "userId"})

module.exports = product