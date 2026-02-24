/**
 * ============================================================
 * 📖 BÀI 4: useReducer - Quản Lý State Phức Tạp
 * ============================================================
 * 
 * 🎯 MỤC TIÊU: Hiểu khi nào và tại sao cần useReducer thay vì useState.
 * 
 * 📌 CÚ PHÁP: const [state, dispatch] = useReducer(reducer, initialState)
 * 
 * 💡 BẢN CHẤT:
 * - useReducer là "phiên bản nâng cấp" của useState.
 * - Thay vì gọi setState(newValue), bạn dispatch(action).
 * - Reducer function nhận (state, action) → trả về new state.
 * - Logic cập nhật state được tập trung vào 1 chỗ (reducer).
 * 
 * 🔑 KHI NÀO DÙNG:
 * - State có nhiều sub-values (object phức tạp)
 * - Logic cập nhật phụ thuộc vào state trước đó
 * - Nhiều event handler cùng cập nhật 1 state
 * - Muốn logic state dễ test và dễ debug
 * ============================================================
 */
import React, { useReducer } from "react";
import LessonLayout from "../LessonLayout";

// ============================================================
// DEMO: Shopping Cart
// Một ví dụ thực tế về useReducer quản lý giỏ hàng
// ============================================================

// BƯỚC 1: Định nghĩa initial state
// Tất cả dữ liệu liên quan được gom vào 1 object
const initialCartState = {
  items: [
    { id: 1, name: "📱 iPhone 16", price: 999, quantity: 1 },
    { id: 2, name: "🎧 AirPods Pro", price: 249, quantity: 2 },
  ],
  discount: 0,
  note: "",
};

// BƯỚC 2: Định nghĩa Reducer Function
// ĐÂY LÀ PURE FUNCTION: cùng input → luôn cùng output
// Không có side effects (không gọi API, không random, không Date.now)
function cartReducer(state, action) {
  switch (action.type) {
    // Thêm sản phẩm vào giỏ
    case "ADD_ITEM": {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        // Nếu đã có → tăng quantity
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      // Nếu chưa có → thêm mới
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    // Tăng số lượng
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    // Giảm số lượng (tối thiểu 1)
    case "DECREMENT":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        ),
      };

    // Xóa sản phẩm
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    // Áp dụng mã giảm giá
    case "APPLY_DISCOUNT":
      return { ...state, discount: action.payload };

    // Cập nhật ghi chú
    case "SET_NOTE":
      return { ...state, note: action.payload };

    // Xóa toàn bộ giỏ hàng
    case "CLEAR_CART":
      return { ...initialCartState, note: "", discount: 0 };

    default:
      return state;
  }
}

// Danh sách sản phẩm mẫu để thêm vào giỏ
const sampleProducts = [
  { id: 3, name: "⌨️ Magic Keyboard", price: 299 },
  { id: 4, name: "🖱️ Magic Mouse", price: 99 },
  { id: 5, name: "🖥️ Studio Display", price: 1599 },
];

