/**
 * 📖 BÀI 13: Custom Hooks - Tự Tạo Hook Riêng
 * Custom hooks giúp tái sử dụng logic giữa các component.
 * Quy tắc đặt tên: luôn bắt đầu bằng "use".
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import LessonLayout from "../LessonLayout";

// ============================================================
// CUSTOM HOOK 1: useToggle
// Đơn giản nhất: quản lý state boolean
// ============================================================
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  // useCallback để toggle function giữ reference ổn định
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse };
};

// ============================================================
// CUSTOM HOOK 2: useLocalStorage
// Lưu state vào localStorage, tự đồng bộ
// ============================================================
const useLocalStorage = (key, initialValue) => {
  // Lazy init: đọc từ localStorage lần đầu
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Ghi vào localStorage mỗi khi value thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Lỗi ghi localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

// ============================================================
// CUSTOM HOOK 3: useDebounce
// Trì hoãn giá trị, chỉ cập nhật sau khi ngừng thay đổi
// ============================================================
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Cleanup: hủy timer cũ khi value thay đổi
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// ============================================================
// CUSTOM HOOK 4: useFetch
// Quản lý toàn bộ lifecycle của API call
// ============================================================
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => { if (!cancelled) setData(json); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
};

// ============================================================
// CUSTOM HOOK 5: useCounter
// Counter với min, max, step
// ============================================================
const useCounter = (initial = 0, { min = -Infinity, max = Infinity, step = 1 } = {}) => {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount(c => Math.min(max, c + step)), [max, step]);
  const decrement = useCallback(() => setCount(c => Math.max(min, c - step)), [min, step]);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, increment, decrement, reset };
};

const CustomHooksLesson = () => {
  // Sử dụng các custom hooks
  const modal = useToggle(false);
  const darkMode = useToggle(false);

  const [username, setUsername] = useLocalStorage("edu-username", "");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: user, loading, error } = useFetch(
    `https://jsonplaceholder.typicode.com/users/1`
  );

  const counter = useCounter(0, { min: 0, max: 20, step: 1 });

  return (
    <LessonLayout lessonNumber="13" title="Custom Hooks - Tự tạo Hook riêng"
      description="Custom Hooks cho phép tách logic ra khỏi component để tái sử dụng. Đặt tên bắt đầu bằng 'use'. Đây là pattern mạnh nhất để tổ chức code React.">
      
      <h3 className="edu-section-title">📝 Quy tắc Custom Hooks</h3>
      <div className="edu-code-block">
        <div className="edu-code-header"><span>Anatomy of a Custom Hook</span></div>
        <div className="edu-code-content">
{`// 1. Tên BẮT BUỘC bắt đầu bằng "use"
// 2. Bên trong có thể dùng mọi hook khác
// 3. Trả về giá trị mà component cần

const useMyHook = (params) => {
  const [state, setState] = useState(initialValue);
  useEffect(() => { /* logic */ }, [deps]);
  
  return { state, actions };
};

// Sử dụng: giống như dùng hook bình thường
const { state, actions } = useMyHook(params);`}
        </div>
      </div>

      {/* DEMO 1: useToggle */}
      <h3 className="edu-section-title">🔀 Hook 1: useToggle</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Boolean toggle đơn giản</div>
        <div className="edu-flex edu-gap-16 edu-flex-wrap">
          <div className="edu-flex edu-items-center edu-gap-8">
            <div className={`edu-toggle ${modal.value ? "active" : ""}`} onClick={modal.toggle} />
            <span>Modal: {modal.value ? "Mở" : "Đóng"}</span>
          </div>
          <div className="edu-flex edu-items-center edu-gap-8">
            <div className={`edu-toggle ${darkMode.value ? "active" : ""}`} onClick={darkMode.toggle} />
            <span>{darkMode.value ? "🌙 Dark" : "☀️ Light"}</span>
          </div>
        </div>
        {modal.value && (
          <div className="edu-mt-8" style={{ padding: 16, background: "rgba(99,102,241,0.1)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.3)" }}>
            📦 Modal content! <button className="edu-btn edu-btn-danger" style={{ marginLeft: 8, padding: "2px 10px" }} onClick={modal.setFalse}>Đóng</button>
          </div>
        )}
      </div>

      {/* DEMO 2: useLocalStorage */}
      <h3 className="edu-section-title">💾 Hook 2: useLocalStorage</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 State tự lưu vào localStorage</div>
        <input className="edu-input" value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên (tự lưu localStorage)..."
          style={{ width: "100%", maxWidth: 400 }} />
        <p className="edu-text" style={{ fontSize: "0.8rem" }}>
          🔄 Reload trang → giá trị vẫn còn! Key: <span className="edu-inline-code">"edu-username"</span>
        </p>
      </div>

      {/* DEMO 3: useDebounce */}
      <h3 className="edu-section-title">⏱️ Hook 3: useDebounce</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Trì hoãn 500ms trước khi tìm kiếm</div>
        <input className="edu-input" value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Gõ nhanh để thấy debounce..."
          style={{ width: "100%", maxWidth: 400 }} />
        <div className="edu-mt-8 edu-flex edu-gap-16" style={{ fontSize: "0.85rem" }}>
          <span>Gõ: <strong style={{ color: "#818cf8" }}>{search || "(trống)"}</strong></span>
          <span>Debounced: <strong style={{ color: search !== debouncedSearch ? "#f59e0b" : "#34d399" }}>{debouncedSearch || "(trống)"}</strong></span>
        </div>
      </div>

      {/* DEMO 4: useFetch */}
      <h3 className="edu-section-title">🌐 Hook 4: useFetch</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 API call gọn gàng</div>
        {loading && <p style={{ color: "#f59e0b" }}>⏳ Đang tải...</p>}
        {error && <p style={{ color: "#f87171" }}>❌ {error}</p>}
        {user && (
          <div style={{ padding: 12, background: "rgba(16,185,129,0.08)", borderRadius: 8 }}>
            <div>👤 <strong>{user.name}</strong></div>
            <div>📧 {user.email}</div>
            <div>🌐 {user.website}</div>
          </div>
        )}
      </div>

      {/* DEMO 5: useCounter */}
      <h3 className="edu-section-title">🔢 Hook 5: useCounter (min/max/step)</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Counter có giới hạn 0-20</div>
        <div className="edu-flex edu-items-center edu-gap-12">
          <button className="edu-btn edu-btn-secondary" onClick={counter.decrement}>−</button>
          <span style={{ fontSize: "1.5rem", fontWeight: 700, minWidth: 40, textAlign: "center" }}>{counter.count}</span>
          <button className="edu-btn edu-btn-primary" onClick={counter.increment}>+</button>
          <button className="edu-btn edu-btn-danger" onClick={counter.reset}>Reset</button>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Min: 0 | Max: 20</span>
        </div>
      </div>

      <div className="edu-tip">
        <strong>💡 Mẹo:</strong> Khi thấy logic lặp lại ở 2+ component → tách thành custom hook! 
        Ví dụ: useAuth, useForm, usePagination, useMediaQuery... Custom hooks là "siêu năng lực" của React developer.
      </div>
    </LessonLayout>
  );
};

export default CustomHooksLesson;
