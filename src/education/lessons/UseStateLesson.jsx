/**
 * ============================================================
 * 📖 BÀI 1: useState - Hook Quản Lý State Cơ Bản
 * ============================================================
 * 
 * 🎯 MỤC TIÊU: Hiểu cách React lưu trữ và cập nhật dữ liệu
 * trong component thông qua useState.
 * 
 * 📌 CÚ PHÁP: const [state, setState] = useState(initialValue)
 * 
 * 💡 BẢN CHẤT:
 * - useState trả về một mảng gồm 2 phần tử:
 *   [0] = giá trị state hiện tại
 *   [1] = hàm để cập nhật state (setter function)
 * - Khi gọi setState, React sẽ RE-RENDER component với giá trị mới.
 * - State được "ghi nhớ" giữa các lần render (persistent).
 * 
 * ⚠️ LƯU Ý QUAN TRỌNG:
 * - setState KHÔNG thay đổi state ngay lập tức (asynchronous).
 * - Khi cập nhật state dựa trên giá trị cũ, dùng functional update:
 *   setState(prev => prev + 1)  ✅
 *   setState(count + 1)         ⚠️ (có thể bị stale nếu batch)
 * - Object/Array state phải tạo bản sao mới (immutability).
 * ============================================================
 */
import React, { useState } from "react";
import LessonLayout from "../LessonLayout";

