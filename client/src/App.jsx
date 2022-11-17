import React from "react";
import Home from "./components/home";
import Login from "./components/login";

const App = () => {
  if (_isloggedin()) {
    return <Home />;
  } else {
    return <Login />;
  }
};

export default App;

const _isloggedin = () => document.cookie.includes("loggedin=true");
