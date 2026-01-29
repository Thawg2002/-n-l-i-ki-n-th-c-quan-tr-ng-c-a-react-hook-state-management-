import React, { useState, useMemo } from "react";

const UseMemoDemo = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // useMemo giúp tính toán giá trị nặng chỉ khi count thay đổi
  const expensiveValue = useMemo(() => {
    let total = 0;
    for (let i = 0; i < 100000000; i++) {
      total += i;
    }
    return total + count;
  }, [count]);

  return (
    <div style={{ border: '1px solid #9c27b0', padding: 16, marginBottom: 16 }}>
      <h3>useMemo Demo</h3>
      <div>Expensive value: {expensiveValue}</div>
      <button onClick={() => setCount(c => c + 1)}>Tăng count</button>
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

export default UseMemoDemo;
