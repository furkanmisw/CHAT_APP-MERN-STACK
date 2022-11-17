import React, { useState } from "react";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [show, setShow] = useState(false);
  
  const setError = (message) =>
    toast.error(message, { position: "bottom-right" });

  const onSubmit = (e) => {
    e.preventDefault();
    const username = e.target.elements.username?.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    if (isLogin) _login(email, password);
    else _signup(username, email, password);
  };

  const _login = (email, password) =>
    api("/auth/login", "POST", { email, password }).then((r) =>
      r.status === 200 ? window.location.reload() : setError(r.data.message)
    );

  const _signup = (username, email, password) =>
    api("/auth/signup", "POST", { username, email, password }).then((r) =>
      r.status === 201 ? window.location.reload() : setError(r.data.message)
    );

  return (
    <div className="loginpage">
      <div className="container">
        <h1>{isLogin ? "Login" : "SignUp"}</h1>
        <form onSubmit={onSubmit}>
          {!isLogin && (
            <input
              type="text"
              id="username"
              required
              minLength={6}
              maxLength={36}
              placeholder="Username"
            />
          )}

          <input
            type="text"
            id="email"
            required
            placeholder={isLogin ? "Email or username" : "Email"}
          />
          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              id="password"
              required
              minLength={6}
              maxLength={300}
              placeholder="Password"
            />
            <img
              src={show ? "/icons/eye.svg" : "/icons/eyeopen.svg"}
              alt="eye-icon"
              onClick={() => setShow(!show)}
            />
          </div>
          <button type="submit">{isLogin ? "Login" : "SignUp"}</button>
        </form>
        <div className="change">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "SignUp" : "Login"}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
