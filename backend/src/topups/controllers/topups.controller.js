const checkUser = require("../../users/middlewares/isAuthUser");
const topupModel = require("../models/topupModel");

require("dotenv").config();

function controlPrices(value) {
  let percent = 0.25;
  if (value > 50) {
    percent = 0.2;
  } else if (value > 60) {
    percent = 0.19;
  } else if (value > 70) {
    percent = 0.18;
  } else if (value > 80) {
    percent = 0.17;
  } else if (value > 90) {
    percent = 0.16;
  } else if (value > 100) {
    percent = 0.15;
  } else if (value > 110) {
    percent = 0.14;
  } else if (value > 120) {
    percent = 0.13;
  } else if (value > 130) {
    percent = 0.12;
  } else if (value > 140) {
    percent = 0.11;
  } else if (value > 150) {
    percent = 0.1;
  }
  const price = value + value * percent;
  return price < 10 ? 10 : price;
}

function caluculatePrice(value) {
  let percent = 1.25;
  if (value > 50) {
    percent = 1.2;
  } else if (value > 60) {
    percent = 1.19;
  } else if (value > 70) {
    percent = 1.18;
  } else if (value > 80) {
    percent = 1.17;
  } else if (value > 90) {
    percent = 1.16;
  } else if (value > 100) {
    percent = 1.15;
  } else if (value > 110) {
    percent = 1.14;
  } else if (value > 120) {
    percent = 1.13;
  } else if (value > 130) {
    percent = 1.12;
  } else if (value > 140) {
    percent = 1.11;
  } else if (value > 150) {
    percent = 1.1;
  }
  return (value / percent).toFixed(1);
}

async function getEstimateValue(SendValue, SendCurrencyIso, SkuCode) {
  const BatchItemRef = Math.random().toString(36).substring(2, 7);
  const options = {
    method: "POST",
    headers: {
      api_key: process.env.APIKEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        SendValue: caluculatePrice(SendValue),
        SendCurrencyIso,
        SkuCode,
        BatchItemRef,
      },
    ]),
  };

  return await (
    await fetch("https://api.dingconnect.com/api/V1/EstimatePrices", options)
  ).json();
}

const controlTopups = {
  // Bucamos os paises
  getCountries: async (req, res) => {
    try {
      {
        const options = {
          method: "GET",
          headers: {
            api_key: process.env.APIKEY,
          },
        };
        const countries = await fetch(
          "https://api.dingconnect.com/api/V1/GetCountries",
          options
        );

        const data = await countries.json();
        return res.status(200).json({
          message: "Lista de países obtida com sucesso!",
          data,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar os países:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  //   Get name operators
  GetProviders: async (req, res) => {
    try {
      const { countryIso } = req.query;
      const options = {
        method: "GET",
        headers: {
          api_key: process.env.APIKEY,
        },
      };

      const operators = await fetch(
        `https://api.dingconnect.com/api/V1/GetProducts?countryIsos=${countryIso}`,
        options
      );

      const data = await operators.json();
      const itens = data.Items.map((item) => ({
        ProviderCode: item.ProviderCode,
        SkuCode: item.SkuCode,
        ReceiveCurrencyIso: item.Maximum.ReceiveCurrencyIso,
        SendCurrencyIso: item.Maximum.SendCurrencyIso,
        MinValue: item.Minimum.SendValue,
        MinValueCresCente: controlPrices(item.Minimum.SendValue),
        MaxValue: item.Maximum.SendValue,
      }));

      return res.status(200).json({
        message: "Lista de operadores obtida com sucesso!",
        itens,
      });
    } catch (error) {
      console.error("Erro ao buscar os operadores.", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  //   Get values
  getProducts: async (req, res) => {
    try {
      const { countryIso } = req.query;
      const options = {
        method: "GET",
        headers: {
          api_key: process.env.APIKEY,
        },
      };
      const providers = await fetch(
        `https://api.dingconnect.com/api/V1/GetProviders?countryIsos=${countryIso}`,
        options
      );
      const data = await providers.json();
      return res.status(200).json({
        message: "Lista de provedores obtida com sucesso!",
        data,
      });
    } catch (error) {
      console.error("Erro ao buscar os operadores");
    }
  },

  estimatePrices: async (req, res) => {
    try {
      const { SendValue, SendCurrencyIso, SkuCode } = req.body;
      if (!SendCurrencyIso || !SkuCode) {
        return res.status(400).json({ message: "Dados inválidos." });
      }

      const data = await getEstimateValue(SendValue, SendCurrencyIso, SkuCode);
      return res.status(200).json({
        message: "Valor a receber obtido com sucesso!",
        data,
      });
    } catch (error) {
      console.error("Erro ao buscar os operadores");
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  // Cria um recarga
  createTopup: async (req, res) => {
    try {
      const DistributorRef = Math.random().toString(36).substring(7);
      const {
        Country,
        OperatorName,
        SkuCode,
        SendValue,
        SendCurrencyIso,
        ReceiveCurrencyIso,
        AccountNumber,
        TransactionType,
        ValidateOnly
      } = req.body;

      if (!Country || !OperatorName || !SkuCode || !SendValue || !SendCurrencyIso || !ReceiveCurrencyIso || !AccountNumber || !TransactionType || !ValidateOnly) {
        return res.status(400).json({ message: "Dados inválidos." });
      }
      const options = {
        method: "POST",
        headers: {
          api_key: process.env.APIKEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SkuCode,
          SendValue,
          SendCurrencyIso,
          AccountNumber,
          DistributorRef,
          ValidateOnly,
        }),
      };

      const estimate = await getEstimateValue(
        SendValue,
        SendCurrencyIso,
        SkuCode
      );
      const AmountReceived = estimate.Items[0].Price.ReceiveValue;
      const saveTopupInterne = await topupModel.createTopup({
        Country,
        OperatorName,
        SkuCode,
        AmountSended: SendValue,
        AmountReceived,
        AccountNumber,
        StatusTopup: "pending",
        CreatedAt: new Date(),
        BatchItemRef: DistributorRef,
        RefUser: req.user.id,
        SendCurrencyIso: req.user.currencyIso,
        ReceiveCurrencyIso,
      });
      console.log(saveTopupInterne);
      const topup = await fetch(
        "https://api.dingconnect.com/api/V1/SendTransfer",
        options
      );
      const data = await topup.json();
      return res.status(200).json({
        message: "Recarga criada com sucesso!",
        data,
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};

module.exports = controlTopups;
