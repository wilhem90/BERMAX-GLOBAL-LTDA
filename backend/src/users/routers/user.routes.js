const express = require("express");

const routesUser = express.Router();
const controlUser = require("../controllers/user.controller.js");
const checkUser = require("../middlewares/isAuthUser.js");

routesUser.post("/create-user", controlUser.createUser);
routesUser.post("/login-user", controlUser.loginUser);
routesUser.get(
  "/get-user",
  controlUser.getUser
);
routesUser.post(
  "/all-users",
  controlUser.getAllUsers
);
routesUser.put(
  "/update-user",
  controlUser.updateUser
);
routesUser.delete("/delete-user", checkUser.isAdmin, controlUser.deleteUser);

module.exports = routesUser;
