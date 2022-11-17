import React, { useContext, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import api from "../api";
import { Context } from "./home";

const Search = () => {
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const inputRef = useRef();
  const { setMessagePerson, messagePerson } = useContext(Context);

  const _searchUsername = () =>
    //* @api/search/:username
    {
      if (messagePerson?.user.username === username) return setUsername("");
      api("/profile/" + username, "GET").then((res) => {
        if (res.status === 200) {
          setUsername("");
          setMessagePerson();
          setTimeout(() => setMessagePerson(res.data), 0);
        } else {
          setError(true);
          setTimeout(() => setError(false), 10000);
        }
      });
    };

  const onSubmit = (e) => {
    e.preventDefault();
    _searchUsername();
  };

  useEffect(() => {
    if (username.length < 1) setError(false);
    if (error || username.length < 1) inputRef.current.focus();
  }, [username, error]);

  return (
    <div className={`search ${error && "error"}`}>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          id="username"
          required
          minLength={6}
          maxLength={36}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          value={username}
          placeholder={"Enter username"}
          ref={inputRef}
        />
        {username.length > 0 && (
          <img
            onClick={() => setUsername("")}
            src="/icons/close.svg"
            alt="close-icon"
            className="clear"
          />
        )}
        <button type={"submit"}>
          <img src="/icons/search.svg" alt="search-icon" />
        </button>
      </form>
    </div>
  );
};

export default Search;
