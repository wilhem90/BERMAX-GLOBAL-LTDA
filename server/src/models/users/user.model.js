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
      RETURNING uid
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

      console.log(userResult);

      const userId = userResult.rows[0].uid;

      // 2️⃣ Registrar device
      await client.query(
        `
      INSERT INTO devices_connected (device_id, device_name, uid)
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

  getDataByUid: async (uid) => {
    const { rows } = pool.query("SELECT * FROM users WHERE uid = $1 LIMIT 1", [
      uid,
    ]);

    console.log(rows);
    return rows;
  },

  //Buscamos datos
  getDataByEmailOrDocId: async (dataUser) => {
    try {
      const conditions = [];
      const values = [];

      if (dataUser.email) {
        values.push(fixAll.tolower_Case(dataUser.email));
        conditions.push(`email = $${values.length}`);
      } else if (dataUser.doc_id) {
        values.push(fixAll.tolower_Case(dataUser.doc_id));
        conditions.push(`doc_id = $${values.length}`);
      }

      if (conditions.length === 0) {
        return { success: false, message: "Email or doc_id is required" };
      }

      const query = `
      SELECT uid,
      full_name, email,
      doc_id,
      role,
      password,
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

  getListUserByEmails: async (emails, path = "email") => {
    try {
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
      WHERE ${path} = ANY($1)
    `;

      const { rows } = await pool.query(query, [emails]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getDevice: async (uid, device_id) => {
    if (!uid || !device_id) {
      return false;
    }

    return true;
  },
};

module.exports = modelUser;
