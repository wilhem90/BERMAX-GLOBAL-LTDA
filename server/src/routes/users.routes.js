const express = require("express");
const userRouter = express.Router();
const controlUser = require("../controllers/users/user.controller");
const middlewareUser = require("../middlewares/users/user.middleware");
const authUser = require("../db/supabase");

userRouter.post("/create-account", controlUser.createUser);
userRouter.post("/create-token", middlewareUser.createToken);
userRouter.get(
  "/get-user",
  middlewareUser.verifyToken,
  controlUser.getuserByDocIdByEmail
);
userRouter.get("/get-users", controlUser.getListUserByEmail);
userRouter.put("/update-user", controlUser.updateUser);

//Temporario
userRouter.post("/test-create", authUser.signUp);
userRouter.post("/test-login", authUser.singIn);

module.exports = userRouter;
