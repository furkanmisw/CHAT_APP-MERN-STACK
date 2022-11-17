import React, { useEffect, useContext } from "react";
import { Context } from "./home";

const Messages = () => {
  const { messagePerson } = useContext(Context);

  useEffect(() => {}, [messagePerson]);

  return <div className="messages"></div>;
};

export default Messages;
