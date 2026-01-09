const express = require("express");
const userRouter = express.Router();
const controlUser = require("../controllers/users/user.controller");
const middlewareUser = require("../middlewares/users/user.middleware");

userRouter.post("/create-account", controlUser.createUser);
userRouter.post("/create-token", middlewareUser.createToken)
userRouter.get("/get-user", middlewareUser.verifyToken, controlUser.getuserByDocIdByEmail);
userRouter.get("/get-users", controlUser.getListUserByEmail);
userRouter.put("/update-user", controlUser.updateUser);

module.exports = userRouter;
