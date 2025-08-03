const express = require("express")
const routerCentral = express.Router()

routerCentral.use("/users", require("./src/users/routers/user.routes.js"))
routerCentral.use("/topups", require("./src/topups/routers/topups.routes.js"))
module.exports = routerCentral