/**
 * 📖 BÀI 8: useLayoutEffect - Effect Đồng Bộ Trước Paint
 * Giống useEffect nhưng chạy TRƯỚC khi browser paint lên màn hình.
 * Dùng khi cần đo/thay đổi DOM trước khi user nhìn thấy.
 */
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import LessonLayout from "../LessonLayout";

const UseLayoutEffectLesson = () => {
  // DEMO: Đo kích thước element và hiển thị tooltip
  const [showBox, setShowBox] = useState(true);
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });
  const boxRef = useRef(null);

  // useLayoutEffect chạy TRƯỚC paint → user không thấy "nhấp nháy"
  useLayoutEffect(() => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setBoxSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    }
  }, [showBox]);

  // DEMO 2: So sánh useEffect vs useLayoutEffect
  const [color, setColor] = useState("#6366f1");
  const colorBoxRef = useRef(null);
  const [effectLog, setEffectLog] = useState([]);

  useLayoutEffect(() => {
    setEffectLog(prev => [...prev.slice(-4), "🟢 useLayoutEffect chạy (trước paint)"]);
  }, [color]);

  useEffect(() => {
    setEffectLog(prev => [...prev.slice(-4), "🔵 useEffect chạy (sau paint)"]);
  }, [color]);

  const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"];

  return (
    <LessonLayout lessonNumber="08" title="useLayoutEffect - Effect đồng bộ trước Paint"
      description="useLayoutEffect giống useEffect nhưng chạy TRƯỚC khi trình duyệt vẽ lên màn hình. Dùng khi cần đo DOM hoặc thay đổi layout trước khi user nhìn thấy.">
      
      <h3 className="edu-section-title">📝 So sánh useEffect vs useLayoutEffect</h3>
      <div className="edu-code-block">
        <div className="edu-code-header"><span>Thứ tự thực thi</span></div>
        <div className="edu-code-content">
{`// Thứ tự khi component render:
// 1. React tính toán UI mới (render phase)
// 2. React cập nhật DOM
// 3. ▶ useLayoutEffect chạy (đồng bộ, chặn paint)
// 4. Browser paint lên màn hình
// 5. ▶ useEffect chạy (bất đồng bộ, sau paint)

useLayoutEffect(() => {
  // Đo DOM, thay đổi style → user không thấy nhấp nháy
  const rect = ref.current.getBoundingClientRect();
}, [deps]);`}
        </div>
      </div>

      <h3 className="edu-section-title">📏 Demo 1: Đo kích thước DOM</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Đo element trước khi hiển thị</div>
        <button className="edu-btn edu-btn-primary edu-mb-16"
          onClick={() => setShowBox(p => !p)}>
          {showBox ? "Ẩn" : "Hiện"} Box
        </button>
        {showBox && (
          <div ref={boxRef} style={{
            padding: "20px 40px", background: "rgba(99,102,241,0.1)",
            border: "2px dashed #818cf8", borderRadius: 8,
            display: "inline-block",
          }}>
            📦 Tôi là một Box
          </div>
        )}
        <div className="edu-mt-8">
          Kích thước: <strong style={{ color: "#818cf8" }}>{boxSize.width}×{boxSize.height}px</strong>
          <span className="edu-text" style={{ fontSize: "0.8rem", marginLeft: 8 }}>
            (đo bằng useLayoutEffect — không nhấp nháy)
          </span>
        </div>
      </div>

      <h3 className="edu-section-title">🔄 Demo 2: Thứ tự chạy</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 useLayoutEffect chạy TRƯỚC useEffect</div>
        <div className="edu-flex edu-gap-8 edu-mb-16">
          {colors.map(c => (
            <div key={c} onClick={() => setColor(c)} style={{
              width: 32, height: 32, borderRadius: 8, background: c, cursor: "pointer",
              border: color === c ? "3px solid white" : "3px solid transparent",
              transition: "all 0.2s ease",
            }} />
          ))}
        </div>
        <div style={{ padding: 12, background: "var(--edu-bg-code)", borderRadius: 8, fontSize: "0.82rem", fontFamily: "monospace" }}>
          {effectLog.map((log, i) => <div key={i}>{log}</div>)}
          {effectLog.length === 0 && <span style={{ color: "#94a3b8" }}>Chọn màu để xem thứ tự...</span>}
        </div>
      </div>

      <h3 className="edu-section-title">❓ Khi nào dùng?</h3>
      <table className="edu-table">
        <thead><tr><th>useEffect ✅ (99% trường hợp)</th><th>useLayoutEffect ✅ (hiếm)</th></tr></thead>
        <tbody>
          <tr><td>Fetch API, event listener</td><td>Đo kích thước DOM</td></tr>
          <tr><td>Timer (setTimeout, setInterval)</td><td>Tính toán vị trí tooltip/popover</td></tr>
          <tr><td>Logging, analytics</td><td>Đồng bộ DOM trước khi paint</td></tr>
          <tr><td>Mọi side effect khác</td><td>Tránh "nhấp nháy" UI</td></tr>
        </tbody>
      </table>

      <div className="edu-warning">
        <strong>⚠️ Cẩn thận:</strong> useLayoutEffect chạy đồng bộ → chặn browser paint. 
        Nếu logic nặng, user sẽ thấy UI "đơ". Chỉ dùng khi THẬT SỰ cần đo/thay đổi DOM trước paint.
      </div>
    </LessonLayout>
  );
};

export default UseLayoutEffectLesson;
