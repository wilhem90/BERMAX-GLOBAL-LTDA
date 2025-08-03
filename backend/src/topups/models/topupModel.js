const connectDb = require("../../configs/connectDb")

const topupModel = {
    createTopup: async (dataTopup) => {
        try {

        // Country,
        // OperatorName,
        // SkuCode,
        // AmountSended: SendValue,
        // AmountReceived,
        // AccountNumber,
        // StatusTopup: "pending",
        // CreatedAt: new Date(),
        // BatchItemRef: DistributorRef,
        // RefUser: req.user.id,
        // SendCurrencyIso: req.user.currencyIso,
        // ReceiveCurrencyIso,

            const sql = "INSERT INTO topups (Country, OperatorName, SkuCode, AmountSended, AmountReceived, AccountNumber, StatusTopup, CreatedAt, BatchItemRef, RefUser, SendCurrencyIso, ReceiveCurrencyIso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            const values = [
                dataTopup.Country,
                dataTopup.OperatorName,
                dataTopup.SkuCode,
                dataTopup.AmountSended,
                dataTopup.AmountReceived,
                dataTopup.AccountNumber,
                dataTopup.StatusTopup,
                dataTopup.CreatedAt,
                dataTopup.BatchItemRef,
                dataTopup.RefUser,
                dataTopup.SendCurrencyIso,
                dataTopup.ReceiveCurrencyIso,
            ]
            const db = await connectDb()
            const [result] = await db.query(sql, values)
            return {
                message: "Recarga criada com sucesso!",
                id: result.insertId
            }
} catch (err) {
            console.error("Erro ao criar recarga:", err.message);
            throw err;
        }
    }
}

module.exports = topupModel;