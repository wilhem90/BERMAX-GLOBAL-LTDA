const pool = require("../../db/connection");

const controlUser = {
  //Buscamos os usuarios no sistema
  getUser: async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM USERS`);
    res.status(200).json({
      success: true,
      users: rows,
    });
  },

  //Atualizamos usuarios no sistema
  updateUser: async (req, res) => {
    const { idUser, name } = req.body;
    if (!idUser) {
      req.status(400).json({
        success: false,
        message: "Deve enviar o id do usuário para continuar esse processo!",
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
      res.status(404).json({
        success: false,
        message: "Usuário não encontrado.",
      });
    }

    res.status(202).json({
      success: true,
      message: "Dado(s) atualizado(s) com succeso!",
    });
  },
};

module.exports = controlUser;
