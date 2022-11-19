import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

function Test() {
  return (
    <div>
      <h1>Test</h1>
      <button onClick={() => {}}>Send</button>
    </div>
  );
}
