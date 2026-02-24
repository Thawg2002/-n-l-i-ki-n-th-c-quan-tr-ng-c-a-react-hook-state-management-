/**
 * 📖 BÀI 6: useMemo - Cache Kết Quả Tính Toán
 * useMemo "ghi nhớ" kết quả của phép tính nặng, chỉ tính lại khi deps thay đổi.
 * Cú pháp: const value = useMemo(() => expensiveCalc(a), [a]);
 */
import React, { useState, useMemo } from "react";
import LessonLayout from "../LessonLayout";

const UseMemoLesson = () => {
  // DEMO 1: Tính toán nặng — useMemo cache kết quả
  const [count, setCount] = useState(5);
  const [text, setText] = useState("");

  // useMemo: chỉ tính lại khi `count` thay đổi
  // Nếu `text` thay đổi → KHÔNG tính lại → mượt mà!
  const expensiveResult = useMemo(() => {
    console.log("🔥 Đang tính toán nặng...");
    let result = 0;
    for (let i = 0; i < count * 10000000; i++) {
      result += 1;
    }
    return result;
  }, [count]); // ← Chỉ re-compute khi count đổi

  // DEMO 2: Filter danh sách — tránh filter lại khi state khác thay đổi
  const [filterText, setFilterText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [highlight, setHighlight] = useState(false);

  const students = [
    { id: 1, name: "Nguyễn Văn An", score: 85 },
    { id: 2, name: "Trần Thị Bình", score: 92 },
    { id: 3, name: "Lê Hoàng Cường", score: 78 },
    { id: 4, name: "Phạm Minh Đức", score: 95 },
    { id: 5, name: "Hoàng Thị Em", score: 88 },
    { id: 6, name: "Vũ Quốc Phong", score: 70 },
    { id: 7, name: "Đặng Thùy Giang", score: 91 },
    { id: 8, name: "Bùi Hải Nam", score: 82 },
  ];

  // useMemo: filter + sort chỉ chạy lại khi filterText hoặc sortOrder đổi
  // Toggle highlight KHÔNG trigger lại filter/sort → mượt!
  const filteredStudents = useMemo(() => {
    console.log("📋 Filter + Sort danh sách...");
    let result = students.filter(s =>
      s.name.toLowerCase().includes(filterText.toLowerCase())
    );
    result.sort((a, b) =>
      sortOrder === "asc" ? a.score - b.score : b.score - a.score
    );
    return result;
  }, [filterText, sortOrder]);

  // DEMO 3: So sánh CÓ và KHÔNG CÓ useMemo
  const [demoCount, setDemoCount] = useState(0);
  const [demoText, setDemoText] = useState("");

  // KHÔNG useMemo: tính mỗi render (kể cả khi text thay đổi)
  const withoutMemo = (() => {
    let sum = 0;
    for (let i = 0; i <= demoCount; i++) sum += i;
    return sum;
  })();

  // CÓ useMemo: chỉ tính khi demoCount đổi
  const withMemo = useMemo(() => {
    let sum = 0;
    for (let i = 0; i <= demoCount; i++) sum += i;
    return sum;
  }, [demoCount]);

  return (
    <LessonLayout lessonNumber="06" title="useMemo - Cache kết quả tính toán"
      description="useMemo 'ghi nhớ' kết quả phép tính nặng. Chỉ tính lại khi dependency thay đổi. Giúp tránh tính toán thừa khi component re-render.">
      
      <h3 className="edu-section-title">📝 Cú pháp</h3>
      <div className="edu-code-block">
        <div className="edu-code-header"><span>useMemo</span></div>
        <div className="edu-code-content">
{`// Cache kết quả tính toán
const result = useMemo(() => {
  return heavyCalculation(a, b);
}, [a, b]); // ← chỉ tính lại khi a hoặc b đổi

// Nếu KHÔNG useMemo:
const result = heavyCalculation(a, b);
// → Tính lại MỌI lần render, kể cả khi a, b không đổi!`}
        </div>
      </div>

      <h3 className="edu-section-title">🔥 Demo 1: Tính toán nặng</h3>
      <p className="edu-text">
        Thử gõ text bên dưới → component re-render, nhưng phép tính nặng KHÔNG chạy lại 
        (nhờ useMemo). Chỉ khi thay đổi count thì mới tính lại.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Heavy Computation</div>
        <div className="edu-flex edu-items-center edu-gap-12 edu-mb-16">
          <button className="edu-btn edu-btn-secondary" onClick={() => setCount(c => Math.max(1, c - 1))}>−</button>
          <span>Count: <strong>{count}</strong></span>
          <button className="edu-btn edu-btn-primary" onClick={() => setCount(c => c + 1)}>+</button>
        </div>
        <input className="edu-input" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Gõ gì đó (không trigger tính toán lại)..." style={{ width: "100%" }} />
        <div className="edu-mt-8">
          Kết quả: <strong style={{ color: "#818cf8" }}>{expensiveResult.toLocaleString()}</strong>
        </div>
        <p className="edu-text" style={{ fontSize: "0.8rem" }}>
          🔍 Mở Console: "Đang tính toán nặng" chỉ xuất hiện khi count thay đổi!
        </p>
      </div>

      <h3 className="edu-section-title">📋 Demo 2: Filter + Sort danh sách</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Danh sách sinh viên (filter chỉ chạy khi cần)</div>
        <div className="edu-flex edu-gap-8 edu-mb-16 edu-flex-wrap">
          <input className="edu-input" value={filterText} onChange={(e) => setFilterText(e.target.value)}
            placeholder="Tìm theo tên..." style={{ flex: 1, minWidth: 200 }} />
          <button className={`edu-btn ${sortOrder === "asc" ? "edu-btn-primary" : "edu-btn-secondary"}`}
            onClick={() => setSortOrder("asc")}>↑ Điểm tăng</button>
          <button className={`edu-btn ${sortOrder === "desc" ? "edu-btn-primary" : "edu-btn-secondary"}`}
            onClick={() => setSortOrder("desc")}>↓ Điểm giảm</button>
          <button className={`edu-btn ${highlight ? "edu-btn-success" : "edu-btn-secondary"}`}
            onClick={() => setHighlight(p => !p)}>✨ Highlight ≥90</button>
        </div>
        <table className="edu-table">
          <thead>
            <tr><th>#</th><th>Tên</th><th>Điểm</th></tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={s.id} style={{
                backgroundColor: highlight && s.score >= 90 ? "rgba(16,185,129,0.12)" : "transparent"
              }}>
                <td>{i + 1}</td><td>{s.name}</td>
                <td><strong>{s.score}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="edu-text" style={{ fontSize: "0.8rem" }}>
          ☝️ Toggle Highlight KHÔNG trigger filter/sort lại (vì không phải dependency)
        </p>
      </div>

      <h3 className="edu-section-title">❓ Khi nào dùng useMemo?</h3>
      <div className="edu-info">
        <strong>✅ NÊN dùng khi:</strong>
        <ul className="edu-list">
          <li>Phép tính nặng (loop lớn, sort, filter danh sách dài)</li>
          <li>Tạo object/array mới truyền xuống component con có React.memo</li>
          <li>Derived state phức tạp từ state hiện có</li>
        </ul>
      </div>
      <div className="edu-warning">
        <strong>❌ KHÔNG NÊN dùng khi:</strong>
        <ul className="edu-list">
          <li>Phép tính đơn giản (cộng trừ nhân chia) — overhead của useMemo lớn hơn benefit</li>
          <li>Mọi nơi "phòng hờ" — React đã rất nhanh, chỉ optimize khi cần</li>
        </ul>
      </div>

      <div className="edu-tip">
        <strong>💡 Mẹo:</strong> "Premature optimization is the root of all evil". Chỉ dùng useMemo khi bạn 
        <strong> đo được</strong> performance issue. Đừng dùng useMemo cho mọi thứ!
      </div>
    </LessonLayout>
  );
};

export default UseMemoLesson;
