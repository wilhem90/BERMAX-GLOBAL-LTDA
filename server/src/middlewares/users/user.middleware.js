const middlewareUser = {
  //Criar token
  createToken: async (req, res) => {
    const { email, password, device_id } = req.body;
    const update_token = email && password;

    //1 Se recebemos o email e a senha vamos verificar para criar o token
    if (!update_token && !device_id) {
      console.log(update_token, device_id);
      return res.status(400).json({
        success: false,
        message: "Falha ao realizar login.",
      });
    }

    const isDeviceVerified = middlewareUser.checkDevice(device_id);
    console.log(isDeviceVerified);
    const token = "Slaodkofkosakofks";

    return res.status(200).json({
      success: true,
      token,
    });
  },

  //Verifica si usuario conectado
  isLogged: async (token) => {
    if (!token) {
      return false;
    }
    console.log(token);
    return true;
  },

  checkDevice: async (device_id) => {
    // const getStatusDevice = await
    return device_id;
  },
};

module.exports = middlewareUser;
