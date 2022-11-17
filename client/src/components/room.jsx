import React from "react";

const Room = ({ room, active }) => {
  return (
    <li className={active ? "room active" : "room"}>
      <img src="/pp.jpg" alt="pp" />
      <p>username</p>
    </li>
  );
};

export default Room;
