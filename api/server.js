const express = require("express");
const app = express();
const users = require("./src/dbUser");

const cors = require("cors");

const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));
app.get("/:id", (req, res) => {
  const idUser = req.params.id;
  res.status(200).json({
    user: users[idUser],
  });
});

const port = 8080;

app.listen(port, () => {
  console.log("Servidor funcionando certinho!", `http://localhost:${port}`);
});
