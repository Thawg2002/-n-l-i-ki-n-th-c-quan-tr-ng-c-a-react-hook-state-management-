import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";

const LoginForm = () => {
  const { login, isLoggedIn } = useContext(UserContext);
  const [name, setName] = useState("");
  if (isLoggedIn) return null;
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        login(name);
      }}
      style={{ marginBottom: 16 }}
    >
      <input
        type="text"
        placeholder="Nhập tên..."
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <button type="submit">Đăng nhập</button>
    </form>
  );
};

export default LoginForm;
