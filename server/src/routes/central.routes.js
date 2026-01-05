const express = require("express")
const routerCentral = express.Router()

routerCentral.use("/users", require("../routes/users.routes"))


module.exports = routerCentral