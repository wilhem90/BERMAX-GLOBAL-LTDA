const express = require("express");
const userRouter = express.Router();
const controlUser = require("../controllers/users/user.controller");

userRouter.get("/get-user", controlUser.getUser);
userRouter.put("/update-user", controlUser.updateUser);

module.exports = userRouter;
