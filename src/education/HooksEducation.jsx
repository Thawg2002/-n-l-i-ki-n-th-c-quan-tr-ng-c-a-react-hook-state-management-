/**
 * ============================================================
 * 🎓 HooksEducation - Component Chính Trang Học Tập
 * ============================================================
 * 
 * Component này là "trung tâm điều khiển" của toàn bộ trang giáo dục.
 * Gồm: Sidebar navigation + Main content area.
 * 
 * Kiến thức React được áp dụng ngay trong component này:
 * - useState: quản lý bài học hiện tại
 * - Conditional rendering: hiển thị bài học tương ứng
 * - Component composition: kết hợp nhiều lesson components
 * ============================================================
 */
import React, { useState } from "react";
import "./education.css";

// Import tất cả lesson components
import UseStateLesson from "./lessons/UseStateLesson";
import UseEffectLesson from "./lessons/UseEffectLesson";
import UseContextLesson from "./lessons/UseContextLesson";
import UseReducerLesson from "./lessons/UseReducerLesson";
import UseRefLesson from "./lessons/UseRefLesson";
import UseMemoLesson from "./lessons/UseMemoLesson";
import UseCallbackLesson from "./lessons/UseCallbackLesson";
import UseLayoutEffectLesson from "./lessons/UseLayoutEffectLesson";
import UseImperativeHandleLesson from "./lessons/UseImperativeHandleLesson";
import UseIdLesson from "./lessons/UseIdLesson";
import UseDeferredValueLesson from "./lessons/UseDeferredValueLesson";
import UseTransitionLesson from "./lessons/UseTransitionLesson";
import CustomHooksLesson from "./lessons/CustomHooksLesson";
import StateManagementLesson from "./lessons/StateManagementLesson";

// ============================================================
// Cấu hình danh sách bài học
// Mỗi bài có: key (unique), icon, tên, badge (phân loại), component
// ============================================================
const LESSONS = [
  { key: "useState", icon: "📦", name: "useState", badge: "basic", badgeLabel: "Cơ bản", component: UseStateLesson },
  { key: "useEffect", icon: "⚡", name: "useEffect", badge: "basic", badgeLabel: "Cơ bản", component: UseEffectLesson },
  { key: "useContext", icon: "🔗", name: "useContext", badge: "basic", badgeLabel: "Cơ bản", component: UseContextLesson },
  { key: "useReducer", icon: "🎛️", name: "useReducer", badge: "advanced", badgeLabel: "Nâng cao", component: UseReducerLesson },
  { key: "useRef", icon: "🎯", name: "useRef", badge: "basic", badgeLabel: "Cơ bản", component: UseRefLesson },
  { key: "useMemo", icon: "🧠", name: "useMemo", badge: "perf", badgeLabel: "Tối ưu", component: UseMemoLesson },
  { key: "useCallback", icon: "🔄", name: "useCallback", badge: "perf", badgeLabel: "Tối ưu", component: UseCallbackLesson },
  { key: "useLayoutEffect", icon: "📐", name: "useLayoutEffect", badge: "advanced", badgeLabel: "Nâng cao", component: UseLayoutEffectLesson },
  { key: "useImperativeHandle", icon: "🔌", name: "useImperativeHandle", badge: "advanced", badgeLabel: "Nâng cao", component: UseImperativeHandleLesson },
  { key: "useId", icon: "🆔", name: "useId", badge: "advanced", badgeLabel: "Tiện ích", component: UseIdLesson },
  { key: "useDeferredValue", icon: "⏳", name: "useDeferredValue", badge: "concurrent", badgeLabel: "Concurrent", component: UseDeferredValueLesson },
  { key: "useTransition", icon: "🔀", name: "useTransition", badge: "concurrent", badgeLabel: "Concurrent", component: UseTransitionLesson },
  { key: "customHooks", icon: "🛠️", name: "Custom Hooks", badge: "pattern", badgeLabel: "Pattern", component: CustomHooksLesson },
  { key: "stateManagement", icon: "🏪", name: "State Management", badge: "pattern", badgeLabel: "Thư viện", component: StateManagementLesson },
];

