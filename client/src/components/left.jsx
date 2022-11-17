import React from "react";
import Profile from "./profile";
import Search from "./search";
import Rooms from "./rooms";

const Left = () => {
  return (
    <div className="left">
      <Profile />
      <Search />
      <Rooms />
    </div>
  );
};

export default Left;
