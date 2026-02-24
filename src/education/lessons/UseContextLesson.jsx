/**
 * ============================================================
 * 📖 BÀI 3: useContext - Truyền Dữ Liệu Xuyên Component
 * ============================================================
 * 
 * 🎯 MỤC TIÊU: Hiểu cách chia sẻ dữ liệu giữa các component
 * mà KHÔNG cần truyền props qua từng cấp (prop drilling).
 * 
 * 📌 CÚ PHÁP:
 * 1. Tạo: const MyContext = createContext(defaultValue)
 * 2. Cung cấp: <MyContext.Provider value={...}>
 * 3. Sử dụng: const value = useContext(MyContext)
 * 
 * 💡 BẢN CHẤT:
 * - Context tạo ra một "kênh truyền tin" cho phép component con
 *   truy cập dữ liệu của component cha mà không cần props.
 * - Giống như radio: Provider là đài phát, useContext là máy thu.
 * - Khi value của Provider thay đổi, TẤT CẢ component con dùng
 *   useContext sẽ re-render.
 * ============================================================
 */
import React, { useState, useContext, createContext } from "react";
import LessonLayout from "../LessonLayout";

// ============================================================
// BƯỚC 1: Tạo Context
// createContext(defaultValue) tạo ra một "kênh truyền tin"
// defaultValue chỉ dùng khi component KHÔNG nằm trong Provider
// ============================================================
const ThemeContext = createContext("light");
const LanguageContext = createContext("vi");

// ============================================================
// COMPONENT CON CẤP SÂU: Nút bấm chuyển theme
// Dùng useContext để "thu" dữ liệu từ ThemeContext
// Không cần nhận props từ cha → Giải quyết prop drilling!
// ============================================================
const ThemeButton = () => {
  // BƯỚC 3: "Thu" dữ liệu từ Context gần nhất
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      className="edu-btn"
      onClick={toggleTheme}
      style={{
        background: theme === "dark" ? "#818cf8" : "#f59e0b",
        color: theme === "dark" ? "white" : "#1e293b",
        transition: "all 0.3s ease",
      }}
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"} — Click để chuyển
    </button>
  );
};

// ============================================================
// COMPONENT CON: Hiển thị nội dung theo theme
// Minh họa component ở cấp sâu vẫn truy cập được context
// ============================================================
const ThemedCard = () => {
  const { theme } = useContext(ThemeContext);

  const styles = {
    padding: 16,
    borderRadius: 8,
    transition: "all 0.3s ease",
    backgroundColor: theme === "dark" ? "#1e293b" : "#fffbeb",
    color: theme === "dark" ? "#e2e8f0" : "#1e293b",
    border: `1px solid ${theme === "dark" ? "#334155" : "#fde68a"}`,
  };

  return (
    <div style={styles}>
      <strong>📦 Card nội dung</strong>
      <p style={{ margin: "8px 0 0", fontSize: "0.85rem" }}>
        Theme hiện tại: <span className="edu-inline-code">{theme}</span>.
        Card này đọc theme từ Context — KHÔNG nhận qua props!
      </p>
    </div>
  );
};

// ============================================================
// COMPONENT CON: Hiển thị ngôn ngữ (Multi-context)
// Minh họa việc dùng NHIỀU context cùng lúc
// ============================================================
const LanguageDisplay = () => {
  const { theme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);

  const languages = [
    { code: "vi", label: "🇻🇳 Tiếng Việt" },
    { code: "en", label: "🇺🇸 English" },
    { code: "ja", label: "🇯🇵 日本語" },
  ];

  const greetings = {
    vi: "Xin chào! 👋",
    en: "Hello! 👋",
    ja: "こんにちは! 👋",
  };

  return (
    <div style={{
      padding: 16, borderRadius: 8,
      background: theme === "dark" ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)",
      border: `1px solid ${theme === "dark" ? "#334155" : "#c7d2fe"}`,
    }}>
      <div className="edu-flex edu-gap-8 edu-mb-8">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`edu-btn ${language === lang.code ? "edu-btn-primary" : "edu-btn-secondary"}`}
            style={{ padding: "4px 12px", fontSize: "0.82rem" }}
            onClick={() => setLanguage(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <p className="edu-text">
        <strong>{greetings[language]}</strong> — Đang dùng cả ThemeContext + LanguageContext
      </p>
    </div>
  );
};

