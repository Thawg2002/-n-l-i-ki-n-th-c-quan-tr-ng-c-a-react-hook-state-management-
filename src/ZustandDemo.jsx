import React, { useState } from 'react';
import { useUserStore } from './zustandStore';

const ZustandDemo = () => {
  const { user, login, logout, updateName } = useUserStore();
  const [newName, setNewName] = useState('');

  return (
    <div style={{ border: '1px solid #4caf50', padding: 16, marginBottom: 16 }}>
      <h3>Zustand Demo</h3>
      {!user ? (
        <form onSubmit={e => { e.preventDefault(); login(newName); setNewName(''); }}>
          <input
            type="text"
            placeholder="Nhập tên..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <>
          <div>Hello, {user.name}</div>
          <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
          <form
            onSubmit={e => { e.preventDefault(); updateName(newName); setNewName(''); }}
            style={{ display: 'inline-block', marginLeft: 8 }}
          >
            <input
              type="text"
              placeholder="Đổi tên..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
            <button type="submit">Change Name</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ZustandDemo;
