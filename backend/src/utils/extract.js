const userModel = require("../users/models/userModel");

const extractUser = async (dataDetails) => {
  //   transactionType varchar(100) NOT NULL,
  //   amount DECIMAL(12, 2) NOT NULL,
  //   lastBalance DECIMAL(12, 2) NOT NULL,
  //   currentBalance DECIMAL(12, 2) NOT NULL,
  //   status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REVERSED') DEFAULT 'PENDING',
  //   paymentMethod ENUM('PIX', 'TED', 'DOC', 'BOLETO', 'CREDIT_CARD', 'DEBIT_CARD', 'INTERNAL') NOT NULL,
  //   refUser INT NOT NULL,
  //   refTransaction varchar(100),

  const saveExtract = await userModel.saveExtract(dataDetails);
  return saveExtract;
};

module.exports = extractUser;
