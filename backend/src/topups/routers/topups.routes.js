const express = require("express");

const routesTopups = express.Router();
const checkUser = require("../../users/middlewares/isAuthUser.js");
const controlTopups = require("../controllers/topups.controller.js");

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

routesTopups.get(
  "/countries",
  limiter,
  checkUser.verifyToken,
  controlTopups.getCountries
);
routesTopups.get(
  "/providers",
  limiter,
  checkUser.verifyToken,
  controlTopups.GetProviders
);
routesTopups.get(
  "/operators",
  limiter,
  checkUser.verifyToken,
  controlTopups.getProducts
);
routesTopups.post(
  "/estimates",
  limiter,
  checkUser.verifyToken,
  controlTopups.estimatePrices
);
routesTopups.post(
  "/create-topup",
  checkUser.verifyToken,
  checkUser.userAuthorized,
  controlTopups.createTopup
);
// routesTopups.get("/all-topups", checkUser.verifyToken, controlTopups.getAllUsers)

module.exports = routesTopups;
