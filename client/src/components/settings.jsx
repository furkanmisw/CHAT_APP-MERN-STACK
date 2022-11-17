import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import api from "../api";
import { Context } from "./home";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = ({ settings, setSettings }) => {
  const setError = (message) => toast.error(message);
  const { profile, setProfile } = useContext(Context);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [opassword, setOpassword] = useState("");
  const [npassword, setNpassword] = useState("");
  const __uploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () =>
      api("/profile/pp", "POST", { pp: reader.result }).then((res) => {
        if (res.status === 200) setProfile({ ...profile, pp: reader.result });
      });
  };

  const _delete = () =>
    api("/profile/pp", "DELETE").then(
      (res) => res.status === 200 && setProfile({ ...profile, pp: null })
    );

  useEffect(() => {
    setUsername(profile?.username || "");
    setEmail(profile?.email || "");
    setOpassword("");
    setNpassword("");
  }, [profile, settings]);

  const _changeUsername = () =>
    api("/profile/username", "POST", { username }).then((res) => {
      if (res.status === 200) {
        setProfile({ ...profile, username });
        setSettings(false);
      } else setError(res.data.message);
    });

  const _changePassword = () =>
    api("/profile/password", "POST", { opassword, npassword }).then((res) => {
      if (res.status === 200) setSettings(false);
      else setError(res.data.message);
    });

  const _changeEmail = () =>
    api("/profile/email", "POST", { email }).then((res) => {
      if (res.status === 200) {
        setProfile({ ...profile, email });
        setSettings(false);
      } else setError(res.data.message);
    });

  return (
    <div className={settings ? "settings open" : "settings"}>
      <div className="settings-header">
        <h1>Settings</h1>
        <button onClick={() => setSettings(false)}>
          <img src="/icons/close.svg" alt="close-icon" />
        </button>
      </div>
      <div className="settings-pp">
        <div className="pp-box">
          <img src={profile?.pp || "/pp.jpg"} alt="pp-icon" />
          {profile?.pp && (
            <button className="bin" onClick={_delete}>
              <img src="/icons/bin.svg" alt="bin" />
            </button>
          )}

          <div className="add">
            <div className="ctx">
              <img src="/icons/add.svg" alt="add-icon" />
              <input
                type="file"
                name="pp"
                id="pp"
                accept={"image/png, image/jpeg, image/jpg"}
                className="add"
                onChange={__uploadImage}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="settings-form">
        <label htmlFor="username">Username</label>
        <div className="bx">
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {profile?.username !== username && (
            <img
              src="/icons/back.svg"
              alt="back-icon"
              onClick={() => setUsername(profile?.username)}
            />
          )}
          <button
            onClick={_changeUsername}
            disabled={profile?.username === username || username.length < 5}
          >
            <img src="/icons/done.svg" alt="done-icon" />
          </button>
        </div>
        <label htmlFor="email">Email</label>
        <div className="bx">
          <input
            type="text"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {profile?.email !== email && (
            <img
              src="/icons/back.svg"
              alt="back-icon"
              onClick={() => setEmail(profile?.email)}
            />
          )}
          <button
            disabled={profile?.email === email || email.length < 1}
            onClick={_changeEmail}
          >
            <img src="/icons/done.svg" alt="done-icon" />
          </button>
        </div>
        <label htmlFor="opassword">Old password</label>
        <div className="bx">
          <input
            type="password"
            placeholder="Old password"
            id="Old password"
            value={opassword}
            onChange={(e) => setOpassword(e.target.value)}
          />
        </div>
        <label htmlFor="npassword">New password</label>
        <div className="bx">
          <input
            type="password"
            placeholder="New password"
            id="npassword"
            value={npassword}
            onChange={(e) => setNpassword(e.target.value)}
          />
          {opassword.length > 5 && npassword.length > 5 && (
            <img
              src="/icons/back.svg"
              alt="back-icon"
              onClick={() => {
                setOpassword("");
                setNpassword("");
              }}
            />
          )}

          <button
            disabled={opassword.length < 6 || npassword.length < 6}
            onClick={_changePassword}
          >
            <img src="/icons/done.svg" alt="done-icon" />
          </button>
        </div>
      </div>
      <ToastContainer theme="dark" position="bottom-left" />
    </div>
  );
};

export default Settings;
