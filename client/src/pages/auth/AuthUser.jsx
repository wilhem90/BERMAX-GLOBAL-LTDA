import "./AuthUser.css";
import { useState } from "react";

export default function AuthUser() {
  const [inputValue, setInputValue] = useState({
    inputEmailLogin: "",
    inputPasswordLogin: "",
    inputEmailSignup: "",
    selectCountry: "",
    inputBussnessName: "",
  });
  document.title = "Auth"

  const [showSignupForm, setShowSignupForm] = useState(true);

  function handleChange(e) {
    setInputValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function showSignup() {
    setShowSignupForm((prev) => !prev);
  }

  function handleFormLogin(e) {
    e.preventDefault();
    const emailUser = inputValue.inputEmailLogin;
    const passwordUser = inputValue.inputPasswordLogin;
    console.log(emailUser, passwordUser);
  }

  function handleFormSignup() {}
  console.log(showSignupForm);

  return (
    <div className="auth-user">
      {showSignupForm ? (
        //Form login
        <form className="form-login" method="POST" onSubmit={handleFormLogin}>
          <p className="title-form">Autenticação</p>
          <div className="box">
            <label htmlFor="inputEmailLogin">E-mail</label>
            <input
              type="email"
              name="inputEmailLogin"
              id="inputEmailLogin"
              placeholder="E-mail"
              value={inputValue.inputEmailLogin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="box">
            <label htmlFor="inputPaswordLogin">Digite sua senha</label>
            <input
              type="password"
              name="inputPasswordLogin"
              id="inputPasswordLogin"
              placeholder="Digite sua senha"
              value={inputValue.inputPasswordLogin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="box-change">
            <p id="forget-password">Esqueci senha?</p>
            <p id="have-account" onClick={showSignup}>
              Criar conta
            </p>
          </div>
          <button type="submit">Entrar</button>
        </form>
      ) : (
        //Form signup
        <form className="form-signup" method="POST" onSubmit={handleFormSignup}>
          <p className="title-form">Criar conta</p>
          <div className="box">
            <label htmlFor="inputBussnessName">Nome da empresa</label>
            <input
              type="text"
              name="inputBussnessName"
              id="inputBussnessName"
              placeholder="Nome da empresa"
              value={inputValue.inputBussnessName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="box">
            <label htmlFor="inputEmailSignup">Informar um email</label>
            <input
              type="email"
              name="inputEmailSignup"
              id="inputEmailSignup"
              placeholder="Informar um email"
              value={inputValue.inputEmailSignup}
              onChange={handleChange}
              required
            />
          </div>

          <div className="box">
            <select
              name="selectCountry"
              id="selectCountry"
              onChange={handleChange}
              value={inputValue.selectCountry}
              required
            >
              <option value="" disabled>
                Selecione pais
              </option>
              <option value="Brasil">Brasil</option>
              <option value="Chile">Chile</option>
              <option value="Mexico">Mexico</option>
            </select>
          </div>

          <div className="box-change">
            <p id="have-account" onClick={showSignup}>
              Já tenho uma conta!
            </p>
          </div>
          <button type="submit">Criar</button>
        </form>
      )}
    </div>
  );
}
