import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, updateName } from './userSlice';

const ReduxDemo = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [newName, setNewName] = useState('');

  return (
    <div style={{ border: '1px solid #2196f3', padding: 16, marginBottom: 16 }}>
      <h3>Redux Demo</h3>
      {!user ? (
        <form onSubmit={e => { e.preventDefault(); dispatch(login(newName)); setNewName(''); }}>
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
          <button onClick={() => dispatch(logout())} style={{ marginLeft: 8 }}>Logout</button>
          <form
            onSubmit={e => { e.preventDefault(); dispatch(updateName(newName)); setNewName(''); }}
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

export default ReduxDemo;
