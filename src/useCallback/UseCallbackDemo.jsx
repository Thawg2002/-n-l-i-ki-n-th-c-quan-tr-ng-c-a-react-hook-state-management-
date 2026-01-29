import React, { useState, useCallback } from "react";
import Child from "./Child";

// Demo: giải thích từng bước về useCallback
const UseCallbackDemo = () => {
  // 1) local state: `count` và `text`
  // - `count` thay đổi khi người dùng bấm nút
  // - `text` thay đổi khi người dùng gõ input (để minh họa re-render khác nhau)
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  // 5) Cho mục đích demo: cho phép bật/tắt useCallback để so sánh
  const [useMemoized, setUseMemoized] = useState(true);

  // 2) useCallback tạo một hàm có "identity" ổn định giữa các render
  // Cú pháp: useCallback(fn, deps)
  // - Nếu `deps` không đổi giữa các render, React sẽ trả về cùng 1 instance của `fn`.
  // - Nếu `deps` thay đổi, React sẽ tạo hàm mới.
  // Tại sao cần ổn định? Khi truyền `handleClick` xuống component con đã memo,
  // hàm mới sẽ khiến child re-render. Dùng useCallback giúp tránh re-render thừa.
  // memoized version (hook) — luôn tạo để tránh gọi hook có điều kiện
  const memoizedInc = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  // non-memoized version (tạo mới mỗi render)
  const nonMemoizedInc = () => setCount(c => c + 1);

  // Chọn hàm truyền xuống child: memoized hoặc non-memoized
  const handleClick = useMemoized ? memoizedInc : nonMemoizedInc;

  // 4) Render: thay đổi `text` sẽ gây re-render component cha.
  // Thêm console.log để quan sát khi parent render
  console.log("UseCallbackDemo render (useCallback=", useMemoized, ")");
  // Nếu truyền `handleClick` xuống child memoized, child sẽ không re-render
  // khi `text` thay đổi vì `handleClick` giữ identity ổn định.
  return (
    <div style={{ border: '1px solid #e91e63', padding: 16, marginBottom: 16 }}>
      <h3>useCallback Demo</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div>Count: {count}</div>
          <label style={{ marginLeft: 8 }}>
            <input
              type="checkbox"
              checked={useMemoized}
              onChange={e => setUseMemoized(e.target.checked)}
            />{' '}
            useCallback ON
          </label>
        </div>
        {/* Child là memoized component: nếu `handleClick` giữ identity ổn định,
            Child sẽ không re-render khi `text` thay đổi. */}
        <Child onInc={handleClick} />
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Nhập gì đó..."
        style={{ marginLeft: 8 }}
      />
      {/* Ghi chú: console.log có thể giúp quan sát render */}
    </div>
  );
};

export default UseCallbackDemo;
