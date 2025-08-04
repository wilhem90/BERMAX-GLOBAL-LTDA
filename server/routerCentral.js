const express = require("express")
const routerCentral = express.Router()

routerCentral.use("/users", require("./src/users/routes/users.routes"))


module.exports = routerCentral