// ============================================================
// COMPONENT CHÍNH CỦA BÀI HỌC
// ============================================================
const UseContextLesson = () => {
  // ============================================================
  // State cho Context Provider
  // Provider đặt ở đây → tất cả component con đều truy cập được
  // ============================================================
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("vi");

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  return (
    // BƯỚC 2: Bọc component con trong Provider
    // value={...} là dữ liệu sẽ được "phát" tới tất cả consumer
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <LessonLayout
          lessonNumber="03"
          title="useContext - Truyền dữ liệu xuyên Component"
          description="useContext giải quyết vấn đề 'prop drilling' — khi cần truyền dữ liệu qua nhiều cấp component mà không muốn truyền props từng tầng."
        >
          {/* === CÚ PHÁP === */}
          <h3 className="edu-section-title">📝 Cú pháp 3 bước</h3>
          <div className="edu-code-block">
            <div className="edu-code-header">
              <span>3 bước dùng useContext</span>
            </div>
            <div className="edu-code-content">
{`// BƯỚC 1: Tạo Context (thường ở file riêng)
const ThemeContext = createContext("light");

// BƯỚC 2: Bọc Provider ở component cha
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  <App />
</ThemeContext.Provider>

// BƯỚC 3: Đọc value ở component con (bất kỳ cấp nào)
const { theme, toggleTheme } = useContext(ThemeContext);`}
            </div>
          </div>

          {/* === MINH HOẠ PROP DRILLING === */}
          <h3 className="edu-section-title">🔗 Vấn đề: Prop Drilling</h3>
          <div className="edu-warning">
            <strong>⚠️ Không có Context:</strong><br/>
            <span className="edu-inline-code">App → Layout → Sidebar → Menu → MenuItem</span><br/>
            Phải truyền <span className="edu-inline-code">theme</span> qua 4 cấp dù chỉ MenuItem cần dùng!<br/><br/>
            <strong>✅ Có Context:</strong><br/>
            <span className="edu-inline-code">App (Provider) → ... → MenuItem (useContext)</span><br/>
            MenuItem đọc trực tiếp từ Context — không cần trung gian!
          </div>

          {/* === DEMO 1: Theme Switcher === */}
          <h3 className="edu-section-title">🎨 Demo 1: Theme Switcher</h3>
          <p className="edu-text">
            Các component bên dưới ĐỌC theme từ Context — không nhận qua props.
            Click nút để chuyển theme, mọi component sẽ tự cập nhật.
          </p>
          <div className="edu-demo">
            <div className="edu-demo-title">💡 Theme Context Demo</div>
            <div className="edu-flex edu-flex-col edu-gap-12">
              <ThemeButton />
              <ThemedCard />
            </div>
          </div>

          {/* === DEMO 2: Multiple Contexts === */}
          <h3 className="edu-section-title">🌐 Demo 2: Dùng Nhiều Context</h3>
          <p className="edu-text">
            Bạn có thể lồng nhiều Provider và dùng nhiều <span className="edu-inline-code">useContext</span> 
            trong cùng một component. React sẽ tìm Provider gần nhất cho mỗi Context.
          </p>
          <div className="edu-demo">
            <div className="edu-demo-title">💡 Theme + Language Contexts</div>
            <LanguageDisplay />
          </div>

          {/* === KHI NÀO DÙNG === */}
          <h3 className="edu-section-title">❓ Khi nào nên dùng Context?</h3>
          <table className="edu-table">
            <thead>
              <tr>
                <th>Nên dùng ✅</th>
                <th>Không nên dùng ❌</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Theme (dark/light)</td>
                <td>State chỉ dùng trong 1-2 component</td>
              </tr>
              <tr>
                <td>Thông tin đăng nhập (user)</td>
                <td>State thay đổi rất thường xuyên (gây re-render nhiều)</td>
              </tr>
              <tr>
                <td>Ngôn ngữ (i18n)</td>
                <td>Khi cần quản lý state phức tạp (dùng Redux/Zustand)</td>
              </tr>
              <tr>
                <td>Cấu hình app-wide</td>
                <td>Khi prop drilling chỉ qua 1-2 cấp</td>
              </tr>
            </tbody>
          </table>

          <div className="edu-tip">
            <strong>💡 Mẹo từ thầy:</strong> Context KHÔNG phải là "Redux killer". Context tốt cho dữ liệu 
            ít thay đổi (theme, user, language). Nếu state thay đổi liên tục và có logic phức tạp, 
            hãy dùng Zustand hoặc Redux Toolkit. Đừng ép Context làm việc nó không giỏi!
          </div>
        </LessonLayout>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

export default UseContextLesson;
