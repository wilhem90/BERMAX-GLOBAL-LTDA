const pool = require("../../db/connection");
const fixAll = require("../../utils/fixAll");

const modelUser = {
  saveData: async (dataUser) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1️⃣ Criar usuário
      const userResult = await client.query(
        `
      INSERT INTO users (full_name, email, doc_id, uid, role, password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
        [
          fixAll.tolower_Case(dataUser.full_name),
          fixAll.tolower_Case(dataUser.email),
          fixAll.tolower_Case(dataUser.doc_id),
          dataUser.uid,
          "user",
          dataUser.hashedPassword,
        ]
      );

      const userId = userResult.rows[0].id;

      // 2️⃣ Registrar device
      await client.query(
        `
      INSERT INTO devices_connected (device_id, device_name, user_id)
      VALUES ($1, $2, $3)
      `,
        [dataUser.device_id, dataUser.device_Name || null, userId]
      );

      await client.query("COMMIT");

      return { success: true, message: "Usuário criado com sucesso", userId };
    } catch (error) {
      await client.query("ROLLBACK");

      if (error.code === "23505") {
        return {
          success: false,
          message: "Usuário já cadastrado",
        };
      }

      return {
        success: false,
        message: error.message,
      };
    } finally {
      client.release();
    }
  },

  //Buscamos datos
  getData: async (dataUser) => {
    try {
      const conditions = [];
      const values = [];

      if (dataUser.email) {
        values.push(dataUser.email);
        conditions.push(`email = $${values.length}`);
      }

      if (dataUser.doc_id) {
        values.push(dataUser.doc_id);
        conditions.push(`doc_id = $${values.length}`);
      }

      if (conditions.length === 0) {
        throw new Error("Email or doc_id is required");
      }

      const query = `
      SELECT uid,
      full_name, email,
      doc_id,
      role,
      email_verified,
      account_active,
      solde_account,
      created_at 
      FROM users
      WHERE ${conditions.join(" OR ")}
      LIMIT ${dataUser.limit || 1}
    `;

      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = modelUser;
