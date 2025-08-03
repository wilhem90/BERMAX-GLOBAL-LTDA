const { connectDb, FieldValue } = require("../../configs/connectDb.js");

const userModel = {
  // create user
  createUser: async (dataUsers) => {
    try {
      const refUser = await connectDb.collection("users").add(dataUsers);
      const result = await refUser.get();

      return {
        id: result.id,
        message: "Usuário criado com sucesso!",
      };
    } catch (err) {
      console.error("Erro ao criar usuário:", err.message);
      throw err;
    }
  },

  // Get user
  getUser: async (data) => {
    const typeData = isNaN(data) ? "emailUser" : "accountNumber";
    const user = await connectDb
      .collection("users")
      .where(typeData, "==", data)
      .get();
    if (user.docs.length === 1) {
      return {
        id: user.docs[0].id,
        firstNameUser: user.docs[0].data().firstNameUser,
        lastNameUser: user.docs[0].data().lastNameUser,
        emailUser: user.docs[0].data().emailUser,
        statusUser: user.docs[0].data().statusUser,
        emailVerified: user.docs[0].data().emailVerified,
        roleUser: user.docs[0].data().roleUser,
        phoneNumber: user.docs[0].data().phoneNumber,
        soldeAccount: user.docs[0].data().soldeAccount,
        accountNumber: user.docs[0].data().accountNumber,
        passwordUser: user.docs[0].data().passwordUser,
        clientId: user.docs[0].data().clientId,
        currencyIso: user.docs[0].data().currency,
        createdAt: user.docs[0].data().createdAt,
        updateAt: user.docs[0].data().updateAt,
        tokens: user.docs[0].data().tokens,
        lastLogin: user.docs[0].data().lastLogin,
      };
    }
    return null;
  },

  // Get all users
  getAllUsers: async (emails) => {
    const refUsers = emails.map(async (email) => {
      const user = await connectDb
        .collection("users")
        .where("emailUser", "==", email)
        .get();
      if (user.docs.length === 1) {
        return {
          firstNameUser: user.docs[0].data().firstNameUser,
          lastNameUser: user.docs[0].data().lastNameUser,
          emailUser: user.docs[0].data().emailUser,
          statusUser: user.docs[0].data().statusUser,
          emailVerified: user.docs[0].data().emailVerified,
          roleUser: user.docs[0].data().roleUser,
          phoneNumber: user.docs[0].data().phoneNumber,
          soldeAccount: user.docs[0].data().soldeAccount,
          accountNumber: user.docs[0].data().accountNumber,
          clientId: user.docs[0].data().clientId,
          currencyIso: user.docs[0].data().currency,
          createdAt: user.docs[0].data().createdAt,
          updateAt: user.docs[0].data().updateAt,
          lastLogin: user.docs[0].data().lastLogin,
        };
      }
    });
    return await Promise.all(refUsers);
  },

  // Update user
  updateUser: async (idUser, data) => {
    // Validação inicial

    if (!data || typeof data !== "object") {
      throw new Error("Dados de atualização inválidos");
    }

    const allowedFields = [
      "nome",
      "sobrenome",
      "countryUser",
      "phoneNumber",
      "passwordUser",
      "pinUser",
      "statusUser",
      "emailVerified",
      "roleUser",
      "currencyIso",
      "soldeAccount",
      "tokens",
      "lastLogin",
    ];

    // Filtra campos permitidos
    const dataValidToUpdate = Object.keys(data).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    if (Object.keys(dataValidToUpdate).length === 0) {
      return {
        success: false,
        message: "Nenhum campo válido para atualização",
        code: "NO_VALID_FIELDS",
      };
    }

    try {
      const docRef = connectDb.collection("users").doc(idUser);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        return {
          success: false,
          message: "Usuário não encontrado",
          code: "USER_NOT_FOUND",
        };
      }

      // Tratamento especial para tokens
      if (dataValidToUpdate.tokens) {
        const { op, token } = dataValidToUpdate.tokens;

        if (!token) {
          return {
            success: false,
            message: "Token não fornecido",
            code: "MISSING_TOKEN",
          };
        }

        const updateData = {};

        switch (op) {
          case "add":
            updateData.tokenUser = FieldValue.arrayUnion(token);
            break;
          case "remove":
            updateData.tokenUser = FieldValue.arrayRemove(token);
            break;
          case "remove-all":
            updateData.tokenUser = [];
            break;
          default:
            return {
              success: false,
              message: "Operação de token inválida",
              code: "INVALID_TOKEN_OPERATION",
            };
        }

        await docRef.update(updateData);
        return {
          success: true,
          message: "Tokens atualizados com sucesso!",
          operation: `token_${op}`,
        };
      }

      // Atualização de outros campos
      const standardUpdates = {};
      let hasUpdates = false;

      for (const [field, value] of Object.entries(dataValidToUpdate)) {
        if (field === "tokens") continue; // Já tratado acima

        if (field === "passwordUser") {
          // Lógica para hash de senha (exemplo)
          // const hashedPassword = await hashPassword(value);
          // standardUpdates[field] = hashedPassword;
          standardUpdates[field] = value;
        } else {
          standardUpdates[field] = value;
        }
        hasUpdates = true;
      }

      if (hasUpdates) {
        await docRef.update(standardUpdates);
      }

      return {
        success: true,
        message: "Usuário atualizado com sucesso!",
        updatedFields: Object.keys(dataValidToUpdate),
      };
    } catch (error) {
      console.error("Erro detalhado ao atualizar usuário:", {
        idUser,
        error: error.message,
        stack: error.stack,
      });

      throw new Error(`Falha ao atualizar usuário ${idUser}: ${error.message}`);
    }
  },

  // Usuario deletado
  deleteUser: async (accountNumber) => {
    const db = await connectDb();
    const [result] = await db.query(
      `DELETE FROM users WHERE users.accountNumber = ?`,
      accountNumber
    );
    return result;
  },

  saveExtract: async (dataDetails) => {
    try {
      console.log(dataDetails);
      return null;
    } catch (error) {
      console.log("Erro ao extrair detalhes: ", error.message);
      return null;
    }
  },
};

module.exports = userModel;