const UseStateLesson = () => {
  // ============================================================
  // DEMO 1: Counter đơn giản
  // Đây là ví dụ cơ bản nhất của useState
  // ============================================================
  const [count, setCount] = useState(0);

  // ============================================================
  // DEMO 2: Quản lý input text
  // useState lưu giá trị người dùng nhập vào ô input
  // Mỗi khi gõ phím, onChange gọi setName → re-render → hiển thị giá trị mới
  // ============================================================
  const [name, setName] = useState("");

  // ============================================================
  // DEMO 3: Toggle boolean (bật/tắt)
  // Dùng functional update: prev => !prev
  // Đảm bảo luôn lấy đúng giá trị trước đó để đảo ngược
  // ============================================================
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ============================================================
  // DEMO 4: Quản lý Object State
  // ⚠️ QUAN TRỌNG: Không được thay đổi trực tiếp object!
  // Phải tạo object mới bằng spread operator {...prev, key: newValue}
  // Vì React so sánh reference (===), nếu cùng reference → không re-render
  // ============================================================
  const [profile, setProfile] = useState({
    firstName: "Nguyễn",
    lastName: "Văn A",
    age: 22,
  });

  // ============================================================
  // DEMO 5: Quản lý Array State
  // Tương tự object, phải tạo array mới:
  // - Thêm: [...prev, newItem]
  // - Xóa: prev.filter(item => item.id !== id)
  // - Sửa: prev.map(item => item.id === id ? {...item, ...changes} : item)
  // ============================================================
  const [fruits, setFruits] = useState(["🍎 Táo", "🍌 Chuối", "🍊 Cam"]);
  const [newFruit, setNewFruit] = useState("");

  // ============================================================
  // DEMO 6: Lazy Initialization
  // Khi initialValue phức tạp (đọc từ localStorage, tính toán nặng),
  // truyền vào một FUNCTION thay vì giá trị để tránh tính toán mỗi render.
  // Function này CHỈ chạy 1 lần duy nhất khi mount.
  // ============================================================
  const [lazyCount, setLazyCount] = useState(() => {
    // Giả lập: đọc từ localStorage (chỉ chạy 1 lần)
    console.log("🔄 Lazy initializer chạy - chỉ 1 lần khi mount!");
    const saved = localStorage.getItem("edu-lazy-count");
    return saved ? Number(saved) : 0;
  });

  // ============================================================
  // DEMO 7: Batch Update (React 18)
  // React 18 tự động batch (gom) các setState lại và chỉ re-render 1 lần.
  // Trước React 18, batch chỉ hoạt động trong event handler.
  // ============================================================
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [renderCountBatch, setRenderCountBatch] = useState(0);

  // Hàm xử lý cập nhật nhiều state cùng lúc
  const handleBatchUpdate = () => {
    // React 18 sẽ "gom" 3 setState này lại → chỉ re-render 1 lần!
    setX(prev => prev + 1);
    setY(prev => prev + 1);
    setRenderCountBatch(prev => prev + 1);
  };

  return (
    <LessonLayout
      lessonNumber="01"
      title="useState - Quản lý State cơ bản"
      description="useState là hook cơ bản và quan trọng nhất. Nó cho phép component 'ghi nhớ' dữ liệu giữa các lần render. Hiểu rõ useState là nền tảng để hiểu toàn bộ React."
    >
      {/* === CÚ PHÁP === */}
      <h3 className="edu-section-title">📝 Cú pháp</h3>
      <div className="edu-code-block">
        <div className="edu-code-header">
          <span>Cú pháp useState</span>
        </div>
        <div className="edu-code-content">
{`// Cú pháp cơ bản
const [state, setState] = useState(initialValue);

// Với lazy initialization (chỉ tính 1 lần)
const [state, setState] = useState(() => expensiveComputation());

// Cập nhật state
setState(newValue);           // Thay giá trị mới
setState(prev => prev + 1);   // Dựa trên giá trị cũ (khuyên dùng)`}
        </div>
      </div>

      {/* === DEMO 1: Counter === */}
      <h3 className="edu-section-title">🔢 Demo 1: Counter đơn giản</h3>
      <p className="edu-text">
        Ví dụ kinh điển nhất: nhấn nút để tăng/giảm số. Mỗi lần gọi <span className="edu-inline-code">setCount</span>, 
        React sẽ re-render component và hiển thị giá trị mới.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Counter</div>
        <div className="edu-flex edu-items-center edu-gap-12">
          <button className="edu-btn edu-btn-secondary" onClick={() => setCount(prev => prev - 1)}>
            ➖ Giảm
          </button>
          <span style={{ fontSize: "2rem", fontWeight: 700, minWidth: 60, textAlign: "center" }}>
            {count}
          </span>
          <button className="edu-btn edu-btn-primary" onClick={() => setCount(prev => prev + 1)}>
            ➕ Tăng
          </button>
          <button className="edu-btn edu-btn-danger" onClick={() => setCount(0)}>
            🔄 Reset
          </button>
        </div>
      </div>
      <div className="edu-info">
        <strong>💡 Giải thích:</strong> Khi bấm "Tăng", ta gọi <span className="edu-inline-code">setCount(prev =&gt; prev + 1)</span>. 
        React ghi nhận state mới và re-render component. Giá trị hiển thị trên màn hình được cập nhật.
      </div>

      {/* === DEMO 2: Input Text === */}
      <h3 className="edu-section-title">✏️ Demo 2: Controlled Input</h3>
      <p className="edu-text">
        "Controlled Input" nghĩa là giá trị của input được kiểm soát hoàn toàn bởi React state.
        Mỗi ký tự gõ vào sẽ trigger <span className="edu-inline-code">onChange → setName → re-render</span>.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Input + State</div>
        <input
          className="edu-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên của bạn..."
          style={{ width: "100%", maxWidth: 400 }}
        />
        <p className="edu-text edu-mt-8">
          👋 Xin chào, <strong style={{ color: "#818cf8" }}>{name || "..."}</strong>!
          (Độ dài: {name.length} ký tự)
        </p>
      </div>

      {/* === DEMO 3: Toggle === */}
      <h3 className="edu-section-title">🔀 Demo 3: Toggle Boolean</h3>
      <p className="edu-text">
        Toggle là pattern cực kỳ phổ biến: bật/tắt modal, dark mode, dropdown...
        Dùng <span className="edu-inline-code">setState(prev =&gt; !prev)</span> để đảo ngược.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Dark Mode Toggle</div>
        <div className="edu-flex edu-items-center edu-gap-12">
          <div
            className={`edu-toggle ${isDarkMode ? "active" : ""}`}
            onClick={() => setIsDarkMode(prev => !prev)}
          />
          <span>{isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
        </div>
        <div
          style={{
            marginTop: 12,
            padding: 16,
            borderRadius: 8,
            backgroundColor: isDarkMode ? "#1a1a2e" : "#f0f9ff",
            color: isDarkMode ? "#e2e8f0" : "#1e293b",
            transition: "all 0.3s ease",
            border: `1px solid ${isDarkMode ? "#334155" : "#bae6fd"}`,
          }}
        >
          Nội dung thay đổi theo theme: {isDarkMode ? "Đang ở chế độ tối 🌙" : "Đang ở chế độ sáng ☀️"}
        </div>
      </div>

      {/* === DEMO 4: Object State === */}
      <h3 className="edu-section-title">📦 Demo 4: Object State (Immutability)</h3>
      <p className="edu-text">
        Khi state là object, bạn <strong>KHÔNG ĐƯỢC</strong> thay đổi trực tiếp. 
        Phải tạo object mới bằng spread operator.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Cập nhật thông tin cá nhân</div>
        <div className="edu-flex edu-flex-col edu-gap-8">
          <div className="edu-flex edu-items-center edu-gap-8">
            <label style={{ minWidth: 60, fontSize: "0.85rem" }}>Họ:</label>
            <input
              className="edu-input"
              value={profile.firstName}
              onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div className="edu-flex edu-items-center edu-gap-8">
            <label style={{ minWidth: 60, fontSize: "0.85rem" }}>Tên:</label>
            <input
              className="edu-input"
              value={profile.lastName}
              onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
          <div className="edu-flex edu-items-center edu-gap-8">
            <label style={{ minWidth: 60, fontSize: "0.85rem" }}>Tuổi:</label>
            <input
              className="edu-input"
              type="number"
              value={profile.age}
              onChange={(e) => setProfile(prev => ({ ...prev, age: Number(e.target.value) }))}
            />
          </div>
        </div>
        <p className="edu-text edu-mt-8">
          Kết quả: <strong style={{ color: "#818cf8" }}>{profile.firstName} {profile.lastName}</strong>, {profile.age} tuổi
        </p>
      </div>
      <div className="edu-warning">
        <strong>⚠️ SAI:</strong> <span className="edu-inline-code">profile.name = "Mới"</span> — React không biết state đã thay đổi → KHÔNG re-render!<br/>
        <strong>✅ ĐÚNG:</strong> <span className="edu-inline-code">setProfile(prev =&gt; (&#123;...prev, name: "Mới"&#125;))</span> — Tạo object mới → React nhận ra sự thay đổi.
      </div>

      {/* === DEMO 5: Array State === */}
      <h3 className="edu-section-title">📋 Demo 5: Array State</h3>
      <p className="edu-text">
        Tương tự object, array cũng phải tạo bản sao mới. Các thao tác phổ biến:
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Danh sách trái cây</div>
        <div className="edu-flex edu-gap-8 edu-mb-16">
          <input
            className="edu-input"
            value={newFruit}
            onChange={(e) => setNewFruit(e.target.value)}
            placeholder="Thêm trái cây..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && newFruit.trim()) {
                setFruits(prev => [...prev, newFruit.trim()]);
                setNewFruit("");
              }
            }}
          />
          <button
            className="edu-btn edu-btn-success"
            onClick={() => {
              if (newFruit.trim()) {
                // Thêm phần tử: tạo array mới bằng spread + item mới
                setFruits(prev => [...prev, newFruit.trim()]);
                setNewFruit("");
              }
            }}
          >
            ➕ Thêm
          </button>
        </div>
        <ul className="edu-list">
          {fruits.map((fruit, index) => (
            <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{fruit}</span>
              <button
                className="edu-btn edu-btn-danger"
                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                onClick={() => {
                  // Xóa phần tử: filter giữ lại những item có index khác
                  setFruits(prev => prev.filter((_, i) => i !== index));
                }}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* === DEMO 6: Lazy Initialization === */}
      <h3 className="edu-section-title">⚡ Demo 6: Lazy Initialization</h3>
      <p className="edu-text">
        Khi giá trị ban đầu cần tính toán phức tạp (đọc localStorage, parse JSON...), 
        truyền vào một <strong>function</strong> thay vì giá trị trực tiếp. Function chỉ chạy 1 lần khi mount.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Đọc từ localStorage</div>
        <div className="edu-flex edu-items-center edu-gap-12">
          <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>Lazy Count: {lazyCount}</span>
          <button
            className="edu-btn edu-btn-primary"
            onClick={() => {
              const newVal = lazyCount + 1;
              setLazyCount(newVal);
              localStorage.setItem("edu-lazy-count", String(newVal));
            }}
          >
            +1 (và lưu localStorage)
          </button>
        </div>
        <p className="edu-text edu-mt-8" style={{ fontSize: "0.8rem" }}>
          🔍 Mở Console để thấy "Lazy initializer chạy" chỉ xuất hiện 1 lần khi trang load.
        </p>
      </div>
      <div className="edu-code-block">
        <div className="edu-code-header">
          <span>So sánh: Lazy vs. Không Lazy</span>
        </div>
        <div className="edu-code-content">
{`// ❌ Không lazy: heavyComputation() chạy MỌI lần render
const [data, setData] = useState(heavyComputation());

// ✅ Lazy: heavyComputation chỉ chạy 1 lần duy nhất
const [data, setData] = useState(() => heavyComputation());`}
        </div>
      </div>

      {/* === DEMO 7: Batch Update === */}
      <h3 className="edu-section-title">🔄 Demo 7: Batch Update (React 18)</h3>
      <p className="edu-text">
        React 18 tự động "gom" (batch) các setState lại với nhau và chỉ re-render 1 lần.
        Điều này giúp tối ưu hiệu suất đáng kể.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Batch 3 setState → 1 render</div>
        <div className="edu-flex edu-items-center edu-gap-16">
          <div>X: <strong>{x}</strong></div>
          <div>Y: <strong>{y}</strong></div>
          <div className="edu-render-count">🔄 Count: {renderCountBatch}</div>
        </div>
        <button className="edu-btn edu-btn-primary edu-mt-16" onClick={handleBatchUpdate}>
          Cập nhật X, Y, Count cùng lúc
        </button>
        <p className="edu-text edu-mt-8" style={{ fontSize: "0.8rem" }}>
          ☝️ Dù gọi 3 setState, React chỉ re-render 1 lần!
        </p>
      </div>

      {/* === BẢNG TỔNG KẾT === */}
      <h3 className="edu-section-title">📊 Tổng kết kiến thức</h3>
      <table className="edu-table">
        <thead>
          <tr>
            <th>Pattern</th>
            <th>Cách dùng</th>
            <th>Ví dụ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Giá trị đơn giản</td>
            <td><span className="edu-inline-code">useState(0)</span></td>
            <td>Counter, toggle</td>
          </tr>
          <tr>
            <td>Functional update</td>
            <td><span className="edu-inline-code">setState(prev =&gt; ...)</span></td>
            <td>Khi dựa vào state cũ</td>
          </tr>
          <tr>
            <td>Object state</td>
            <td><span className="edu-inline-code">&#123;...prev, key: val&#125;</span></td>
            <td>Form, profile</td>
          </tr>
          <tr>
            <td>Array state</td>
            <td><span className="edu-inline-code">[...prev, item]</span></td>
            <td>Danh sách, todo</td>
          </tr>
          <tr>
            <td>Lazy init</td>
            <td><span className="edu-inline-code">useState(() =&gt; fn())</span></td>
            <td>localStorage, computation</td>
          </tr>
        </tbody>
      </table>

      <div className="edu-tip">
        <strong>💡 Mẹo từ thầy:</strong> Khi mới học, hãy luôn dùng functional update <span className="edu-inline-code">setState(prev =&gt; ...)</span> 
        thay vì <span className="edu-inline-code">setState(value)</span>. Điều này giúp tránh bug khi React batch updates, 
        và là thói quen tốt cho production code.
      </div>
    </LessonLayout>
  );
};

export default UseStateLesson;
