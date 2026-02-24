/**
 * 📖 BÀI 7: useCallback - Cache Hàm Callback
 * useCallback "ghi nhớ" hàm callback, tránh tạo hàm mới mỗi render.
 * Kết hợp với React.memo để tránh re-render con thừa.
 * Cú pháp: const fn = useCallback(() => { ... }, [deps]);
 */
import React, { useState, useCallback, memo, useRef } from "react";
import LessonLayout from "../LessonLayout";

// Component con được bọc React.memo
// React.memo: chỉ re-render nếu props thực sự thay đổi (shallow compare)
const ChildButton = memo(({ onClick, label }) => {
  // Dùng ref để đếm số lần render (không gây re-render)
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div style={{
      padding: 12, borderRadius: 8, 
      border: "1px solid var(--edu-border)",
      background: "rgba(99,102,241,0.05)",
    }}>
      <button className="edu-btn edu-btn-primary" onClick={onClick}>{label}</button>
      <div className="edu-render-count edu-mt-8">
        🔄 Child render: {renderCount.current} lần
      </div>
    </div>
  );
});

// Component con thứ 2 để so sánh
const ExpensiveList = memo(({ onItemClick }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const items = ["React", "Vue", "Angular", "Svelte", "Next.js"];

  return (
    <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--edu-border)" }}>
      <div className="edu-render-count edu-mb-8">
        🔄 ExpensiveList render: {renderCount.current} lần
      </div>
      {items.map(item => (
        <button key={item} className="edu-btn edu-btn-secondary"
          style={{ margin: 4, fontSize: "0.8rem" }}
          onClick={() => onItemClick(item)}>
          {item}
        </button>
      ))}
    </div>
  );
});

const UseCallbackLesson = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState("");
  const [useCallbackOn, setUseCallbackOn] = useState(true);

  // ✅ CÓ useCallback: hàm giữ nguyên reference giữa các render
  const memoizedIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // deps rỗng → hàm không bao giờ thay đổi

  // ❌ KHÔNG useCallback: hàm mới tạo mỗi render
  const normalIncrement = () => setCount(prev => prev + 1);

  // Chọn hàm nào truyền xuống child
  const handleIncrement = useCallbackOn ? memoizedIncrement : normalIncrement;

  // useCallback cho list handler
  const memoizedItemClick = useCallback((item) => {
    setSelected(item);
  }, []);

  const normalItemClick = (item) => setSelected(item);
  const handleItemClick = useCallbackOn ? memoizedItemClick : normalItemClick;

  return (
    <LessonLayout lessonNumber="07" title="useCallback - Cache hàm Callback"
      description="useCallback giữ nguyên reference của hàm giữa các render. Kết hợp với React.memo giúp child component không re-render thừa khi parent re-render.">
      
      <h3 className="edu-section-title">📝 Tại sao cần useCallback?</h3>
      <div className="edu-code-block">
        <div className="edu-code-header"><span>Vấn đề & Giải pháp</span></div>
        <div className="edu-code-content">
{`// ❌ Vấn đề: hàm tạo mới mỗi render
const Parent = () => {
  const handleClick = () => { ... };
  // handleClick lần 1 !== handleClick lần 2 (khác reference)
  return <Child onClick={handleClick} />;
  // → Child luôn re-render dù dùng React.memo!
};

// ✅ Giải pháp: useCallback giữ reference ổn định
const Parent = () => {
  const handleClick = useCallback(() => { ... }, []);
  // handleClick lần 1 === handleClick lần 2 (cùng reference)
  return <Child onClick={handleClick} />;
  // → Child KHÔNG re-render thừa!
};`}
        </div>
      </div>

      <h3 className="edu-section-title">🧪 Demo: So sánh có/không useCallback</h3>
      <p className="edu-text">
        Bật/tắt useCallback và gõ text (gây parent re-render). Quan sát số lần render của Child:
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 useCallback + React.memo</div>
        
        <div className="edu-flex edu-items-center edu-gap-12 edu-mb-16">
          <div className={`edu-toggle ${useCallbackOn ? "active" : ""}`}
            onClick={() => setUseCallbackOn(p => !p)} />
          <span>{useCallbackOn ? "✅ useCallback ON" : "❌ useCallback OFF"}</span>
          <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>Count: {count}</span>
        </div>

        <input className="edu-input edu-mb-16" value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Gõ text để gây parent re-render..."
          style={{ width: "100%" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <ChildButton onClick={handleIncrement} label="➕ Tăng Count" />
          <ExpensiveList onItemClick={handleItemClick} />
        </div>

        {selected && (
          <div className="edu-mt-8" style={{ color: "#34d399" }}>
            Đã chọn: <strong>{selected}</strong>
          </div>
        )}
      </div>

      <div className="edu-info">
        <strong>💡 Quan sát:</strong><br/>
        • <strong>useCallback ON:</strong> Gõ text → Parent re-render, nhưng Child giữ nguyên (render count không tăng).<br/>
        • <strong>useCallback OFF:</strong> Gõ text → Parent re-render → hàm mới → Child nhận props mới → Child cũng re-render!
      </div>

      <h3 className="edu-section-title">⚖️ useMemo vs useCallback</h3>
      <table className="edu-table">
        <thead><tr><th>Tiêu chí</th><th>useMemo</th><th>useCallback</th></tr></thead>
        <tbody>
          <tr><td>Cache cái gì?</td><td>Kết quả (giá trị)</td><td>Hàm (function)</td></tr>
          <tr>
            <td>Cú pháp</td>
            <td><span className="edu-inline-code">useMemo(() =&gt; val, deps)</span></td>
            <td><span className="edu-inline-code">useCallback(fn, deps)</span></td>
          </tr>
          <tr><td>Khi nào dùng?</td><td>Phép tính nặng</td><td>Hàm truyền vào memo child</td></tr>
          <tr><td>Tương đương</td><td colSpan="2">
            <span className="edu-inline-code">useCallback(fn, deps)</span> === <span className="edu-inline-code">useMemo(() =&gt; fn, deps)</span>
          </td></tr>
        </tbody>
      </table>

      <div className="edu-tip">
        <strong>💡 Mẹo:</strong> useCallback PHẢI đi đôi với React.memo ở component con. 
        Nếu child KHÔNG dùng memo, useCallback vô nghĩa vì child vẫn re-render (do parent re-render).
      </div>
    </LessonLayout>
  );
};

export default UseCallbackLesson;
