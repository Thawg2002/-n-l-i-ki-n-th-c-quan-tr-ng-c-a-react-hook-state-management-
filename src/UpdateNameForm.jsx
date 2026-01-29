import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";

const UpdateNameForm = () => {
  const { user, isLoggedIn, updateName } = useContext(UserContext);
  const [newName, setNewName] = useState("");
  if (!isLoggedIn) return null;
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        updateName(newName);
        setNewName("");
      }}
      style={{ marginBottom: 16 }}
    >
      <input
        type="text"
        placeholder="Đổi tên..."
        value={newName}
        onChange={e => setNewName(e.target.value)}
        required
      />
      <button type="submit">Cập nhật tên</button>
    </form>
  );
};

export default UpdateNameForm;
