/**
 * 📖 BÀI 11: useDeferredValue - Trì Hoãn Cập Nhật Không Quan Trọng
 * Cho phép "trì hoãn" render một giá trị để ưu tiên phản hồi nhanh cho user.
 * React 18 Concurrent Feature.
 */
import React, { useState, useDeferredValue, useMemo } from "react";
import LessonLayout from "../LessonLayout";

// Component danh sách nặng (giả lập)
const HeavyList = ({ filter }) => {
  // Tạo 10,000 items và filter
  const items = useMemo(() => {
    const result = [];
    for (let i = 0; i < 10000; i++) {
      result.push(`Item #${i + 1} - ${["React", "Vue", "Angular", "Svelte", "Next.js"][i % 5]}`);
    }
    return result.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
  }, [filter]);

  return (
    <div style={{ maxHeight: 250, overflowY: "auto", fontSize: "0.82rem" }}>
      <div style={{ color: "#94a3b8", marginBottom: 8 }}>
        Hiển thị {items.length} / 10,000 items
      </div>
      {items.slice(0, 100).map((item, i) => (
        <div key={i} style={{
          padding: "4px 8px", borderBottom: "1px solid var(--edu-border)",
          color: item.toLowerCase().includes(filter.toLowerCase()) && filter ? "#818cf8" : "#e2e8f0",
        }}>
          {item}
        </div>
      ))}
      {items.length > 100 && (
        <div style={{ padding: 8, color: "#94a3b8", textAlign: "center" }}>
          ... và {items.length - 100} items nữa
        </div>
      )}
    </div>
  );
};

const UseDeferredValueLesson = () => {
  const [searchText, setSearchText] = useState("");
  
  // useDeferredValue: tạo "phiên bản trì hoãn" của searchText
  // Khi gõ nhanh, searchText cập nhật ngay (input responsive)
  // Nhưng deferredSearch cập nhật TRỄ hơn → list render sau
  const deferredSearch = useDeferredValue(searchText);

  // Kiểm tra xem deferred value đã "bắt kịp" chưa
  const isStale = searchText !== deferredSearch;

  return (
    <LessonLayout lessonNumber="11" title="useDeferredValue - Trì hoãn cập nhật"
      description="useDeferredValue cho phép 'trì hoãn' render phần không quan trọng (danh sách dài) để ưu tiên phản hồi nhanh (input). Concurrent feature của React 18.">
      
      <h3 className="edu-section-title">📝 Cú pháp</h3>
      <div className="edu-code-block">
        <div className="edu-code-header"><span>useDeferredValue</span></div>
        <div className="edu-code-content">
{`const [text, setText] = useState("");
const deferredText = useDeferredValue(text);

// text: cập nhật NGAY → input responsive
// deferredText: cập nhật TRỄ → danh sách render sau

<input value={text} onChange={e => setText(e.target.value)} />
<HeavyList filter={deferredText} /> // ← dùng deferred`}
        </div>
      </div>

      <h3 className="edu-section-title">🔍 Demo: Search 10,000 items</h3>
      <p className="edu-text">
        Gõ nhanh vào ô tìm kiếm. Input phản hồi ngay lập tức, trong khi danh sách 
        cập nhật sau. Quan sát hiệu ứng "mờ" khi dữ liệu chưa cập nhật.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Deferred Search</div>
        <input className="edu-input edu-mb-8" value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Gõ nhanh: react, vue, angular..."
          style={{ width: "100%" }} />
        
        <div className="edu-flex edu-gap-8 edu-mb-8" style={{ fontSize: "0.8rem" }}>
          <span>Input: <strong style={{ color: "#818cf8" }}>{searchText || "(trống)"}</strong></span>
          <span>Deferred: <strong style={{ color: isStale ? "#f59e0b" : "#34d399" }}>{deferredSearch || "(trống)"}</strong></span>
          {isStale && <span style={{ color: "#f59e0b" }}>⏳ Đang cập nhật...</span>}
        </div>

        <div style={{
          opacity: isStale ? 0.6 : 1,
          transition: "opacity 0.2s ease",
        }}>
          <HeavyList filter={deferredSearch} />
        </div>
      </div>

      <div className="edu-info">
        <strong>💡 Ý tưởng:</strong> Input (tương tác trực tiếp) = <strong>ưu tiên cao</strong>.
        Render danh sách 10,000 items = <strong>ưu tiên thấp</strong>.
        useDeferredValue cho React biết: "Cập nhật input trước, danh sách tính sau".
      </div>

      <div className="edu-tip">
        <strong>💡 Mẹo:</strong> useDeferredValue vs debounce: debounce trì hoãn theo thời gian cố định (300ms), 
        useDeferredValue trì hoãn thông minh dựa trên tải CPU — nhanh khi máy mạnh, chậm khi máy yếu.
      </div>
    </LessonLayout>
  );
};

export default UseDeferredValueLesson;
