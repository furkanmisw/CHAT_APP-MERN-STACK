import React from "react";
import { DATE_CALC } from "./messages";

const Room = ({ room, active, tap }) => {
  return (
    <li className={active ? "room active" : "room"} onClick={tap}>
      <img src={room.user.pp || "/pp.jpg"} alt="pp" />
      <div className="text">
        <p>{room.user.username}</p>
        <p className="last">{room.room.lastmessage}</p>
        <div className="date">{DATE_CALC(room.room.updatedAt)}</div>
      </div>
    </li>
  );
};

export default Room;
