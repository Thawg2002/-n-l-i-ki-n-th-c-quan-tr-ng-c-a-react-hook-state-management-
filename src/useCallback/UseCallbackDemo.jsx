import React, { useState, useCallback } from "react";

const UseCallbackDemo = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div style={{ border: '1px solid #e91e63', padding: 16, marginBottom: 16 }}>
      <h3>useCallback Demo</h3>
      <div>Count: {count}</div>
      <button onClick={handleClick}>Tăng</button>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Nhập gì đó..."
        style={{ marginLeft: 8 }}
      />
    </div>
  );
};

export default UseCallbackDemo;
