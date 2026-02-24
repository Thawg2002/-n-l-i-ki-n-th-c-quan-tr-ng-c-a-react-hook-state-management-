/**
 * 📖 BÀI 5: useRef - Tham Chiếu DOM & Giá Trị Persistent
 * useRef tạo "hộp" lưu giá trị, thay đổi KHÔNG re-render.
 * 2 công dụng: (1) truy cập DOM, (2) lưu giá trị persistent.
 */
import React, { useState, useRef, useEffect } from "react";
import LessonLayout from "../LessonLayout";

const UseRefLesson = () => {
  // DEMO 1: Focus Input - gán ref vào DOM element
  const inputRef = useRef(null);

  // DEMO 2: Đếm render - ref thay đổi không gây re-render
  const renderCountRef = useRef(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  renderCountRef.current += 1;

  // DEMO 3: Previous Value - lưu giá trị trước đó
  const [inputValue, setInputValue] = useState("Hello");
  const previousValueRef = useRef("");
  useEffect(() => { previousValueRef.current = inputValue; }, [inputValue]);

  // DEMO 4: Stopwatch - lưu intervalId trong ref
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startStopwatch = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => setStopwatchTime(p => p + 10), 10);
  };
  const stopStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };
  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setStopwatchTime(0);
  };
  const formatTime = (ms) => {
    const m = String(Math.floor(ms / 60000)).padStart(2, "0");
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const ms2 = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${m}:${s}.${ms2}`;
  };

  // DEMO 5: Uncontrolled Form
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const [formResult, setFormResult] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormResult({ name: nameRef.current.value, email: emailRef.current.value });
  };

  return (
    <LessonLayout lessonNumber="05" title="useRef - Tham chiếu DOM & Giá trị Persistent"
      description="useRef tạo 'hộp' lưu bất cứ thứ gì. Thay đổi ref.current KHÔNG re-render. Dùng để truy cập DOM hoặc lưu data không ảnh hưởng UI.">
      
      <h3 className="edu-section-title">📝 Cú pháp</h3>
      <div className="edu-code-block">
        <div className="edu-code-header"><span>useRef vs useState</span></div>
        <div className="edu-code-content">
{`// useRef: thay đổi KHÔNG re-render
const ref = useRef(0);
ref.current = 42;  // ← "im lặng"

// useState: thay đổi CÓ re-render
const [state, setState] = useState(0);
setState(42);       // ← trigger re-render

// Truy cập DOM
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();`}
        </div>
      </div>

      <h3 className="edu-section-title">🎯 Demo 1: Focus Input</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 DOM Access</div>
        <div className="edu-flex edu-items-center edu-gap-12">
          <input ref={inputRef} className="edu-input" placeholder="Click nút để focus..." style={{ flex: 1 }} />
          <button className="edu-btn edu-btn-primary" onClick={() => inputRef.current?.focus()}>🎯 Focus!</button>
        </div>
      </div>

      <h3 className="edu-section-title">🔢 Demo 2: Đếm Render</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Render Counter (ref, không phải state)</div>
        <div className="edu-render-count" style={{ fontSize: "1rem", padding: "8px 16px" }}>
          🔄 Đã render {renderCountRef.current} lần
        </div>
        <button className="edu-btn edu-btn-primary edu-mt-16" onClick={() => setForceUpdate(p => p + 1)}>
          Force Re-render
        </button>
      </div>
      <div className="edu-warning">
        <strong>⚠️ Nếu dùng useState đếm render:</strong> setState → re-render → setState → ∞ VÒNG LẶP! useRef thay đổi "im lặng" → an toàn.
      </div>

      <h3 className="edu-section-title">⏮️ Demo 3: Previous Value</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 So sánh giá trị cũ vs mới</div>
        <input className="edu-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} style={{ width: "100%", maxWidth: 400 }} />
        <div className="edu-mt-8 edu-flex edu-gap-16">
          <div>Hiện tại: <strong style={{ color: "#818cf8" }}>{inputValue}</strong></div>
          <div>Trước đó: <strong style={{ color: "#94a3b8" }}>{previousValueRef.current || "(chưa có)"}</strong></div>
        </div>
      </div>

      <h3 className="edu-section-title">⏱️ Demo 4: Stopwatch</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 intervalRef lưu ID — không cần re-render</div>
        <div style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: "'Fira Code', monospace", textAlign: "center", margin: "16px 0", color: "#818cf8" }}>
          {formatTime(stopwatchTime)}
        </div>
        <div className="edu-flex edu-justify-between">
          <button className={`edu-btn ${isRunning ? "edu-btn-danger" : "edu-btn-success"}`} onClick={isRunning ? stopStopwatch : startStopwatch}>
            {isRunning ? "⏸️ Dừng" : "▶️ Start"}
          </button>
          <button className="edu-btn edu-btn-secondary" onClick={resetStopwatch}>🔄 Reset</button>
        </div>
      </div>

      <h3 className="edu-section-title">📝 Demo 5: Uncontrolled Form</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Đọc DOM khi submit (không track mỗi keystroke)</div>
        <form onSubmit={handleSubmit} className="edu-flex edu-flex-col edu-gap-8">
          <input ref={nameRef} className="edu-input" placeholder="Họ tên..." />
          <input ref={emailRef} className="edu-input" placeholder="Email..." type="email" />
          <button className="edu-btn edu-btn-primary" type="submit">📤 Submit</button>
        </form>
        {formResult && (
          <div className="edu-mt-8" style={{ padding: 12, background: "rgba(16,185,129,0.08)", borderRadius: 8 }}>
            <div>👤 {formResult.name}</div>
            <div>📧 {formResult.email}</div>
          </div>
        )}
      </div>

      <h3 className="edu-section-title">📊 Tổng kết</h3>
      <table className="edu-table">
        <thead><tr><th>Use case</th><th>useRef</th><th>useState</th></tr></thead>
        <tbody>
          <tr><td>Truy cập DOM</td><td>✅</td><td>❌</td></tr>
          <tr><td>Lưu interval/timeout ID</td><td>✅</td><td>❌</td></tr>
          <tr><td>Đếm render</td><td>✅</td><td>❌ (vòng lặp)</td></tr>
          <tr><td>Hiển thị dữ liệu UI</td><td>❌</td><td>✅</td></tr>
        </tbody>
      </table>

      <div className="edu-tip">
        <strong>💡 Mẹo:</strong> Nếu thay đổi giá trị CẦN cập nhật UI → dùng state. Nếu KHÔNG cần cập nhật UI → dùng ref.
      </div>
    </LessonLayout>
  );
};

export default UseRefLesson;
