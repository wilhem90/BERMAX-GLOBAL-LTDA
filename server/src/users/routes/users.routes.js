const express = require("express")
const userRouter = express.Router()
const controlUser = require("../controllers/user.controller")

userRouter.get("/get-user", controlUser.getUser)

module.exports = userRouter