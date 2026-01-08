const pool = require("../db/connection");

const fixAll = {
  tolower_Case: (text) => {
    return (lowercase = String(text).toLowerCase());
  },

  getUserByDocIdByEmail: async (email, doc_id, limit=1) => {
    const { rows } = await pool.query(
      `
    SELECT id, uid, email, doc_id
    FROM users
    WHERE email = $1 OR doc_id = $2
    LIMIT $3
    `,
      [email, doc_id, limit]
    );

    return rows[0] || null;
  },
};

module.exports = fixAll;
