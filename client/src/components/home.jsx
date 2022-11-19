import React, { useState, useContext, createContext } from "react";
import { useEffect } from "react";
import Left from "./left";
import Messages from "./messages";

export const Context = createContext();

const Home = () => {
  const [messagePerson, setMessagePerson] = useState();
  const [profile, setProfile] = useState();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {}, []);

  const value = {
    messagePerson,
    setMessagePerson,
    profile,
    setProfile,
    rooms,
    setRooms,
  };
  return (
    <div className="home">
      <Context.Provider value={value}>
        <Left />
        {messagePerson ? (
          <Messages />
        ) : (
          <div className="plc">
            <p>Send messages to a friend or search.</p>
          </div>
        )}
      </Context.Provider>
      {/* <div
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          width: "200px",
          height: "100px",
          background: "orange",
        }}
        className="test"
      >
        <button
          onClick={() => {
            socket.emit("message", {
              to: document.getElementById("test1").value,
              data: {
                message: document.getElementById("test2").value,
              },
            });
          }}
        >
          HEY
        </button>
        <input type="text" id="test1" />
        <input type="text" id="test2" />
      </div> */}
    </div>
  );
};

export default Home;
