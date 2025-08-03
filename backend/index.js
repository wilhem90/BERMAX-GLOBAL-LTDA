require("dotenv").config()
const routerCentral = require("./routerCentral.js")
const morgan = require("morgan")
const cors = require("cors")
const express = require("express")
const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", routerCentral)

const PORT = process.env.PORT || 7571
app.listen(PORT, () => {
    console.log("Server esta rodando com succeso!", PORT);
    console.log(`http://localhost:${PORT}`);
})