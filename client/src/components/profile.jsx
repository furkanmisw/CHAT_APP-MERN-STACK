import React, { useContext, useEffect, useState } from "react";
import { Context } from "./home";
import api from "../api";
import Settings from "./settings";

const Profile = () => {
  const { setProfile, profile } = useContext(Context);
  const [settings, setSettings] = useState(false);
  const _getProfile = () =>
    //* @api/profile/
    api("/profile").then((res) => res.status === 200 && setProfile(res.data));


  useEffect(() => {
    _getProfile(setProfile);
  }, []);

  return (
    <div className="profile">
      <div className="data">
        <img src={profile?.pp || "/pp.jpg"} alt="pp" />
        <p>{profile?.username}</p>
      </div>
      <div className="buttons">
        <button
          onClick={() => setSettings(true)}
          style={{
            transform: settings ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <img src="/icons/settings.svg" alt="settings-icons" />
        </button>
        <button onClick={_logout}>
          <img src="/icons/logout.svg" alt="logut-icon" />
        </button>
      </div>
      <Settings {...{ settings, setSettings }} />
    </div>
  );
};

export default Profile;

const _logout = () => api("/auth/logout", "POST");