const UseReducerLesson = () => {
  // BƯỚC 3: Khởi tạo useReducer
  // Trả về [state, dispatch]:
  // - state: giá trị state hiện tại (đọc)
  // - dispatch: hàm gửi action để cập nhật state
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  // Derived state: tính toán từ state hiện tại
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
  const discountAmount = subtotal * (cart.discount / 100);
  const total = subtotal - discountAmount;
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <LessonLayout
      lessonNumber="04"
      title="useReducer - Quản lý State phức tạp"
      description="useReducer giống như 'useState phiên bản Pro'. Thay vì gọi setState trực tiếp, bạn dispatch actions và reducer sẽ tính toán state mới. Tập trung logic, dễ debug, dễ test."
    >
      {/* === CÚ PHÁP === */}
      <h3 className="edu-section-title">📝 Cú pháp & Luồng hoạt động</h3>
      <div className="edu-code-block">
        <div className="edu-code-header">
          <span>Luồng: Component → dispatch(action) → reducer → new state → re-render</span>
        </div>
        <div className="edu-code-content">
{`// 1. Reducer: pure function nhận (state, action) → new state
function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT": return { ...state, count: state.count + 1 };
    case "RESET":     return { ...state, count: 0 };
    default:          return state;
  }
}

// 2. Khởi tạo trong component
const [state, dispatch] = useReducer(reducer, { count: 0 });

// 3. Dispatch action (giống "gửi lệnh")
dispatch({ type: "INCREMENT" });
dispatch({ type: "RESET" });`}
        </div>
      </div>

      {/* === SO SÁNH VỚI useState === */}
      <h3 className="edu-section-title">⚖️ So sánh useState vs useReducer</h3>
      <table className="edu-table">
        <thead>
          <tr>
            <th>Tiêu chí</th>
            <th>useState</th>
            <th>useReducer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cập nhật</td>
            <td><span className="edu-inline-code">setState(value)</span></td>
            <td><span className="edu-inline-code">dispatch(action)</span></td>
          </tr>
          <tr>
            <td>Logic</td>
            <td>Phân tán trong handlers</td>
            <td>Tập trung trong reducer</td>
          </tr>
          <tr>
            <td>Phù hợp</td>
            <td>State đơn giản (1-2 giá trị)</td>
            <td>State phức tạp (object lồng nhau)</td>
          </tr>
          <tr>
            <td>Debug</td>
            <td>Khó trace khi có nhiều setState</td>
            <td>Log action.type → biết chính xác thay đổi</td>
          </tr>
          <tr>
            <td>Testing</td>
            <td>Phải test cả component</td>
            <td>Reducer là pure function → test riêng được</td>
          </tr>
        </tbody>
      </table>

      {/* === DEMO: Shopping Cart === */}
      <h3 className="edu-section-title">🛒 Demo: Shopping Cart</h3>
      <p className="edu-text">
        Giỏ hàng là ví dụ hoàn hảo cho useReducer: nhiều hành động (thêm, xóa, tăng, giảm, 
        áp mã giảm giá...) cùng tác động lên 1 state phức tạp.
      </p>

      <div className="edu-demo">
        <div className="edu-demo-title">💡 Giỏ hàng tương tác</div>

        {/* Thêm sản phẩm */}
        <div className="edu-mb-16">
          <strong style={{ fontSize: "0.85rem" }}>Thêm sản phẩm:</strong>
          <div className="edu-flex edu-flex-wrap edu-gap-8 edu-mt-8">
            {sampleProducts.map(product => (
              <button
                key={product.id}
                className="edu-btn edu-btn-secondary"
                style={{ fontSize: "0.82rem" }}
                onClick={() => dispatch({ type: "ADD_ITEM", payload: product })}
              >
                {product.name} (${product.price})
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách giỏ hàng */}
        {cart.items.length === 0 ? (
          <p className="edu-text" style={{ textAlign: "center", color: "#94a3b8" }}>
            🛒 Giỏ hàng trống
          </p>
        ) : (
          <div>
            {cart.items.map(item => (
              <div
                key={item.id}
                className="edu-flex edu-items-center edu-justify-between"
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid var(--edu-border)",
                }}
              >
                <div>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    ${item.price} × {item.quantity} = <span style={{ color: "#34d399" }}>${item.price * item.quantity}</span>
                  </div>
                </div>
                <div className="edu-flex edu-gap-8">
                  <button
                    className="edu-btn edu-btn-secondary"
                    style={{ padding: "2px 10px" }}
                    onClick={() => dispatch({ type: "DECREMENT", payload: item.id })}
                  >
                    −
                  </button>
                  <span style={{ minWidth: 24, textAlign: "center", fontWeight: 600 }}>
                    {item.quantity}
                  </span>
                  <button
                    className="edu-btn edu-btn-secondary"
                    style={{ padding: "2px 10px" }}
                    onClick={() => dispatch({ type: "INCREMENT", payload: item.id })}
                  >
                    +
                  </button>
                  <button
                    className="edu-btn edu-btn-danger"
                    style={{ padding: "2px 10px", fontSize: "0.78rem" }}
                    onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mã giảm giá */}
        <div className="edu-flex edu-items-center edu-gap-8 edu-mt-16">
          <span style={{ fontSize: "0.85rem" }}>Giảm giá:</span>
          {[0, 10, 20, 50].map(d => (
            <button
              key={d}
              className={`edu-btn ${cart.discount === d ? "edu-btn-primary" : "edu-btn-secondary"}`}
              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
              onClick={() => dispatch({ type: "APPLY_DISCOUNT", payload: d })}
            >
              {d}%
            </button>
          ))}
        </div>

        {/* Ghi chú */}
        <div className="edu-mt-8">
          <input
            className="edu-input"
            placeholder="Ghi chú đơn hàng..."
            value={cart.note}
            onChange={(e) => dispatch({ type: "SET_NOTE", payload: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        {/* Tổng cộng */}
        <div style={{
          marginTop: 16, padding: 16, borderRadius: 8,
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)"
        }}>
          <div className="edu-flex edu-justify-between edu-mb-8">
            <span>Tổng sản phẩm:</span>
            <strong>{totalItems} items</strong>
          </div>
          <div className="edu-flex edu-justify-between edu-mb-8">
            <span>Tạm tính:</span>
            <span>${subtotal}</span>
          </div>
          {cart.discount > 0 && (
            <div className="edu-flex edu-justify-between edu-mb-8" style={{ color: "#f87171" }}>
              <span>Giảm ({cart.discount}%):</span>
              <span>-${discountAmount.toFixed(0)}</span>
            </div>
          )}
          <hr className="edu-divider" style={{ margin: "8px 0" }} />
          <div className="edu-flex edu-justify-between">
            <strong style={{ fontSize: "1.1rem" }}>Tổng cộng:</strong>
            <strong style={{ fontSize: "1.1rem", color: "#34d399" }}>${total.toFixed(0)}</strong>
          </div>
        </div>

        {/* Clear */}
        <button
          className="edu-btn edu-btn-danger edu-mt-16"
          onClick={() => dispatch({ type: "CLEAR_CART" })}
        >
          🗑️ Xóa toàn bộ giỏ hàng
        </button>
      </div>

      <div className="edu-tip">
        <strong>💡 Mẹo từ thầy:</strong> Dùng useState khi state đơn giản (boolean, string, number). 
        Chuyển sang useReducer khi: (1) có nhiều sub-values, (2) có nhiều action types, 
        (3) logic update phức tạp, hoặc (4) muốn unit test reducer riêng.
      </div>
    </LessonLayout>
  );
};

export default UseReducerLesson;