// Nhóm bài theo category để hiển thị trên sidebar
const CATEGORIES = [
  { label: "Hooks Cơ Bản", keys: ["useState", "useEffect", "useContext", "useRef"] },
  { label: "Hooks Nâng Cao", keys: ["useReducer", "useLayoutEffect", "useImperativeHandle", "useId"] },
  { label: "Tối Ưu Hiệu Suất", keys: ["useMemo", "useCallback"] },
  { label: "Concurrent Features", keys: ["useDeferredValue", "useTransition"] },
  { label: "Patterns & Libraries", keys: ["customHooks", "stateManagement"] },
];

const HooksEducation = () => {
  // State: bài học nào đang được chọn (null = trang chào)
  const [activeLesson, setActiveLesson] = useState(null);

  // Tìm lesson hiện tại từ danh sách
  const currentLesson = LESSONS.find(l => l.key === activeLesson);
  const CurrentComponent = currentLesson?.component;

  // Tính tiến độ học
  const completedCount = activeLesson ? LESSONS.findIndex(l => l.key === activeLesson) + 1 : 0;
  const progress = (completedCount / LESSONS.length) * 100;

  return (
    <div className="edu-container">
      {/* === SIDEBAR NAVIGATION === */}
      <nav className="edu-sidebar">
        <div className="edu-sidebar-header">
          <h1>🎓 React Hooks Academy</h1>
          <p>Học tất cả hooks qua ví dụ tương tác</p>
          {/* Thanh tiến độ */}
          <div className="edu-progress-bar">
            <div className="edu-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--edu-text-muted)" }}>
            {completedCount}/{LESSONS.length} bài học
          </div>
        </div>

        {/* Render navigation theo category */}
        {CATEGORIES.map(cat => (
          <React.Fragment key={cat.label}>
            <div className="edu-category">{cat.label}</div>
            {cat.keys.map(key => {
              const lesson = LESSONS.find(l => l.key === key);
              if (!lesson) return null;
              return (
                <div
                  key={lesson.key}
                  className={`edu-nav-item ${activeLesson === lesson.key ? "active" : ""}`}
                  onClick={() => setActiveLesson(lesson.key)}
                >
                  <span className="edu-nav-icon">{lesson.icon}</span>
                  <span>{lesson.name}</span>
                  <span className={`edu-nav-badge edu-badge-${lesson.badge}`}>
                    {lesson.badgeLabel}
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      {/* === MAIN CONTENT === */}
      <main className="edu-main">
        {CurrentComponent ? (
          <>
            {/* Nút quay lại (mobile) */}
            <button className="edu-back-btn" onClick={() => setActiveLesson(null)}>
              ← Quay lại
            </button>
            {/* Render bài học được chọn */}
            <CurrentComponent key={activeLesson} />
          </>
        ) : (
          /* === WELCOME SCREEN === */
          <div className="edu-welcome">
            <div className="edu-welcome-icon">🚀</div>
            <h2>Chào mừng đến React Hooks Academy!</h2>
            <p>
              Đây là trang học tập tương tác giúp bạn hiểu rõ bản chất của tất cả 
              React Hooks. Mỗi bài có giải thích chi tiết + demo trực quan.
            </p>
            <div className="edu-feature-grid">
              <div className="edu-feature-card" onClick={() => setActiveLesson("useState")}>
                <div className="edu-feature-card-icon">📦</div>
                <h4>14 Bài Học</h4>
                <p>Cover tất cả hooks React 18</p>
              </div>
              <div className="edu-feature-card" onClick={() => setActiveLesson("useEffect")}>
                <div className="edu-feature-card-icon">💻</div>
                <h4>Demo Tương Tác</h4>
                <p>Học qua thực hành trực tiếp</p>
              </div>
              <div className="edu-feature-card" onClick={() => setActiveLesson("customHooks")}>
                <div className="edu-feature-card-icon">💡</div>
                <h4>Comment Tiếng Việt</h4>
                <p>Giải thích từng bước dễ hiểu</p>
              </div>
            </div>
            <p className="edu-text" style={{ marginTop: 32 }}>
              👈 Chọn bài học từ menu bên trái để bắt đầu!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HooksEducation;
