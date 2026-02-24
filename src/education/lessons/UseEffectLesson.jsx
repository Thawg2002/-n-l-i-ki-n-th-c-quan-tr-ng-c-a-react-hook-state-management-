/**
 * ============================================================
 * 📖 BÀI 2: useEffect - Hook Xử Lý Side Effects
 * ============================================================
 * 
 * 🎯 MỤC TIÊU: Hiểu cách React giao tiếp với "thế giới bên ngoài"
 * (API, DOM, timer, event listener...) thông qua useEffect.
 * 
 * 📌 CÚ PHÁP: useEffect(callback, dependencies?)
 * 
 * 💡 BẢN CHẤT:
 * - useEffect chạy SAU khi component render xong (sau paint).
 * - Nó dùng để thực hiện các "side effects" = những thao tác
 *   NGOÀI việc tính toán UI (gọi API, đăng ký sự kiện, timer...).
 * 
 * 📋 DEPENDENCY ARRAY:
 * - useEffect(fn)           → Chạy sau MỌI lần render
 * - useEffect(fn, [])       → Chạy 1 lần sau mount (componentDidMount)
 * - useEffect(fn, [a, b])   → Chạy khi a hoặc b thay đổi
 * 
 * 🧹 CLEANUP FUNCTION:
 * - return () => { ... } bên trong useEffect
 * - Chạy TRƯỚC khi effect chạy lại, hoặc khi component unmount
 * - Dùng để dọn dẹp: clearInterval, removeEventListener, unsubscribe...
 * ============================================================
 */
import React, { useState, useEffect, useRef } from "react";
import LessonLayout from "../LessonLayout";

