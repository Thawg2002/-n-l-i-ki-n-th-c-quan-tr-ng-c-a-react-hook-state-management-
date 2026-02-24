/**
 * 📖 BÀI 12: useTransition - Đánh dấu Transition Không Khẩn Cấp
 * Cho phép đánh dấu một update là "không khẩn cấp" → React ưu tiên update khẩn cấp trước.
 * React 18 Concurrent Feature.
 */
import React, { useState, useTransition } from "react";
import LessonLayout from "../LessonLayout";

// Giả lập component nặng cho mỗi tab
const generateItems = (tab) => {
  const items = [];
  const emojis = { posts: "📝", photos: "📷", comments: "💬" };
  for (let i = 0; i < 2000; i++) {
    items.push(`${emojis[tab] || "📌"} ${tab} #${i + 1}`);
  }
  return items;
};

const SlowTab = ({ items }) => (
  <div style={{ maxHeight: 250, overflowY: "auto", fontSize: "0.82rem" }}>
    {items.slice(0, 50).map((item, i) => (
      <div key={i} style={{ padding: "4px 8px", borderBottom: "1px solid var(--edu-border)" }}>
        {item}
      </div>
    ))}
    {items.length > 50 && (
      <div style={{ padding: 8, color: "#94a3b8", textAlign: "center" }}>
        ... và {items.length - 50} items nữa
      </div>
    )}
  </div>
);

const UseTransitionLesson = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [items, setItems] = useState(() => generateItems("posts"));
  
  // useTransition: trả về [isPending, startTransition]
  // isPending: đang trong quá trình chuyển đổi?
  // startTransition: đánh dấu update là "không khẩn cấp"
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { key: "posts", label: "📝 Bài viết", color: "#6366f1" },
    { key: "photos", label: "📷 Ảnh", color: "#ec4899" },
    { key: "comments", label: "💬 Bình luận", color: "#10b981" },
  ];

  const handleTabChange = (tab) => {
    // Update tab ngay lập tức (khẩn cấp)
    setActiveTab(tab);

    // Update danh sách nặng TRONG startTransition (không khẩn cấp)
    // → Tab highlight ngay, nhưng danh sách render sau
    startTransition(() => {
      setItems(generateItems(tab));
    });
  };

  // Demo 2: Counter + transition
  const [count, setCount] = useState(0);
  const [heavyResult, setHeavyResult] = useState([]);
  const [isPending2, startTransition2] = useTransition();

  const handleCountClick = () => {
    setCount(c => c + 1); // ← Khẩn cấp: cập nhật ngay

    startTransition2(() => {
      // Không khẩn cấp: tính toán nặng
      const result = [];
      for (let i = 0; i < 5000; i++) {
        result.push(`Kết quả #${i + 1}`);
      }
      setHeavyResult(result);
    });
  };

  return (
    <LessonLayout lessonNumber="12" title="useTransition - Transition không khẩn cấp"
      description="useTransition cho phép đánh dấu state updates là 'không khẩn cấp'. React sẽ ưu tiên updates khẩn cấp (click, input) trước, updates nặng sẽ chạy sau.">
      
      <h3 className="edu-section-title">📝 Cú pháp</h3>
      <div className="edu-code-block">
        <div className="edu-code-header"><span>useTransition</span></div>
        <div className="edu-code-content">
{`const [isPending, startTransition] = useTransition();

const handleClick = () => {
  // ✅ Khẩn cấp: phản hồi ngay
  setActiveTab(tab);

  // ⏳ Không khẩn cấp: render sau
  startTransition(() => {
    setHeavyList(generateList(tab));
  });
};

// isPending = true khi đang trong transition
{isPending && <Spinner />}`}
        </div>
      </div>

      <h3 className="edu-section-title">📑 Demo 1: Tab Switching</h3>
      <p className="edu-text">
        Click tab → tab highlight <strong>ngay lập tức</strong> (khẩn cấp), 
        nhưng danh sách 2,000 items render <strong>sau</strong> (transition).
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Tabs với Transition</div>
        <div className="edu-flex edu-gap-8 edu-mb-16">
          {tabs.map(tab => (
            <button key={tab.key}
              className={`edu-btn ${activeTab === tab.key ? "edu-btn-primary" : "edu-btn-secondary"}`}
              onClick={() => handleTabChange(tab.key)}
              style={activeTab === tab.key ? { background: tab.color } : {}}>
              {tab.label}
            </button>
          ))}
          {isPending && (
            <span style={{ color: "#f59e0b", fontSize: "0.85rem", display: "flex", alignItems: "center" }}>
              ⏳ Đang tải...
            </span>
          )}
        </div>
        <div style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>
          <SlowTab items={items} />
        </div>
      </div>

      <h3 className="edu-section-title">🔢 Demo 2: Counter + Heavy Update</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Count tăng ngay, kết quả nặng tính sau</div>
        <div className="edu-flex edu-items-center edu-gap-16">
          <button className="edu-btn edu-btn-primary" onClick={handleCountClick}>
            ➕ Count: {count}
          </button>
          {isPending2 && <span style={{ color: "#f59e0b" }}>⏳ Đang xử lý...</span>}
          <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
            Heavy results: {heavyResult.length} items
          </span>
        </div>
      </div>

      <h3 className="edu-section-title">⚖️ useTransition vs useDeferredValue</h3>
      <table className="edu-table">
        <thead><tr><th>Tiêu chí</th><th>useTransition</th><th>useDeferredValue</th></tr></thead>
        <tbody>
          <tr><td>Kiểm soát</td><td>Bao bọc setState</td><td>Bao bọc value</td></tr>
          <tr><td>isPending</td><td>✅ Có</td><td>❌ Không (so sánh thủ công)</td></tr>
          <tr><td>Khi nào dùng</td><td>Bạn kiểm soát state update</td><td>Value đến từ props/parent</td></tr>
        </tbody>
      </table>

      <div className="edu-tip">
        <strong>💡 Mẹo:</strong> Nếu BẠN là người gọi setState → dùng useTransition. 
        Nếu value đến từ PROPS hoặc hook khác → dùng useDeferredValue.
      </div>
    </LessonLayout>
  );
};

export default UseTransitionLesson;
