const modelUser = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const controlUser = {
  // create user
  createUser: async (req, res) => {
    try {
      const { nome, sobrenome, email, countryUser, phoneNumber, passwordUser } =
        req.body;

      if (
        !nome ||
        !sobrenome ||
        !email ||
        !countryUser ||
        !phoneNumber ||
        !passwordUser ||
        passwordUser.length < 8
      ) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios ausentes." });
      }

      const clientId = uuid();
      const secretKey = crypto.randomBytes(32).toString("hex");
      const passwordHashed = bcrypt.hashSync(passwordUser, 8);

      const newUser = {
        nome,
        sobrenome,
        email,
        statusUser: "inactive",
        emailVerified: false,
        phoneNumber,
        soldeAccount: 0.0,
        accountNumber: Math.floor(999_999 - Math.random() * 1000_000),
        passwordUser: passwordHashed,
        clientId,
        secretKey,
        createdAt: new Date(),
        updateAt: new Date(),
      };

      const dataUsers = await modelUser.createUser(newUser);

      return res.status(201).json({
        message: "Usuário criado com sucesso.",
        user: {
          id: dataUsers.insertId,
          nome,
          sobrenome,
          email,
          phoneNumber,
          soldeAccount: 0.0,
          accountNumber: newUser.accountNumber,
          statusUser: "inactive",
          emailVerified: false,
          createdAt: new Date(),
          updateAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  // login user
  loginUser: async (req, res) => {
    const { email, passwordUser, expiresIn } = req.body;
    if (!email || !passwordUser) {
      return res.status(401).json({
        message: "Deve informar seus credenciais para acessar ao sistema!",
      });
    }

    try {
      const user = await modelUser.getUser(email);
      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado!",
        });
      }

      const checkPassword = bcrypt.compareSync(passwordUser, user.passwordUser);
      if (!checkPassword) {
        return res.status(401).json({
          message: "Senha incorreta!",
        });
      }

      const refToken = crypto.randomBytes(8).toString("hex");
      const token = jwt.sign(
        {
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email,
          clientId: user.clientId,
          phoneNumber: user.phoneNumber,
          accountNumber: user.accountNumber,
          refToken,
        },
        process.env.API_KEY_BERMAX_GLOBAL,
        {
          expiresIn: expiresIn || "1h",
        }
      );

      await modelUser.updateUser(user.accountNumber, {
        emailVerified: true,
        lastLogin: new Date(),
        tokens: {
          op: "add",
          refToken,
        },
      });
      return res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  },

  logoutUser: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
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
      const user = await modelUser.getUser(userInfo.accountNumber);
      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado!",
        });
      }

      const logout = await modelUser.updateUser(userInfo.accountNumber, {
        tokens: {
          op: "remove",
          refToken: userInfo.refToken,
        },
      });
      return res.status(200).json({
        message: "Logout realizado com sucesso!",
        logout,
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  },

  validateEmailUser: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({
        message: "Nenhum email informado!",
      });
    }
    try {
      const user = await modelUser.getUser(email);
      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado!",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.API_KEY_BERMAX_GLOBAL,
        {
          expiresIn: "15m",
        }
      );

      return res.status(200).json({
        message: "Token enviado com sucesso!",
        token,
      });
    } catch (error) {
      console.error("Erro ao gerar token de validação:", error);
      return res
        .status(500)
        .json({ message: "Erro interno do servidor.", error });
    }
  },

  // Get user by email or account number
  getUser: async (req, res) => {
    const userRef = req.query.email || req.query.accountNumber;
    if (!userRef) {
      return res.status(401).json({
        message: "Deve informar o email ou o numero da conta!",
      });
    }

    try {
      const user = await modelUser.getUser(userRef);
      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado.",
        });
      }
      return res.status(200).json({
        ...user,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      return res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  },

  // Search all users
  getAllUsers: async (req, res) => {
    try {
      const users = await modelUser.getAllUsers(req.body.emails);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const idUser = req.query.idUser;

       // Validação inicial
    if (!idUser || typeof idUser !== "string") {
      throw new Error("ID do usuário inválido");
    }

      const userData = req.body;
      const responseUser = await modelUser.updateUser(idUser, userData);
      const atualizado = responseUser.success;

      return res.status(atualizado ? 200 : 404).json({
        isUpdated: atualizado,
        message: atualizado
          ? "Usuário atualizado com sucesso."
          : "Usuário não encontrado.",
      });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err.message);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const account_number = req.query.account_number;

      if (!account_number || isNaN(account_number)) {
        return res.status(400).json({
          error: "account_number de usuário inválido.",
        });
      }
      const responseUser = await modelUser.deleteUser(account_number);
      const deletado = responseUser.affectedRows > 0;

      return res.status(deletado ? 200 : 404).json({
        isDeleted: deletado,
        message: deletado
          ? "Usuário deletado com sucesso."
          : "Usuário não encontrado.",
      });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err.message);
      return res.status(500).json({
        error: "Erro interno ao deletar usuário.",
      });
    }
  },
};

module.exports = controlUser;
