import React, { useState, useContext } from "react";

import "./Auth.css";
import AuthContext from "../context/auth-context";

function AuthPage() {
  const context = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const onEmailChange = (e) => {
    const emailRecieved = e.target.value;
    console.log(emailRecieved);
    setEmail(emailRecieved);
  };

  const onPasswordChange = (e) => {
    const passwordRecieved = e.target.value;
    console.log(passwordRecieved);
    setPassword(passwordRecieved);
  };

  const toggleLogin = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(`El email es ${email}, y la contraseña es ${password}`);
    console.log(isLogin);

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `,
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          setPassword("");
          setEmail("");
          throw new Error("Algo falló!");
        }
        return res.json();
      })
      .then((data) => {
        setPassword("");
        setEmail("");
        console.log(data);

        if (data.data.login.token) {
          context.login(
            data.data.login.token,
            data.data.login.userId,
            data.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <form
        action=""
        className="auth-form"
        onSubmit={(event) => submitHandler(event)}
      >
        {isLogin ? <h3>Login</h3> : <h3>Sign up</h3>}
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => onEmailChange(e)}
            value={email}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => onPasswordChange(e)}
            value={password}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Enviar</button>
          <p onClick={toggleLogin}>
            {isLogin
              ? "No tengo usuario, quiero registrarme!"
              : "Ya estoy registrado, quiero loguearme"}
          </p>
        </div>
      </form>
    </>
  );
}

export default AuthPage;
