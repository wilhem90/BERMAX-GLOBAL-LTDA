const express = require("express")
const routerCentral = express.Router()
routerCentral.use("/users", require("../routes/users.routes"))
routerCentral.use("/store", require("../routes/store.routes"))
module.exports = routerCentral