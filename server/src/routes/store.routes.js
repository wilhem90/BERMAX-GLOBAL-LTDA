const express = require("express");
const storeRouter = express.Router();
const controlStore = require("../controllers/store/store.controller");

storeRouter.post("/create-store", controlStore.createStore);

module.exports = storeRouter;
