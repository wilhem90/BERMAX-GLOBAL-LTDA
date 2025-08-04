require("dotenv").config();
const express = require("express");
const routerCentral = require("./routerCentral.js");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Configuração de middlewares
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", // Melhor controle de CORS
    optionsSuccessStatus: 200, // Para navegadores mais antigos
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Roteamento principal
app.use("/api", routerCentral);

// Middleware para tratamento de erros 404
app.use((_, res) => {
  res.status(404).json({ error: "Endpoint não encontrado" });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
