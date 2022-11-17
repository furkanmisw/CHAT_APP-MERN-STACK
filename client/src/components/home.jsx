import React, { useState, useContext, createContext } from "react";
import Left from "./left";
import Messages from "./messages";

export const Context = createContext();

const Home = () => {
  const [messagePerson, setMessagePerson] = useState();
  const [profile, setProfile] = useState();

  const value = {
    messagePerson,
    setMessagePerson,
    profile,
    setProfile,
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
    </div>
  );
};

export default Home;
