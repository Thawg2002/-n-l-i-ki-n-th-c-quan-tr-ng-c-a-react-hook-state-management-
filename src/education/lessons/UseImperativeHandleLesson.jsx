/**
 * 📖 BÀI 9: useImperativeHandle - Expose API từ Child
 * Cho phép parent gọi các method cụ thể của child component.
 * Dùng kết hợp với forwardRef.
 */
import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import LessonLayout from "../LessonLayout";

// Component con: Custom Input với API tùy chỉnh
// forwardRef: cho phép parent truyền ref vào component con
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const [history, setHistory] = useState([]);

  // useImperativeHandle: thay vì expose toàn bộ DOM node,
  // chỉ expose các method mà parent CẦN
  useImperativeHandle(ref, () => ({
    // Method 1: Focus vào input
    focus: () => {
      inputRef.current?.focus();
    },
    // Method 2: Clear input
    clear: () => {
      if (inputRef.current) inputRef.current.value = "";
    },
    // Method 3: Lấy giá trị hiện tại
    getValue: () => inputRef.current?.value || "",
    // Method 4: Set giá trị
    setValue: (val) => {
      if (inputRef.current) inputRef.current.value = val;
    },
    // Method 5: Lấy lịch sử
    getHistory: () => history,
  }), [history]); // ← deps: cập nhật khi history thay đổi

  return (
    <div style={{ padding: 16, border: "1px solid var(--edu-border)", borderRadius: 8 }}>
      <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{props.label || "Custom Input"}</label>
      <input ref={inputRef} className="edu-input" placeholder={props.placeholder || "Nhập..."}
        style={{ width: "100%", marginTop: 4 }}
        onChange={(e) => setHistory(prev => [...prev.slice(-4), e.target.value])} />
    </div>
  );
});

const UseImperativeHandleLesson = () => {
  // Parent tạo ref và truyền vào child
  const fancyInputRef = useRef(null);
  const [result, setResult] = useState("");

  return (
    <LessonLayout lessonNumber="09" title="useImperativeHandle - Expose API từ Child"
      description="useImperativeHandle cho phép child component chỉ expose những method cần thiết cho parent, thay vì toàn bộ DOM node. An toàn và gọn gàng hơn.">
      
      <h3 className="edu-section-title">📝 Cú pháp</h3>
      <div className="edu-code-block">
        <div className="edu-code-header"><span>forwardRef + useImperativeHandle</span></div>
        <div className="edu-code-content">
{`// Child: expose API tùy chỉnh
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ""; },
    getValue: () => inputRef.current.value,
  }));
  
  return <input ref={inputRef} />;
});

// Parent: gọi method qua ref
const parent = () => {
  const ref = useRef(null);
  ref.current.focus();           // ← Gọi method của child
  console.log(ref.current.getValue()); // ← Đọc value
};`}
        </div>
      </div>

      <h3 className="edu-section-title">🎯 Demo: Custom Input Controls</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Parent điều khiển Child qua ref</div>
        <FancyInput ref={fancyInputRef} label="✨ Fancy Input (child component)" placeholder="Gõ gì đó..." />
        
        <div className="edu-flex edu-flex-wrap edu-gap-8 edu-mt-16">
          <button className="edu-btn edu-btn-primary"
            onClick={() => fancyInputRef.current?.focus()}>🎯 Focus</button>
          <button className="edu-btn edu-btn-danger"
            onClick={() => fancyInputRef.current?.clear()}>🧹 Clear</button>
          <button className="edu-btn edu-btn-success"
            onClick={() => fancyInputRef.current?.setValue("Hello React! 🚀")}>📝 Set Value</button>
          <button className="edu-btn edu-btn-secondary"
            onClick={() => setResult(fancyInputRef.current?.getValue() || "(trống)")}>📖 Get Value</button>
          <button className="edu-btn edu-btn-secondary"
            onClick={() => setResult(JSON.stringify(fancyInputRef.current?.getHistory()))}>📜 Xem History</button>
        </div>

        {result && (
          <div className="edu-mt-8" style={{ padding: 10, background: "rgba(16,185,129,0.08)", borderRadius: 8, fontSize: "0.88rem" }}>
            Kết quả: <strong style={{ color: "#34d399" }}>{result}</strong>
          </div>
        )}
      </div>

      <div className="edu-info">
        <strong>💡 Tại sao không expose toàn bộ DOM?</strong><br/>
        Nếu parent nhận được toàn bộ DOM node, nó có thể gọi bất cứ thứ gì 
        (removeChild, innerHTML...) → <strong>nguy hiểm</strong>! 
        useImperativeHandle giống như tạo "API riêng" — chỉ expose những gì child cho phép.
      </div>

      <div className="edu-tip">
        <strong>💡 Mẹo:</strong> Hook này ít khi dùng trong code thường. Chủ yếu dùng khi xây dựng 
        component library hoặc cần điều khiển child phức tạp (video player, form wizard...).
      </div>
    </LessonLayout>
  );
};

export default UseImperativeHandleLesson;