const UseEffectLesson = () => {
  // ============================================================
  // DEMO 1: Chạy mỗi lần render (không có dependency array)
  // Mỗi khi component re-render, effect này sẽ chạy
  // ============================================================
  const [clickCount, setClickCount] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  const renderRef = useRef(0);

  // Effect không có deps → chạy sau MỌI lần render
  useEffect(() => {
    renderRef.current += 1;
    // Không dùng setState ở đây vì sẽ gây vòng lặp vô hạn!
    // Thay vào đó dùng ref để theo dõi
  });

  // ============================================================
  // DEMO 2: Chạy 1 lần khi mount (dependency array rỗng [])
  // Giống componentDidMount trong class component
  // ============================================================
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Chỉ chạy 1 lần khi component mount
    console.log("⏰ useEffect với [] - chỉ chạy 1 lần khi mount!");
    setCurrentTime(new Date().toLocaleTimeString("vi-VN"));
  }, []); // ← [] = dependency array rỗng → chỉ chạy 1 lần

  // ============================================================
  // DEMO 3: Chạy khi dependency thay đổi
  // Theo dõi sự thay đổi của biến `searchTerm`
  // ============================================================
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Nếu searchTerm rỗng, không làm gì
    if (!searchTerm.trim()) {
      setSearchResult("");
      return;
    }

    setIsSearching(true);

    // Giả lập gọi API với setTimeout (debounce ý tưởng)
    const timer = setTimeout(() => {
      // Giả lập kết quả tìm kiếm
      setSearchResult(`Tìm thấy 42 kết quả cho "${searchTerm}"`);
      setIsSearching(false);
    }, 500);

    // 🧹 CLEANUP: Hủy timer cũ khi searchTerm thay đổi
    // Điều này tạo hiệu ứng "debounce" — chỉ tìm kiếm khi người dùng
    // ngừng gõ 500ms
    return () => {
      clearTimeout(timer);
      console.log(`🧹 Cleanup: hủy tìm kiếm "${searchTerm}"`);
    };
  }, [searchTerm]); // ← Chạy lại mỗi khi searchTerm thay đổi

  // ============================================================
  // DEMO 4: Cleanup - Timer (setInterval)
  // Minh họa tại sao cleanup quan trọng:
  // Nếu không cleanup, timer sẽ chạy mãi dù component đã unmount
  // → Memory leak!
  // ============================================================
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    // Nếu timer không chạy, không tạo interval
    if (!isTimerRunning) return;

    console.log("⏱️ Tạo interval mới");
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // 🧹 CLEANUP: Xóa interval khi:
    // 1. isTimerRunning chuyển sang false
    // 2. Component unmount
    return () => {
      console.log("🧹 Cleanup: clearInterval");
      clearInterval(interval);
    };
  }, [isTimerRunning]); // ← Chạy lại khi bật/tắt timer

  // ============================================================
  // DEMO 5: Cleanup - Event Listener
  // Theo dõi kích thước cửa sổ (window resize)
  // PHẢI removeEventListener khi unmount để tránh memory leak
  // ============================================================
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Hàm xử lý sự kiện resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Đăng ký sự kiện
    window.addEventListener("resize", handleResize);
    console.log("📐 Đã đăng ký sự kiện resize");

    // 🧹 CLEANUP: Hủy đăng ký khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      console.log("🧹 Cleanup: removeEventListener resize");
    };
  }, []); // ← [] chỉ đăng ký 1 lần khi mount

  // ============================================================
  // DEMO 6: Fetch API (thực tế nhất)
  // Gọi API lấy dữ liệu từ JSONPlaceholder
  // ============================================================
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Biến flag để xử lý race condition
    // (tránh trường hợp response cũ đến sau response mới)
    let isCancelled = false;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
        const data = await response.json();

        // Chỉ cập nhật state nếu request chưa bị hủy
        if (!isCancelled) {
          setUserData(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    // 🧹 CLEANUP: Đánh dấu request đã hủy nếu userId thay đổi
    // trước khi request hoàn thành (race condition protection)
    return () => {
      isCancelled = true;
    };
  }, [userId]); // ← Fetch lại khi userId thay đổi

  return (
    <LessonLayout
      lessonNumber="02"
      title="useEffect - Xử lý Side Effects"
      description="useEffect cho phép component tương tác với 'thế giới bên ngoài' — gọi API, đăng ký sự kiện, thao tác DOM... Đây là hook quan trọng thứ hai sau useState."
    >
      {/* === CÚ PHÁP === */}
      <h3 className="edu-section-title">📝 Cú pháp & 3 chế độ</h3>
      <div className="edu-code-block">
        <div className="edu-code-header">
          <span>3 cách dùng useEffect</span>
        </div>
        <div className="edu-code-content">
{`// 1. Không có deps → chạy sau MỌI lần render
useEffect(() => { console.log("Render!"); });

// 2. Deps rỗng [] → chạy 1 lần sau mount
useEffect(() => { console.log("Mounted!"); }, []);

// 3. Có deps [a, b] → chạy khi a hoặc b thay đổi
useEffect(() => { console.log(a, b); }, [a, b]);

// Cleanup function: trả về hàm dọn dẹp
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);  // ← cleanup
}, []);`}
        </div>
      </div>

      {/* === DEMO 2: Mount effect === */}
      <h3 className="edu-section-title">🚀 Demo 1: Chạy 1 lần khi Mount</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Ghi lại thời gian mount</div>
        <p className="edu-text">
          Component được mount lúc: <strong style={{ color: "#818cf8" }}>{currentTime}</strong>
        </p>
        <p className="edu-text" style={{ fontSize: "0.8rem" }}>
          Giá trị này không đổi khi re-render vì useEffect(fn, []) chỉ chạy 1 lần.
        </p>
      </div>

      {/* === DEMO 3: Search with debounce === */}
      <h3 className="edu-section-title">🔍 Demo 2: Tìm kiếm với Debounce + Cleanup</h3>
      <p className="edu-text">
        Mỗi khi gõ ký tự, effect cũ bị cleanup (clearTimeout), effect mới được tạo.
        Kết quả: chỉ tìm kiếm khi ngừng gõ 500ms → tiết kiệm API call.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Search Debounce</div>
        <input
          className="edu-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Gõ để tìm kiếm..."
          style={{ width: "100%", maxWidth: 400 }}
        />
        <div className="edu-mt-8">
          {isSearching && <span style={{ color: "#fbbf24" }}>⏳ Đang tìm kiếm...</span>}
          {searchResult && !isSearching && (
            <span style={{ color: "#34d399" }}>✅ {searchResult}</span>
          )}
        </div>
      </div>
      <div className="edu-info">
        <strong>💡 Bản chất Cleanup:</strong> Khi <span className="edu-inline-code">searchTerm</span> thay đổi, 
        React chạy cleanup của effect trước (clearTimeout), rồi chạy effect mới (setTimeout). 
        Nếu người dùng gõ nhanh, chỉ lần gõ cuối mới thực sự tìm kiếm.
      </div>

      {/* === DEMO 4: Timer === */}
      <h3 className="edu-section-title">⏱️ Demo 3: Timer với Cleanup</h3>
      <p className="edu-text">
        Minh họa tại sao cleanup quan trọng: nếu bạn tạo <span className="edu-inline-code">setInterval</span> mà không <span className="edu-inline-code">clearInterval</span>, 
        timer sẽ chạy mãi → <strong>memory leak</strong>!
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Stopwatch</div>
        <div className="edu-flex edu-items-center edu-gap-16">
          <span style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "monospace", minWidth: 80 }}>
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
          </span>
          <button
            className={`edu-btn ${isTimerRunning ? "edu-btn-danger" : "edu-btn-success"}`}
            onClick={() => setIsTimerRunning(prev => !prev)}
          >
            {isTimerRunning ? "⏸️ Dừng" : "▶️ Bắt đầu"}
          </button>
          <button
            className="edu-btn edu-btn-secondary"
            onClick={() => {
              setIsTimerRunning(false);
              setSeconds(0);
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* === DEMO 5: Window Resize === */}
      <h3 className="edu-section-title">📐 Demo 4: Event Listener + Cleanup</h3>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Theo dõi kích thước cửa sổ</div>
        <p className="edu-text">
          Thay đổi kích thước trình duyệt để thấy giá trị cập nhật:
        </p>
        <div className="edu-flex edu-gap-16">
          <div style={{ padding: "8px 16px", background: "rgba(99,102,241,0.1)", borderRadius: 8 }}>
            📏 Width: <strong>{windowSize.width}px</strong>
          </div>
          <div style={{ padding: "8px 16px", background: "rgba(236,72,153,0.1)", borderRadius: 8 }}>
            📐 Height: <strong>{windowSize.height}px</strong>
          </div>
        </div>
      </div>

      {/* === DEMO 6: Fetch API === */}
      <h3 className="edu-section-title">🌐 Demo 5: Fetch API (Thực tế)</h3>
      <p className="edu-text">
        Đây là use-case phổ biến nhất: gọi API khi component mount hoặc khi params thay đổi.
        Lưu ý xử lý loading, error, và <strong>race condition</strong>.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Fetch User từ API</div>
        <div className="edu-flex edu-items-center edu-gap-8 edu-mb-16">
          <span>Chọn User ID:</span>
          {[1, 2, 3, 4, 5].map((id) => (
            <button
              key={id}
              className={`edu-btn ${userId === id ? "edu-btn-primary" : "edu-btn-secondary"}`}
              style={{ padding: "4px 12px", fontSize: "0.82rem" }}
              onClick={() => setUserId(id)}
            >
              {id}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && <p style={{ color: "#fbbf24" }}>⏳ Đang tải...</p>}

        {/* Error state */}
        {error && <p style={{ color: "#f87171" }}>❌ Lỗi: {error}</p>}

        {/* Success state */}
        {userData && !loading && (
          <div style={{ padding: 12, background: "rgba(16,185,129,0.08)", borderRadius: 8 }}>
            <div><strong>👤 Tên:</strong> {userData.name}</div>
            <div><strong>📧 Email:</strong> {userData.email}</div>
            <div><strong>🏢 Công ty:</strong> {userData.company?.name}</div>
            <div><strong>🌐 Website:</strong> {userData.website}</div>
          </div>
        )}
      </div>
      <div className="edu-warning">
        <strong>⚠️ Race Condition:</strong> Khi user click nhanh ID 1 → 2 → 3, có thể response của ID 1 đến sau ID 3. 
        Dùng biến <span className="edu-inline-code">isCancelled</span> trong cleanup để chỉ sử dụng response mới nhất.
      </div>

      {/* === BẢNG SO SÁNH === */}
      <h3 className="edu-section-title">📊 Bảng so sánh Dependency Array</h3>
      <table className="edu-table">
        <thead>
          <tr>
            <th>Dependency</th>
            <th>Khi nào chạy</th>
            <th>Tương đương Class</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Không truyền</td>
            <td>Sau mỗi render</td>
            <td>componentDidUpdate (mọi lần)</td>
          </tr>
          <tr>
            <td><span className="edu-inline-code">[]</span></td>
            <td>1 lần sau mount</td>
            <td>componentDidMount</td>
          </tr>
          <tr>
            <td><span className="edu-inline-code">[a, b]</span></td>
            <td>Khi a hoặc b đổi</td>
            <td>componentDidUpdate (có điều kiện)</td>
          </tr>
          <tr>
            <td>Cleanup return</td>
            <td>Trước re-run / unmount</td>
            <td>componentWillUnmount</td>
          </tr>
        </tbody>
      </table>

      <div className="edu-tip">
        <strong>💡 Mẹo từ thầy:</strong> Luôn tự hỏi 3 câu khi dùng useEffect:<br/>
        1. Effect này cần chạy lúc nào? → Xác định dependency array.<br/>
        2. Effect tạo ra thứ gì cần dọn dẹp? → Viết cleanup function.<br/>
        3. Có race condition không? → Dùng flag <span className="edu-inline-code">isCancelled</span> hoặc AbortController.
      </div>
    </LessonLayout>
  );
};

export default UseEffectLesson;
