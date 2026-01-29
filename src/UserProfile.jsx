import React, { useContext } from "react";
import { UserContext } from "./UserContext";

const UserProfile = () => {
  const { user, isLoggedIn, logout } = useContext(UserContext);
  if (!isLoggedIn) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <b>Xin chào, {user.name}!</b>
      <button style={{ marginLeft: 12 }} onClick={logout}>
        Đăng xuất
      </button>
    </div>
  );
};

export default UserProfile;
