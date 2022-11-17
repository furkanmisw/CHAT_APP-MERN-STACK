import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import Room from "./room";
import { Context } from "./home";

const Rooms = () => {
  const { messagePerson } = useContext(Context);
  const [hasMore, setHasMore] = useState(true);
  const [rooms, setRooms] = useState([]);

  const _getRooms = (skip) =>
    //* @api/rooms/
    api(`/rooms?skip=${skip}`).then((res) => {
      if (res.status === 200) {
        setRooms((_) => [..._, ...res.data]);
        setHasMore(res.data.length === 15);
      }
    });

  useEffect(() => {
    _getRooms(0);
  }, []);

  const onScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (hasMore && scrollTop + clientHeight === scrollHeight)
      _getRooms(rooms.length);
  };

  return (
    <div className="rooms">
      <h1>Messages</h1>
      <ul onScroll={onScroll}>
        {rooms.map((room) => {
          const active = messagePerson?.room?._id === room._id;
          return <Room {...{ active, room }} key={room._id} />;
        })}
      </ul>
    </div>
  );
};

export default Rooms;
