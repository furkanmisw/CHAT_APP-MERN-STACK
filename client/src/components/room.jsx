import React from "react";

const Room = ({ room, active, tap }) => {
  return (
    <li className={active ? "room active" : "room"} onClick={tap}>
      <img src="/pp.jpg" alt="pp" />
      <p>username</p>
    </li>
  );
};

export default Room;
