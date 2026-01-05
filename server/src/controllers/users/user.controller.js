const pool = require("../../db/connection");

const controlUser = {
  getUser: async (req, res) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users ORDER BY id ASC"
      );

      res.status(200).json({
        success: true,
        users: rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

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
