const bcrypt = require("bcrypt");
const pool = require("../../db/connection");
const { ulid } = require("ulid");
const fixAll = require("../../utils/fixAll");
const modelUser = require("../../models/users/user.model");

const controlUser = {
  createUser: async (req, res) => {
    try {
      const { full_name, email, doc_id, device_id, device_Name, password } =
        req.body;

      if (!full_name || !email || !doc_id || !device_id || !password) {
        return res.status(400).json({
          success: false,
          message: "Dados obrigatórios não informados",
        });
      }

      const userExists = await fixAll.getUserByDocIdByEmail(email, doc_id, 1);
      if (userExists) {
        return res.status(409).json({
          success: false,
          message: "Usuário já cadastrado",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const uid = ulid();

      const refUser = await modelUser.saveData({
        full_name,
        email,
        doc_id,
        device_id,
        device_Name,
        hashedPassword,
        uid,
      });

      res.status(201).json({
        success: true,
        message: refUser.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getuserByDocIdByEmail: async (req, res) => {
    const { doc_id, email } = req.query;
    if (!doc_id && !email) {
      return res.status(400).json({
        success: true,
        message: "Deve enviar alguns dados para buscar usuario.",
      });
    }

    const userData = modelUser.getData();
  },

  //Get user
  getListUserByEmail: async (req, res) => {
    try {
      let { email } = req.query;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Deve enviar o email ou doc_id para buscar dados.",
        });
      }

      if (!Array.isArray(email)) {
        email = [email];
      }

      const emails = email.map((e) => fixAll.tolower_Case(e));
      const users = await modelUser.getListUserByEmails(emails, "email");
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  //Update user
  updateUser: async (req, res) => {
    try {
      const { idUser, name } = req.body;

      if (!idUser) {
        return res.status(400).json({
          success: false,
          message: "Deve enviar o id do usuário!",
        });
      }

      const { rowCount } = await pool.query(
        `
        UPDATE users
        SET name = $1
        WHERE id = $2
        `,
        [name, idUser]
      );

      if (rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado.",
        });
      }

      res.status(202).json({
        success: true,
        message: "Dado(s) atualizado(s) com sucesso!",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = controlUser;
