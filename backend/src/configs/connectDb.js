const admin = require("firebase-admin");
const { Timestamp, FieldValue, Filter } = require("firebase-admin/firestore");

const serviceAccount = require("./bermax-global-ltda.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const connectDb = admin.firestore();

module.exports = { connectDb, FieldValue, Timestamp, Filter };
