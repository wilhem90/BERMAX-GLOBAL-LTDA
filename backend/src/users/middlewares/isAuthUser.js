require("dotenv").config();
const jwt = require("jsonwebtoken");
const modelUser = require("../models/userModel.js");
const extractUser = require("../../utils/extract.js");
const bcrypt = require("bcrypt");

const checkUser = {
  // Verifica token
  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
      if (!token) {
        return res.status(401).json({
          message: "Acesso negado!",
        });
      }
      const userInfo = jwt.verify(token, process.env.API_KEY_BERMAX_GLOBAL);
      if (!userInfo) {
        return res.status(401).json({
          message: "Acesso negado!",
        });
      }

      req.user = userInfo;
      return next();
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      return res.status(401).json({
        message: "Token inválido!",
      });
    }
  },

  userAuthorized: async (req, res, next) => {
    const { SendValue, transactionType } = req.body;
    if (
      !SendValue ||
      (transactionType !== "topup" && SendValue < 10) ||
      (transactionType !== "transfer" && SendValue < 50)
    ) {
      return res.status(400).json({
        message: "Valor inválido!",
      });
    }
    const user = await modelUser.getUser(req.user.accountNumber);
    if (!user || user.statusUser === "inactive") {
      return res.status(401).json({
        message: "Não autorizado!",
      });
    }
    if (user.soldeAccount < SendValue) {
      return res.status(400).json({
        message: "Saldo insuficiente!",
      });
    }

    const isMatchPin = bcrypt.compare(req.body.pin, user.pin);
    if (!isMatchPin) {
      return res.status(401).json({
        message: "Acesso negado!",
      });
    }

    const saveAction = await extractUser({
      transactionType,
      SendValue,
      lastBalance: user.soldeAccount,
      currentBalance: user.soldeAccount - SendValue,
      status: "PENDING",
      paymentMethod: "INTERNAL",
      refUser: user.id,
      refTransaction: null,
    });

    return res.status(200).json({
      message: "Acesso autorizado!",
      saveAction,
    });
    // return next();
  },

  isAdmin: async (req, res, next) => {
    try {
      let data;
      if (
        ["/get-user", "/update-user", "/delete-user"].includes(req.route.path)
      ) {
        const { accountNumber, email } = req.query;
        data = accountNumber || email;
      } else if (req.route.path === "/all-users") {
        const emailsUers = req.body.emails;
        data = emailsUers;
      } else {
        data = null;
      }

      if (!data) {
        return res
          .status(400)
          .json({ message: "Informe email ou número da conta!" });
      }
      // Garante que o usuário logado é o mesmo
      const isSameUser =
        req.user.email === data || req.user.accountNumber === data;

      if (!req.user || (req.user.roleUser !== "admin" && !isSameUser)) {
        return res
          .status(401)
          .json({ message: "Não autorizado para acessar esse recurso!" });
      }

      next();
    } catch (error) {
      console.error("Erro ao verificar admin:", error);
      res.status(500).json({ message: "Erro interno!" });
    }
  },
};

module.exports = checkUser;
