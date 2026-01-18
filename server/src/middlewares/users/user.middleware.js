const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const modelUser = require("../../models/users/user.model");

const middlewareUser = {
  //Criar token
  createToken: async (req, res) => {
    try {
      const { email, password, expiresIn, device_id } = req.body;

      // 1. Validação de entrada
      if (!device_id || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Dados insuficientes para login.",
        });
      }

      // 2. Busca o usuário
      const user = await modelUser.getDataByEmailOrDocId(req.body);

      // Verifica se o usuário existe antes de comparar o bcrypt
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciais incorretas.",
        });
      }

      // 3. Verifica a senha
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Credenciais incorretas.",
        });
      }

      // 4. Geração do Token
      const SECRET_KEY = process.env.SECRET_KEY;
      const payload = {
        uid: user.uid,
        device_id: device_id,
      };
      const options = { expiresIn: expiresIn || "1h" };

      const token = jwt.sign(payload, SECRET_KEY, options);

      // 5. Lógica de dispositivo (opcional: salvar log de acesso)
      await modelUser.getDevice(user.uid, device_id);

      return res.status(200).json({
        success: true,
        message: "Token criado com sucesso.",
        token,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor.",
      });
    }
  },

  verifyToken: async (req, res, next) => {
    // O token geralmente é enviado no Header 'Authorization'
    const authHeader = req.headers["authorization"];
    const { device_id } = req.headers;

    // Formato esperado: "Bearer <TOKEN>"
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    const TokenOrDevice = !token ? "Token" : !device_id ? "Device_id" : "";

    if (!token || !device_id) {
      return res.status(401).json({
        success: false,
        message: `Acesso negado. ${TokenOrDevice} não fornecido.`,
      });
    }

    try {
      const SECRET_KEY = process.env.SECRET_KEY;

      // Verifica a assinatura e a expiração (expiresIn)
      const decoded = jwt.verify(token, SECRET_KEY);

      // Adiciona os dados do payload (uid, device_id) ao objeto req
      req.user = await modelUser.getDataByUid(decoded.uid);

      next(); // Autorizado: segue para a próxima função/rota
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Token inválido ou expirado.",
      });
    }
  },

  checkDevice: async (device_id) => {
    const statusDevice = await modelUser.getUser();
    return statusDevice;
  },
};

module.exports = middlewareUser;
