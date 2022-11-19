import React, { useEffect, useContext, useState, useRef } from "react";
import api from "../api";
import { Context } from "./home";
import { io } from "socket.io-client";

export const DATE_CALC = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date(Date.now());
  const diff = now - d;
  const diffWeek = diff / (1000 * 60 * 60 * 24 * 7);
  if (diffWeek > 4) return d.toLocaleDateString();
  if (diffWeek > 1) return Math.floor(diffWeek) + "w ago";
  const diffDay = diff / (1000 * 60 * 60 * 24);
  if (diffDay > 1) return Math.floor(diffDay) + "d ago";
  const diffHour = diff / (1000 * 60 * 60);
  if (diffHour > 1) return Math.floor(diffHour) + "h ago";
  const diffMin = diff / (1000 * 60);
  if (diffMin > 1) return Math.floor(diffMin) + "m ago";
  return "now";
};

const Messages = () => {
  const [message, setMessage] = useState("");
  const socket = io();
  const listRef = useRef();
  const messageInputRef = useRef();

  const { messagePerson, setMessagePerson, profile, setRooms } =
    useContext(Context);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const _getMessages = () =>
    api("/messages/" + messagePerson.room._id).then((res) => {
      setMessages(res.data);
      setHasMore(res.data.length === 20);
      setTimeout(
        () => (listRef.current.scrollTop = listRef.current.scrollHeight),
        50
      );
    });

  useEffect(() => {
    socket.on("message", (data) => {
      setTimeout(() => {
        setMessages((pp) => [...pp]);
      }, 500);
      console.log("SOCKET");

      console.log("SOCKET_MESSAGE");
      setMessages((prev) => [
        ...prev,
        {
          message: data,
          sender: messagePerson?.user?._id,
          date: Date.now(),
        },
      ]);
      setRooms((prev) => [
        {
          ...messagePerson,
          room: {
            lastmessage: message,
            _id: messagePerson.room._id,
            updatedAt: Date.now(),
          },
        },
        ...prev.filter((room) => room.room._id !== messagePerson.room._id),
      ]);
      setTimeout(() => {
        listRef.current.scrollTop = listRef.current.scrollHeight;
        setMessages((prev) => [...prev]);
      }, 200);
    });

    if (messagePerson.room) {
      _getMessages();
    } else {
      setHasMore(false);
    }
    messageInputRef.current.focus();
  }, []); 

  const _send = (e) => {
    e.preventDefault();
    setMessage("");
    setMessages((p) => [...p, { message, date: Date.now() }]);
    setTimeout(
      () => (listRef.current.scrollTop = listRef.current.scrollHeight),
      1
    );
    if (messagePerson.room) {
      socket.emit("message", { to: messagePerson.user._id, message });
      setRooms((prev) => [
        {
          ...messagePerson,
          room: {
            lastmessage: message,
            _id: messagePerson.room._id,
            updatedAt: Date.now(),
          },
        },
        ...prev.filter((room) => room.room._id !== messagePerson.room._id),
      ]);
      const obj = {
        message,
        room: messagePerson?.room?._id,
      };
      api("/messages", "POST", obj).then((res) => {
        if (res.status === 200) {
        }
        if (res.status !== 200) {
          console.log(res);
          setMessage(message);
          setMessages((p) => p.slice(0, p.length - 1));
        }
      });
    } else {
      const obj = {
        message,
        date: Date.now(),
        receiver: messagePerson.user._id,
      };
      api("/messages", "POST", obj).then((res) => {
        if (res.status === 201) {
          setRooms((prev) => [
            {
              room: { _id: res.data.roomid, lastmessage: message },
              user: messagePerson.user,
              updatedAt: Date.now(),
            },
            ...prev,
          ]);
          setMessagePerson((prev) => ({
            ...prev,
            room: { _id: res.data.roomid },
          }));
          socket.emit("message", { to: messagePerson.user._id, message });
        } else {
          console.log(res);
          setMessage(message);
          setMessages((p) => p.slice(0, p.length - 1));
        }
      });
    }
  };

  const onScroll = () => {
    const nowH = listRef.current.scrollHeight;
    const top = listRef.current.scrollTop;
    if (listRef.current.scrollTop === 0 && hasMore) {
      api(`/messages/${messagePerson.room._id}?skip=${messages.length}`).then(
        (res) => {
          setMessages((p) => [...res.data, ...p]);
          setHasMore(res.data.length === 20);
          setTimeout(() => {
            const diff = listRef.current.scrollHeight - nowH;
            listRef.current.scrollTop = top + diff;
          }, 1);
        }
      );
    }
  };

  return (
    <div className="messages">
      <div className="header">
        <div className="content">
          <div className="l">
            <img src={messagePerson?.user?.pp || "/pp.jpg"} alt="pp" />
            <p>{messagePerson?.user?.username}</p>
          </div>
          <button onClick={() => setMessagePerson()}>
            <img src="/icons/close.svg" alt="close-icon" />
          </button>
        </div>
      </div>
      <ul className="body" ref={listRef} onScroll={onScroll}>
        {messages.map((m) => {
          const left = m.sender === messagePerson.user._id;
          const pp = left
            ? messagePerson.user.pp || "/pp.jpg"
            : profile.pp || "/pp.jpg";
          const { message, date } = m;

          return (
            <li className={left ? "" : "my"}>
              <img src={pp} alt="pp" />
              <div className="msg">
                <p>{message}</p>
                <div>{DATE_CALC(date)}</div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="send">
        <form onSubmit={_send}>
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            required
            maxLength={250}
            ref={messageInputRef}
          />
          <button type="submit">
            <img src="/icons/send.svg" alt="send-icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
