const middlewareUser = require("../../middlewares/users/user.middleware");

const controlStore = {
  //Criar store
  createStore: async (req, res) => {
    const { token } = req.headers;
    const checkSession = await middlewareUser.isLogged(token);
    console.log(checkSession);

    const { name, description, categories } = req.body;

    if (!name || !description || !categories) {
      res.status(400).json({
        success: false,
        message: "Deve enviar todos os dados continuar o cadastro da sua loja.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Opa vamos criar a nossa loja!",
    });
  },
};
module.exports = controlStore;
