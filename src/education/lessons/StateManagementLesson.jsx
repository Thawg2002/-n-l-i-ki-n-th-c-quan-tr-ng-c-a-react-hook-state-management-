/**
 * ============================================================
 * 📖 BÀI 14: State Management - Quản Lý State Toàn Cục
 * ============================================================
 * 
 * So sánh 3 cách quản lý state phổ biến trong React:
 * 1. Context API (built-in React)
 * 2. Zustand (lightweight, modern)
 * 3. Redux Toolkit (powerful, enterprise)
 * 
 * Mỗi phần đều có demo tương tác cùng chức năng (Todo List)
 * để dễ so sánh cách viết code giữa từng thư viện.
 * ============================================================
 */
import React, { useState, useContext, useReducer, createContext } from "react";
import { create } from "zustand";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";
import LessonLayout from "../LessonLayout";

// ============================================================
// SECTION 1: CONTEXT API — Built-in React
// ============================================================

const TodoContext = createContext();

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case "TOGGLE":
      return state.map(t => t.id === action.payload ? { ...t, done: !t.done } : t);
    case "DELETE":
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
};

const TodoProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, [
    { id: 1, text: "Học React Hooks", done: true },
    { id: 2, text: "Học State Management", done: false },
  ]);
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

const ContextTodoApp = () => {
  const { todos, dispatch } = useContext(TodoContext);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch({ type: "ADD", payload: input.trim() });
    setInput("");
  };

  return (
    <div>
      <div className="edu-flex edu-gap-8 edu-mb-12">
        <input className="edu-input" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Thêm todo..." style={{ flex: 1 }}
          onKeyDown={e => e.key === "Enter" && handleAdd()} />
        <button className="edu-btn edu-btn-primary" onClick={handleAdd}>➕ Thêm</button>
      </div>
      {todos.map(todo => (
        <div key={todo.id} className="edu-flex edu-items-center edu-gap-8"
          style={{ padding: "6px 0", borderBottom: "1px solid var(--edu-border)" }}>
          <span onClick={() => dispatch({ type: "TOGGLE", payload: todo.id })}
            style={{ cursor: "pointer", textDecoration: todo.done ? "line-through" : "none",
              opacity: todo.done ? 0.5 : 1, flex: 1 }}>
            {todo.done ? "✅" : "⬜"} {todo.text}
          </span>
          <button className="edu-btn edu-btn-danger" style={{ padding: "2px 8px", fontSize: "0.75rem" }}
            onClick={() => dispatch({ type: "DELETE", payload: todo.id })}>🗑️</button>
        </div>
      ))}
      <div className="edu-mt-8" style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
        Tổng: {todos.length} | Hoàn thành: {todos.filter(t => t.done).length}
      </div>
    </div>
  );
};

// ============================================================
// SECTION 2: ZUSTAND — Lightweight & Modern
// ============================================================

const useZustandTodoStore = create((set) => ({
  todos: [
    { id: 1, text: "Học React Hooks", done: true },
    { id: 2, text: "Học Zustand", done: false },
  ],
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), text, done: false }],
  })),
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(t => t.id === id ? { ...t, done: !t.done } : t),
  })),
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(t => t.id !== id),
  })),
}));

const ZustandTodoApp = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useZustandTodoStore();
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input.trim());
    setInput("");
  };

  return (
    <div>
      <div className="edu-flex edu-gap-8 edu-mb-12">
        <input className="edu-input" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Thêm todo..." style={{ flex: 1 }}
          onKeyDown={e => e.key === "Enter" && handleAdd()} />
        <button className="edu-btn edu-btn-success" onClick={handleAdd}>➕ Thêm</button>
      </div>
      {todos.map(todo => (
        <div key={todo.id} className="edu-flex edu-items-center edu-gap-8"
          style={{ padding: "6px 0", borderBottom: "1px solid var(--edu-border)" }}>
          <span onClick={() => toggleTodo(todo.id)}
            style={{ cursor: "pointer", textDecoration: todo.done ? "line-through" : "none",
              opacity: todo.done ? 0.5 : 1, flex: 1 }}>
            {todo.done ? "✅" : "⬜"} {todo.text}
          </span>
          <button className="edu-btn edu-btn-danger" style={{ padding: "2px 8px", fontSize: "0.75rem" }}
            onClick={() => deleteTodo(todo.id)}>🗑️</button>
        </div>
      ))}
      <div className="edu-mt-8" style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
        Tổng: {todos.length} | Hoàn thành: {todos.filter(t => t.done).length}
      </div>
    </div>
  );
};

// ============================================================
// SECTION 3: REDUX TOOLKIT — Powerful & Enterprise
// ============================================================

const reduxTodoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [
      { id: 1, text: "Học React Hooks", done: true },
      { id: 2, text: "Học Redux Toolkit", done: false },
    ],
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push({ id: Date.now(), text: action.payload, done: false });
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
  },
});

const { addTodo: reduxAddTodo, toggleTodo: reduxToggleTodo, deleteTodo: reduxDeleteTodo } = reduxTodoSlice.actions;

const reduxStore = configureStore({
  reducer: { todos: reduxTodoSlice.reducer },
});

const ReduxTodoContent = () => {
  const todos = useSelector(state => state.todos.items);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch(reduxAddTodo(input.trim()));
    setInput("");
  };

  return (
    <div>
      <div className="edu-flex edu-gap-8 edu-mb-12">
        <input className="edu-input" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Thêm todo..." style={{ flex: 1 }}
          onKeyDown={e => e.key === "Enter" && handleAdd()} />
        <button className="edu-btn edu-btn-secondary" onClick={handleAdd}
          style={{ background: "#7c3aed", borderColor: "#7c3aed" }}>➕ Thêm</button>
      </div>
      {todos.map(todo => (
        <div key={todo.id} className="edu-flex edu-items-center edu-gap-8"
          style={{ padding: "6px 0", borderBottom: "1px solid var(--edu-border)" }}>
          <span onClick={() => dispatch(reduxToggleTodo(todo.id))}
            style={{ cursor: "pointer", textDecoration: todo.done ? "line-through" : "none",
              opacity: todo.done ? 0.5 : 1, flex: 1 }}>
            {todo.done ? "✅" : "⬜"} {todo.text}
          </span>
          <button className="edu-btn edu-btn-danger" style={{ padding: "2px 8px", fontSize: "0.75rem" }}
            onClick={() => dispatch(reduxDeleteTodo(todo.id))}>🗑️</button>
        </div>
      ))}
      <div className="edu-mt-8" style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
        Tổng: {todos.length} | Hoàn thành: {todos.filter(t => t.done).length}
      </div>
    </div>
  );
};

const ReduxTodoApp = () => (
  <Provider store={reduxStore}>
    <ReduxTodoContent />
  </Provider>
);

// ============================================================
// MAIN LESSON COMPONENT
// ============================================================
const StateManagementLesson = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "📖 Tổng quan" },
    { key: "context", label: "🔗 Context API" },
    { key: "zustand", label: "🐻 Zustand" },
    { key: "redux", label: "🟣 Redux Toolkit" },
    { key: "compare", label: "⚖️ So sánh chi tiết" },
  ];

  return (
    <LessonLayout lessonNumber="14" title="State Management - Quản lý State toàn cục"
      description="Khi app phức tạp, useState và useContext không đủ. Hãy tìm hiểu các thư viện quản lý state phổ biến: Context API, Zustand, và Redux Toolkit.">
      
      {/* Tab Navigation */}
      <div className="edu-flex edu-gap-8 edu-mb-24 edu-flex-wrap">
        {tabs.map(tab => (
          <button key={tab.key}
            className={`edu-btn ${activeTab === tab.key ? "edu-btn-primary" : "edu-btn-secondary"}`}
            onClick={() => setActiveTab(tab.key)} style={{ fontSize: "0.85rem" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============ TAB: TỔNG QUAN ============ */}
      {activeTab === "overview" && (
        <div>
          <h3 className="edu-section-title">🏠 Ví dụ thực tế để hiểu State Management</h3>
          <div className="edu-info">
            <strong>Hãy tưởng tượng một quán cà phê:</strong>
            <ul className="edu-list">
              <li><strong>useState + Props</strong> = Bạn tự nhớ order trong đầu → chỉ bạn biết, muốn cho người khác biết phải nói trực tiếp từng người</li>
              <li><strong>Context API</strong> = Ghi order lên bảng trắng trong quán → ai cũng XEM được, nhưng mỗi lần thay đổi thì CẢ QUÁN phải nhìn lại bảng</li>
              <li><strong>Zustand</strong> = App đặt hàng → chỉ ai quan tâm mới nhận thông báo, đơn giản dễ dùng, nhẹ nhàng</li>
              <li><strong>Redux</strong> = Hệ thống POS chuyên nghiệp → mạnh mẽ, log mọi thay đổi, có camera quay lại (time-travel), nhưng setup phức tạp hơn</li>
            </ul>
          </div>

          <h3 className="edu-section-title">🤔 Khi nào cần State Management?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="edu-tip">
              <strong>✅ useState + Props ĐỦ khi:</strong>
              <ul className="edu-list">
                <li>State chỉ dùng trong 1-2 component</li>
                <li>Truyền data qua 1-2 cấp component</li>
                <li>App nhỏ, ít trang (landing page, portfolio)</li>
                <li>State đơn giản (toggle, form input)</li>
              </ul>
            </div>
            <div className="edu-warning">
              <strong>⚠️ CẦN State Management khi:</strong>
              <ul className="edu-list">
                <li>Nhiều component ở các cấp khác nhau cần cùng data</li>
                <li>Prop drilling quá 3+ cấp (truyền props xuyên qua component không dùng)</li>
                <li>State phức tạp (user auth, giỏ hàng, notifications)</li>
                <li>Cần DevTools để debug state changes</li>
                <li>Team lớn, cần quy chuẩn code rõ ràng</li>
              </ul>
            </div>
          </div>

          <h3 className="edu-section-title">😵 Prop Drilling là gì? Tại sao nó tệ?</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Ví dụ Prop Drilling — truyền user qua 4 cấp!</span></div>
            <div className="edu-code-content">
{`// ❌ PROP DRILLING — truyền "user" qua từng component dù chỉ cần ở cuối
function App() {
  const [user, setUser] = useState({ name: "Thắng" });
  return <Dashboard user={user} />;        // Cấp 1: truyền xuống
}

function Dashboard({ user }) {              // Cấp 2: nhận nhưng KHÔNG dùng
  return <Sidebar user={user} />;           // → chỉ truyền tiếp!
}

function Sidebar({ user }) {                // Cấp 3: nhận nhưng KHÔNG dùng
  return <UserInfo user={user} />;          // → chỉ truyền tiếp!
}

function UserInfo({ user }) {               // Cấp 4: MỚI THỰC SỰ DÙNG
  return <p>Xin chào {user.name}</p>;
}

// 😵 Dashboard và Sidebar phải nhận "user" dù không dùng
// → Khó maintain, khó refactor, thêm prop = sửa 4 file!`}
            </div>
          </div>

          <div className="edu-tip">
            <strong>💡 State Management giải quyết vấn đề này:</strong> Thay vì truyền qua từng cấp, 
            component nào cần thì tự "lấy" từ store/context. Giống như thay vì chuyền tay tin nhắn qua 
            10 người, bạn post lên group chat để ai cần thì đọc.
          </div>

          <h3 className="edu-section-title">🗺️ Sơ đồ quyết định chọn giải pháp</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Decision Tree — chọn State Management nào?</span></div>
            <div className="edu-code-content">
{`Bạn cần chia sẻ state giữa các component?
│
├── ❌ Không → useState + props là đủ ✅
│
└── ✅ Có → Bao nhiêu component cần?
    │
    ├── 2-5 component, state đơn giản
    │   └── useContext + useReducer ✅ (không cần cài gì thêm)
    │
    └── Nhiều component, state phức tạp
        │
        ├── Bạn muốn đơn giản, ít boilerplate?
        │   └── 🐻 Zustand ✅ (cài: npm i zustand, ~1KB)
        │       → Phù hợp 80% projects
        │
        └── Bạn cần DevTools mạnh, team lớn, app cực phức tạp?
            └── 🟣 Redux Toolkit ✅ (cài: npm i @reduxjs/toolkit react-redux)
                → Enterprise, banking, e-commerce lớn

📌 Ngoài ra:
   • Server State (API data) → TanStack Query / SWR (khác với client state)
   • Form State → React Hook Form / Formik`}
            </div>
          </div>
        </div>
      )}

      {/* ============ TAB: CONTEXT API ============ */}
      {activeTab === "context" && (
        <div>
          <h3 className="edu-section-title">🔗 Context API — Built-in React</h3>
          <div className="edu-info">
            <strong>Context API</strong> là giải pháp state management <strong>có sẵn</strong> trong React. 
            Không cần cài thêm thư viện. Phù hợp cho state đơn giản (theme, locale, auth).
          </div>

          <h3 className="edu-section-title">🏠 Ví dụ thực tế</h3>
          <div className="edu-demo" style={{ borderColor: "rgba(99,102,241,0.3)" }}>
            <div className="edu-demo-title">🏡 Giống như bảng thông báo trong gia đình</div>
            <p className="edu-text">
              Bạn dán tờ giấy "Tối nay ăn phở" lên tủ lạnh (Provider). 
              Ai trong nhà (Consumer) muốn biết thì nhìn tủ lạnh. 
              Nhưng <strong>mỗi khi bạn thay đổi tờ giấy → CẢ NHÀ phải ra nhìn lại</strong>, 
              kể cả người không quan tâm bữa tối.
            </p>
          </div>

          <h3 className="edu-section-title">📝 Cách hoạt động — 3 bước</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Context API — Setup step by step</span></div>
            <div className="edu-code-content">
{`// ============ BƯỚC 1: Tạo Context ============
// Giống như TẠO một "kênh phát sóng" để chia sẻ data
const TodoContext = createContext();
// Context chứa: createContext() → tạo "kênh"

// ============ BƯỚC 2: Tạo Provider ============
// Giống như "đài phát sóng" — bọc quanh component tree
const TodoProvider = ({ children }) => {
  // State + logic xử lý
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  
  // "Phát sóng" data qua value prop
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}  {/* ← Tất cả con đều nhận được data */}
    </TodoContext.Provider>
  );
};

// ============ BƯỚC 3: Sử dụng trong Component con ============
// Giống như "bật radio" — tune vào kênh để nhận data
const TodoList = () => {
  const { todos, dispatch } = useContext(TodoContext);
  // ↑ Giờ có thể dùng todos và dispatch từ BẤT KỲ đâu
  
  // Thêm todo: phải dispatch action object
  dispatch({ type: "ADD", payload: "Học React" });
  // ↑ Phải nhớ đúng type string → dễ typo, không autocomplete
};`}
            </div>
          </div>

          <h3 className="edu-section-title">🎯 Demo: Todo App với Context</h3>
          <div className="edu-demo">
            <div className="edu-demo-title">💡 Context + useReducer</div>
            <TodoProvider>
              <ContextTodoApp />
            </TodoProvider>
          </div>

          <h3 className="edu-section-title">📊 Phân tích ưu/nhược điểm</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="edu-tip">
              <strong>✅ Ưu điểm</strong>
              <ul className="edu-list">
                <li><strong>Miễn phí:</strong> Built-in React, 0KB thêm</li>
                <li><strong>Quen thuộc:</strong> Dùng hooks bình thường</li>
                <li><strong>Không dependency:</strong> Không lo outdated</li>
                <li><strong>Đủ tốt cho:</strong> theme, locale, auth role</li>
              </ul>
            </div>
            <div className="edu-warning">
              <strong>⚠️ Nhược điểm nghiêm trọng</strong>
              <ul className="edu-list">
                <li><strong>Re-render CẢ tree:</strong> Provider value thay đổi → TẤT CẢ consumer re-render, kể cả component chỉ dùng 1 phần state!</li>
                <li><strong>Không DevTools:</strong> Không thể debug state changes</li>
                <li><strong>Provider Hell:</strong> 5 context = 5 lớp Provider lồng nhau</li>
                <li><strong>Không selector:</strong> Không thể chọn "chỉ lấy 1 field" từ state</li>
              </ul>
            </div>
          </div>

          <div className="edu-code-block">
            <div className="edu-code-header"><span>⚠️ Provider Hell — khi dùng nhiều Context</span></div>
            <div className="edu-code-content">
{`// 😵 5 Contexts = 5 lớp Provider lồng nhau!
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <NotificationProvider>
              <MyApp />      {/* ← Component thật nằm tận đây */}
            </NotificationProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
// → Khó đọc, khó maintain, khó test!
// → Zustand giải quyết: KHÔNG CẦN Provider`}
            </div>
          </div>
        </div>
      )}

      {/* ============ TAB: ZUSTAND ============ */}
      {activeTab === "zustand" && (
        <div>
          <h3 className="edu-section-title">🐻 Zustand — Lightweight & Modern</h3>
          <div className="edu-info">
            <strong>Zustand</strong> ("state" trong tiếng Đức) là thư viện state management 
            siêu nhẹ (~1KB). Cú pháp đơn giản, không cần Provider wrapper. 
            <strong> Hiện tại là lựa chọn #1</strong> trong cộng đồng React cho hầu hết dự án.
          </div>

          <h3 className="edu-section-title">🏠 Ví dụ thực tế</h3>
          <div className="edu-demo" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
            <div className="edu-demo-title">📱 Giống như app nhắn tin nhóm</div>
            <p className="edu-text">
              Bạn tạo 1 group chat (store). Ai muốn nhận tin thì <strong>tự join</strong> (subscribe). 
              Khi có tin mới → <strong>chỉ người trong group nhận</strong>, người ngoài không bị ảnh hưởng. 
              Không cần "admin" bọc group (không cần Provider). Đơn giản, hiệu quả!
            </p>
          </div>

          <h3 className="edu-section-title">📝 So sánh setup: Context vs Zustand</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Context API cần 15+ dòng setup...</span></div>
            <div className="edu-code-content">
{`// ❌ Context API — cần 15+ dòng để setup
const TodoContext = createContext();                    // 1. tạo context
const todoReducer = (state, action) => { ... };        // 2. viết reducer
const TodoProvider = ({ children }) => {               // 3. tạo provider
  const [todos, dispatch] = useReducer(reducer, []);   // 4. setup state
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>  // 5. bọc provider
      {children}
    </TodoContext.Provider>
  );
};
// Sử dụng: phải bọc Provider ở App level
// <TodoProvider><App/></TodoProvider>
// Trong component: const { todos } = useContext(TodoContext);
// Thêm todo: dispatch({ type: "ADD", payload: "..." }); ← dài!`}
            </div>
          </div>

          <div className="edu-code-block">
            <div className="edu-code-header"><span>✅ Zustand chỉ cần 8 dòng!</span></div>
            <div className="edu-code-content">
{`// ✅ Zustand — state + actions trong 1 object, XONG!
import { create } from "zustand";

const useTodoStore = create((set) => ({
  todos: [],
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), text, done: false }],
  })),
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(t => t.id === id ? { ...t, done: !t.done } : t),
  })),
}));

// Sử dụng: KHÔNG cần Provider, dùng NGAY!
// const { todos, addTodo } = useTodoStore();
// addTodo("Học Zustand"); ← gọn! Không cần dispatch!`}
            </div>
          </div>

          <h3 className="edu-section-title">🎯 Demo: Todo App với Zustand</h3>
          <div className="edu-demo">
            <div className="edu-demo-title">💡 Zustand — không cần Provider!</div>
            <ZustandTodoApp />
          </div>

          <h3 className="edu-section-title">🔥 3 điểm khiến Zustand "đỉnh"</h3>
          
          <div className="edu-demo" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
            <div className="edu-demo-title">1️⃣ Không cần Provider</div>
            <div className="edu-code-block" style={{ margin: "8px 0" }}>
              <div className="edu-code-content">
{`// Context: PHẢI bọc Provider
<TodoProvider>
  <CartProvider>
    <App />
  </CartProvider>
</TodoProvider>

// Zustand: KHÔNG cần bọc gì cả!
<App />  // ← Dùng store trực tiếp trong bất kỳ component nào`}
              </div>
            </div>
          </div>

          <div className="edu-demo" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
            <div className="edu-demo-title">2️⃣ Chỉ re-render component cần thiết</div>
            <div className="edu-code-block" style={{ margin: "8px 0" }}>
              <div className="edu-code-content">
{`// Selector: chỉ lấy đúng phần state cần dùng
const count = useTodoStore((state) => state.todos.length);
// ↑ Component này CHỈ re-render khi todos.length thay đổi
// Nếu text todo thay đổi → KHÔNG re-render! 

// Context: KHÔNG làm được điều này
// → Bất kỳ thay đổi nào trong value → CẢ tree re-render`}
              </div>
            </div>
          </div>

          <div className="edu-demo" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
            <div className="edu-demo-title">3️⃣ Dùng được NGOÀI React component</div>
            <div className="edu-code-block" style={{ margin: "8px 0" }}>
              <div className="edu-code-content">
{`// ✅ Zustand: dùng store ngoài component (utility, API handler...)
const addTodo = useTodoStore.getState().addTodo;
addTodo("từ bên ngoài React!");  // ← OK!

// Subscribe để lắng nghe thay đổi
useTodoStore.subscribe((state) => {
  console.log("Todos changed:", state.todos);
});

// ❌ Context: BẮT BUỘC phải dùng trong React component
// useContext() throws error nếu gọi ngoài component`}
              </div>
            </div>
          </div>

          <div className="edu-code-block">
            <div className="edu-code-header"><span>💾 Zustand Persist — lưu localStorage tự động</span></div>
            <div className="edu-code-content">
{`import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 })),
    }),
    { name: "my-store" } // ← key trong localStorage
  )
);
// Reload trang → state vẫn còn! ✨
// Không cần tự viết localStorage.getItem/setItem`}
            </div>
          </div>
        </div>
      )}

      {/* ============ TAB: REDUX TOOLKIT ============ */}
      {activeTab === "redux" && (
        <div>
          <h3 className="edu-section-title">🟣 Redux Toolkit — Enterprise Solution</h3>
          <div className="edu-info">
            <strong>Redux Toolkit (RTK)</strong> là cách viết Redux hiện đại. So với Redux cũ, 
            RTK giảm 70% boilerplate. Là lựa chọn #1 cho enterprise app nhờ DevTools mạnh mẽ, 
            middleware phong phú, và ecosystem rộng lớn.
          </div>

          <h3 className="edu-section-title">🏠 Ví dụ thực tế</h3>
          <div className="edu-demo" style={{ borderColor: "rgba(124,58,237,0.3)" }}>
            <div className="edu-demo-title">🏦 Giống như hệ thống ngân hàng</div>
            <p className="edu-text">
              Mọi giao dịch (action) đều phải qua quầy giao dịch (dispatch) → nhân viên xử lý (reducer) 
              → cập nhật sổ sách (store). Có camera ghi lại mọi giao dịch (DevTools, time-travel). 
              <strong> Cực kỳ an toàn và truy vết được</strong>, nhưng quy trình <strong>nhiều bước hơn</strong> 
              so với rút tiền ATM (Zustand).
            </p>
          </div>

          <h3 className="edu-section-title">📝 Kiến trúc Redux — Luồng dữ liệu 1 chiều</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>One-way Data Flow — hiểu rõ luồng data</span></div>
            <div className="edu-code-content">
{`// Redux data flow — LUÔN đi theo 1 chiều:
//
// Component ──dispatch(action)──→ Reducer ──update──→ Store
//     ↑                                                  │
//     └──────────── useSelector (subscribe) ←────────────┘
//
// Ví dụ cụ thể:
// 1. User click "Thêm todo"
// 2. Component gọi: dispatch(addTodo("Học Redux"))
// 3. Reducer nhận action → tạo state mới (push todo vào array)
// 4. Store lưu state mới
// 5. Component dùng useSelector → nhận state mới → re-render
//
// 🔑 Tại sao 1 chiều?
// → Dễ debug: biết chính xác AI thay đổi state, KHI NÀO, NHƯ THẾ NÀO
// → DevTools ghi lại TỪNG action → có thể "quay lại" bất kỳ thời điểm nào`}
            </div>
          </div>

          <h3 className="edu-section-title">📝 Setup Redux Toolkit — 4 bước</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Redux Toolkit — chi tiết từng bước</span></div>
            <div className="edu-code-content">
{`import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

// ========= BƯỚC 1: Tạo Slice =========
// Slice = state + reducers + actions — gói gọn trong 1 chỗ
const todoSlice = createSlice({
  name: "todos",                        // ← tên slice (prefix cho actions)
  initialState: { items: [] },          // ← state ban đầu
  reducers: {
    // ✅ RTK dùng Immer → viết code "mutate" nhưng thực tế immutable!
    addTodo: (state, action) => {
      state.items.push({                // ← TRÔNG như mutate, nhưng OK!
        id: Date.now(), 
        text: action.payload,           // ← payload = data gửi kèm action
        done: false 
      });
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done; // ← Immer cho phép mutate trực tiếp
    },
  },
});

// ========= BƯỚC 2: Export Actions =========
// RTK TỰ ĐỘNG tạo action creators từ reducers!
export const { addTodo, toggleTodo } = todoSlice.actions;
// addTodo("Học Redux") → { type: "todos/addTodo", payload: "Học Redux" }

// ========= BƯỚC 3: Tạo Store =========
const store = configureStore({
  reducer: {
    todos: todoSlice.reducer,           // ← đăng ký slice vào store
    // có thể thêm nhiều slices: user: userSlice.reducer, ...
  },
});

// ========= BƯỚC 4: Sử dụng =========
// 4a. Bọc Provider ở root (main.jsx)
// <Provider store={store}><App /></Provider>

// 4b. Trong component:
function TodoList() {
  const todos = useSelector(state => state.todos.items); // ← LẤY state
  const dispatch = useDispatch();                        // ← LẤY dispatch
  
  dispatch(addTodo("Học Redux"));      // ← GỬI action
  // → dispatch là BẮTBUỘC, không gọi action trực tiếp như Zustand
}`}
            </div>
          </div>

          <h3 className="edu-section-title">🎯 Demo: Todo App với Redux Toolkit</h3>
          <div className="edu-demo">
            <div className="edu-demo-title">💡 Redux Toolkit — self-contained Provider</div>
            <ReduxTodoApp />
          </div>

          <h3 className="edu-section-title">🔥 Redux DevTools — Vũ khí mạnh nhất</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>DevTools — tại sao Redux "thắng" ở enterprise</span></div>
            <div className="edu-code-content">
{`// 🔍 Redux DevTools extension (Chrome/Firefox):
//
// 1. TIME-TRAVEL DEBUGGING
//    → Quay lại bất kỳ action nào trong quá khứ
//    → Xem state trước/sau mỗi action
//    → "Undo" action: state trở về trạng thái trước
//
// 2. ACTION LOG
//    → Ghi lại MỌI action: type, payload, timestamp
//    → Biết chính xác: AI dispatch, KHI NÀO, DATA gì
//    → Ví dụ: "todos/addTodo" at 10:30:15 — payload: "Mua sữa"
//
// 3. STATE DIFF
//    → Xem chính xác field nào thay đổi sau mỗi action
//    → Giống "git diff" cho state
//
// 4. EXPORT/IMPORT STATE
//    → Export state → gửi cho teammate debug
//    → Import state → reproduce bug chính xác
//
// 💡 Với Zustand: có thể dùng devtools middleware nhưng
//    không mạnh bằng Redux DevTools (thiếu time-travel)`}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="edu-tip">
              <strong>✅ Ưu điểm Redux Toolkit</strong>
              <ul className="edu-list">
                <li>DevTools tốt nhất (time-travel debugging)</li>
                <li>Immer built-in (mutate trực tiếp)</li>
                <li>Middleware mạnh (thunk, saga, logger)</li>
                <li>RTK Query cho data fetching (thay thế React Query)</li>
                <li>Community & ecosystem lớn nhất</li>
                <li>Predictable — 1 source of truth, 1-way flow</li>
              </ul>
            </div>
            <div className="edu-warning">
              <strong>⚠️ Nhược điểm</strong>
              <ul className="edu-list">
                <li>Boilerplate nhiều hơn Zustand (slice + store + Provider)</li>
                <li>Learning curve cao (actions, reducers, selectors, middleware)</li>
                <li>Cần Provider wrapper</li>
                <li>Bundle size lớn hơn (~10KB vs ~1KB Zustand)</li>
                <li>Overkill cho app nhỏ-trung bình</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============ TAB: SO SÁNH CHI TIẾT ============ */}
      {activeTab === "compare" && (
        <div>
          <h3 className="edu-section-title">⚖️ Bảng so sánh toàn diện</h3>
          
          <table className="edu-table">
            <thead>
              <tr><th style={{width:"18%"}}>Tiêu chí</th><th>🔗 Context API</th><th>🐻 Zustand</th><th>🟣 Redux Toolkit</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Cài đặt</strong></td>
                <td style={{color:"#34d399"}}>Không cần (built-in)</td>
                <td><code>npm i zustand</code> (~1KB)</td>
                <td><code>npm i @reduxjs/toolkit react-redux</code> (~10KB)</td>
              </tr>
              <tr>
                <td><strong>Setup code</strong></td>
                <td>createContext + Provider + useReducer (15+ dòng)</td>
                <td style={{color:"#34d399"}}>{"create(set => {...})"} (8 dòng)</td>
                <td>createSlice + configureStore + Provider (20+ dòng)</td>
              </tr>
              <tr>
                <td><strong>Provider</strong></td>
                <td style={{color:"#f87171"}}>BẮT BUỘC bọc component tree</td>
                <td style={{color:"#34d399"}}>KHÔNG CẦN! ← điểm khác biệt lớn</td>
                <td style={{color:"#f87171"}}>BẮT BUỘC bọc component tree</td>
              </tr>
              <tr>
                <td><strong>Cập nhật state</strong></td>
                <td>dispatch({"{ type: 'ADD', payload }"})</td>
                <td style={{color:"#34d399"}}>addTodo("text") ← gọi trực tiếp!</td>
                <td>dispatch(addTodo("text"))</td>
              </tr>
              <tr>
                <td><strong>Re-render</strong></td>
                <td style={{color:"#f87171"}}>CẢ tree consumer re-render khi value thay đổi</td>
                <td style={{color:"#34d399"}}>Chỉ component subscribe state đó</td>
                <td style={{color:"#34d399"}}>Chỉ component dùng useSelector cho phần đó</td>
              </tr>
              <tr>
                <td><strong>Selector (lọc state)</strong></td>
                <td style={{color:"#f87171"}}>❌ Không hỗ trợ — lấy cả object</td>
                <td style={{color:"#34d399"}}>{"useStore(s => s.count)"} ← lấy đúng field</td>
                <td style={{color:"#34d399"}}>{"useSelector(s => s.todos.items)"}</td>
              </tr>
              <tr>
                <td><strong>DevTools</strong></td>
                <td style={{color:"#f87171"}}>❌ Không có</td>
                <td>✅ Devtools middleware (cơ bản)</td>
                <td style={{color:"#34d399"}}>✅✅ Redux DevTools (time-travel, action log, state diff)</td>
              </tr>
              <tr>
                <td><strong>Middleware</strong></td>
                <td style={{color:"#f87171"}}>❌ Không</td>
                <td>persist, devtools, immer, subscribeWithSelector</td>
                <td style={{color:"#34d399"}}>thunk, saga, logger, RTK Query, listener</td>
              </tr>
              <tr>
                <td><strong>Async (API call)</strong></td>
                <td>Tự handle bằng useEffect</td>
                <td>Gọi async trực tiếp trong action</td>
                <td style={{color:"#34d399"}}>createAsyncThunk / RTK Query (mạnh nhất)</td>
              </tr>
              <tr>
                <td><strong>Dùng ngoài React</strong></td>
                <td style={{color:"#f87171"}}>❌ Không thể (hooks-only)</td>
                <td style={{color:"#34d399"}}>✅ getState() / subscribe()</td>
                <td style={{color:"#34d399"}}>✅ store.getState() / subscribe()</td>
              </tr>
              <tr>
                <td><strong>TypeScript</strong></td>
                <td>Tốt</td>
                <td style={{color:"#34d399"}}>Rất tốt (auto-infer)</td>
                <td style={{color:"#34d399"}}>Rất tốt (auto-infer types từ slice)</td>
              </tr>
              <tr>
                <td><strong>Testing</strong></td>
                <td>Cần mock Provider + Context</td>
                <td style={{color:"#34d399"}}>Dễ — test store trực tiếp</td>
                <td style={{color:"#34d399"}}>Dễ — test reducers (pure functions)</td>
              </tr>
              <tr>
                <td><strong>Learning curve</strong></td>
                <td style={{color:"#34d399"}}>⭐ 15 phút là dùng được</td>
                <td style={{color:"#34d399"}}>⭐⭐ 30 phút là dùng được</td>
                <td>⭐⭐⭐ 2-3 giờ mới hiểu đủ concepts</td>
              </tr>
              <tr>
                <td><strong>Phù hợp cho</strong></td>
                <td>Theme, locale, auth role (ít thay đổi)</td>
                <td style={{color:"#34d399"}}>80% projects — nhỏ đến lớn</td>
                <td>Enterprise, banking, e-commerce phức tạp</td>
              </tr>
            </tbody>
          </table>

          <h3 className="edu-section-title">📝 So sánh code — Cùng 1 chức năng, 3 cách viết</h3>
          
          <div className="edu-code-block">
            <div className="edu-code-header"><span>1️⃣ TẠO STORE — so sánh setup</span></div>
            <div className="edu-code-content">
{`// =========== CONTEXT API ===========
const TodoContext = createContext();
const reducer = (state, action) => { /* switch/case */ };
const TodoProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(reducer, []);
  return <TodoContext.Provider value={{ todos, dispatch }}>{children}</TodoContext.Provider>;
};
// → 8 dòng, phải tách riêng reducer

// =========== ZUSTAND ===========
const useTodoStore = create((set) => ({
  todos: [],
  addTodo: (text) => set((s) => ({ todos: [...s.todos, { text }] })),
}));
// → 4 dòng! State + actions cùng 1 chỗ

// =========== REDUX TOOLKIT ===========
const todoSlice = createSlice({
  name: "todos",
  initialState: { items: [] },
  reducers: {
    addTodo: (state, action) => { state.items.push({ text: action.payload }); },
  },
});
const store = configureStore({ reducer: { todos: todoSlice.reducer } });
// → 8 dòng + cần export actions + cần Provider bọc App`}
            </div>
          </div>

          <div className="edu-code-block">
            <div className="edu-code-header"><span>2️⃣ ĐỌC STATE — so sánh cách lấy data</span></div>
            <div className="edu-code-content">
{`// =========== CONTEXT API ===========
const { todos } = useContext(TodoContext);
// ⚠️ Lấy CẢ object → mọi thay đổi đều re-render

// =========== ZUSTAND ===========
const todos = useTodoStore((state) => state.todos);
// ✅ Selector → chỉ re-render khi "todos" thay đổi

const count = useTodoStore((state) => state.todos.length);
// ✅ Chỉ re-render khi LENGTH thay đổi, không phải content!

// =========== REDUX TOOLKIT ===========
const todos = useSelector((state) => state.todos.items);
// ✅ Selector tương tự Zustand, so sánh shallow`}
            </div>
          </div>

          <div className="edu-code-block">
            <div className="edu-code-header"><span>3️⃣ CẬP NHẬT STATE — so sánh cách thay đổi data</span></div>
            <div className="edu-code-content">
{`// =========== CONTEXT API ===========
const { dispatch } = useContext(TodoContext);
dispatch({ type: "ADD", payload: "Mua sữa" });
// ⚠️ Phải nhớ đúng type string → dễ typo, không autocomplete

// =========== ZUSTAND ===========
const addTodo = useTodoStore((s) => s.addTodo);
addTodo("Mua sữa");
// ✅ Gọi hàm trực tiếp! Có autocomplete, type-safe

// =========== REDUX TOOLKIT ===========
const dispatch = useDispatch();
dispatch(addTodo("Mua sữa"));
// ⚠️ Phải qua dispatch, nhưng có autocomplete từ action creator`}
            </div>
          </div>

          <h3 className="edu-section-title">🏆 Khi nào nên chọn cái nào?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="edu-demo" style={{ borderColor: "rgba(99,102,241,0.3)" }}>
              <div className="edu-demo-title">🔗 Context API</div>
              <p className="edu-text"><strong>Chọn khi:</strong></p>
              <ul className="edu-list">
                <li>App nhỏ, state ít thay đổi</li>
                <li>Theme dark/light mode</li>
                <li>Locale i18n (ngôn ngữ)</li>
                <li>Auth role (admin/user)</li>
                <li>Không muốn cài thêm thư viện</li>
              </ul>
              <div style={{ fontSize: "0.8rem", color: "#818cf8", marginTop: 8 }}>
                📦 Ví dụ thực tế: Blog cá nhân, landing page, portfolio
              </div>
            </div>
            <div className="edu-demo" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
              <div className="edu-demo-title">🐻 Zustand</div>
              <p className="edu-text"><strong>Chọn khi:</strong></p>
              <ul className="edu-list">
                <li>App nhỏ đến lớn</li>
                <li>Muốn ít boilerplate</li>
                <li>Cần performance tốt</li>
                <li>Dự án freelance / startup</li>
                <li>Team nhỏ, cần nhanh</li>
              </ul>
              <div style={{ fontSize: "0.8rem", color: "#34d399", marginTop: 8 }}>
                📦 Ví dụ: SaaS, dashboard, e-commerce vừa, social app
              </div>
            </div>
            <div className="edu-demo" style={{ borderColor: "rgba(124,58,237,0.3)" }}>
              <div className="edu-demo-title">🟣 Redux Toolkit</div>
              <p className="edu-text"><strong>Chọn khi:</strong></p>
              <ul className="edu-list">
                <li>App enterprise phức tạp</li>
                <li>Cần time-travel debugging</li>
                <li>Team lớn, cần quy chuẩn</li>
                <li>Middleware phức tạp (saga)</li>
                <li>Data fetching phức tạp (RTK Query)</li>
              </ul>
              <div style={{ fontSize: "0.8rem", color: "#a78bfa", marginTop: 8 }}>
                📦 Ví dụ: Banking app, ERP, e-commerce lớn, admin panel
              </div>
            </div>
          </div>

          <h3 className="edu-section-title">📊 Performance: Ai nhanh hơn ai?</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Re-render comparison — hiểu cách các thư viện xử lý update</span></div>
            <div className="edu-code-content">
{`Giả sử có 3 component: Header, TodoList, Footer
Chỉ TodoList dùng state "todos". Header và Footer dùng state khác.

Khi thêm 1 todo:

🔗 Context API:
   Header    → RE-RENDER ❌ (dù không dùng todos!)
   TodoList  → RE-RENDER ✅
   Footer    → RE-RENDER ❌ (dù không dùng todos!)
   → Vì: Provider value thay đổi → TẤT CẢ consumer re-render
   → Impact: App chậm khi có nhiều consumer

🐻 Zustand:
   Header    → KHÔNG re-render ✅ (không subscribe todos)
   TodoList  → RE-RENDER ✅ (subscribe todos)
   Footer    → KHÔNG re-render ✅ (không subscribe todos)
   → Vì: Chỉ component dùng selector cho "todos" mới re-render
   → Impact: App luôn nhanh, dù có 100 components

🟣 Redux Toolkit:
   Header    → KHÔNG re-render ✅ (selector khác)
   TodoList  → RE-RENDER ✅ (useSelector cho todos)
   Footer    → KHÔNG re-render ✅ (selector khác)
   → Vì: useSelector chỉ trigger khi phần state đó thay đổi
   → Impact: Tương tự Zustand, nhưng có thêm DevTools overhead nhỏ`}
            </div>
          </div>

          <h3 className="edu-section-title">� Phạm vi Global — Câu hỏi phỏng vấn quan trọng!</h3>
          <div className="edu-warning">
            <strong>⚠️ Interview Question:</strong> "State trong Context API, Zustand, và Redux khác nhau 
            về phạm vi global như thế nào?" — Đây là câu hỏi phỏng vấn cực phổ biến!
          </div>

          <div className="edu-demo" style={{ borderColor: "rgba(99,102,241,0.3)" }}>
            <div className="edu-demo-title">🔗 Context API — KHÔNG thực sự Global</div>
            <p className="edu-text">
              State chỉ tồn tại <strong>trong phạm vi Provider bọc quanh</strong>. Component nằm ngoài Provider 
              sẽ KHÔNG truy cập được. Nếu có <strong>Nested Provider</strong> (Provider lồng nhau), 
              Provider con sẽ <strong>override</strong> Provider cha → dễ gây bug!
            </p>
            <div className="edu-code-block" style={{ margin: "8px 0" }}>
              <div className="edu-code-content">
{`// Context: State bị GIỚI HẠN trong Provider
<ThemeContext.Provider value="dark">     {/* Cả app = dark */}
  <Header />                             {/* ← nhận "dark" ✅ */}
  
  <ThemeContext.Provider value="light">  {/* Override! */}
    <Card />                             {/* ← nhận "light" ❌ không phải "dark" */}
    <Button />                           {/* ← nhận "light" ❌ */}
  </ThemeContext.Provider>
  
  <Footer />                             {/* ← nhận "dark" ✅ */}
</ThemeContext.Provider>

<OutsideComponent />                     {/* ← undefined! Ngoài Provider */}
// → Context KHÔNG phải global thực sự, chỉ là "scoped to tree"`}
              </div>
            </div>
          </div>

          <div className="edu-demo" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
            <div className="edu-demo-title">🐻 Zustand — TRUE Global (Module-level Singleton)</div>
            <p className="edu-text">
              Store tồn tại <strong>ở cấp JavaScript module, NGOÀI React</strong>. Toàn bộ app dùng 
              <strong> cùng 1 instance</strong>. Bất kỳ file nào import store đều truy cập cùng data. 
              Không phụ thuộc vào component tree hay Provider. Giống như <strong>biến toàn cục</strong> 
              nhưng có reactive (auto re-render).
            </p>
            <div className="edu-code-block" style={{ margin: "8px 0" }}>
              <div className="edu-code-content">
{`// store.js — tạo 1 lần, tồn tại suốt vòng đời app
const useCountStore = create(() => ({ count: 0 }));

// ✅ ComponentA.jsx — import và dùng
const count = useCountStore((s) => s.count); // → 0

// ✅ ComponentB.jsx — CÙNG store, CÙNG data!
const count = useCountStore((s) => s.count); // → 0

// ✅ utils.js — dùng NGOÀI React!
const currentCount = useCountStore.getState().count; // → OK!

// ✅ Không cần Provider, không bị scope, không bị override
// → "True global" — giống biến toàn cục nhưng reactive`}
              </div>
            </div>
          </div>

          <div className="edu-demo" style={{ borderColor: "rgba(124,58,237,0.3)" }}>
            <div className="edu-demo-title">🟣 Redux — Single Source of Truth, nhưng cần Provider</div>
            <p className="edu-text">
              Redux có nguyên tắc <strong>"1 Store duy nhất"</strong> (Single Source of Truth). 
              Store là global, nhưng component <strong>BẮT BUỘC nằm trong Provider</strong> mới truy cập được. 
              Có thể import store trực tiếp trong utility files, nhưng không recommend.
            </p>
            <div className="edu-code-block" style={{ margin: "8px 0" }}>
              <div className="edu-code-content">
{`// Redux: 1 Store duy nhất cho toàn app
const store = configureStore({ reducer: { ... } });

// ❌ PHẢI bọc Provider mới dùng được useSelector/useDispatch
<Provider store={store}>
  <App />     {/* ← Mọi component bên trong đều truy cập store */}
</Provider>

<Outside />   {/* ← useSelector() sẽ THROW ERROR! */}

// ⚠️ Có thể dùng ngoài React nhưng KHÔNG recommend:
// store.getState()  → lấy state trực tiếp
// store.dispatch()  → dispatch action từ bên ngoài
// → Phá vỡ nguyên tắc "unidirectional data flow"

// 🔑 Khác Zustand: Redux KHÔNG cho phép nhiều store
// → "1 store to rule them all" — dễ quản lý nhưng ít linh hoạt`}
              </div>
            </div>
          </div>

          <h3 className="edu-section-title">📋 Tóm tắt cho phỏng vấn — Global Scope</h3>
          <table className="edu-table">
            <thead>
              <tr><th style={{width:"20%"}}>Tiêu chí</th><th>🔗 Context API</th><th>🐻 Zustand</th><th>🟣 Redux</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Kiểu global</strong></td>
                <td style={{color:"#f87171"}}>Scoped — theo Provider tree</td>
                <td style={{color:"#34d399"}}>True global — module singleton</td>
                <td>Global 1 store, scoped qua Provider</td>
              </tr>
              <tr>
                <td><strong>State tồn tại ở đâu?</strong></td>
                <td>Trong React component tree</td>
                <td style={{color:"#34d399"}}>Ngoài React (JS module level)</td>
                <td>Store riêng, truy cập qua Provider</td>
              </tr>
              <tr>
                <td><strong>Cần Provider?</strong></td>
                <td style={{color:"#f87171"}}>✅ Bắt buộc</td>
                <td style={{color:"#34d399"}}>❌ Không cần!</td>
                <td style={{color:"#f87171"}}>✅ Bắt buộc</td>
              </tr>
              <tr>
                <td><strong>Nested override?</strong></td>
                <td style={{color:"#f87171"}}>Có — Provider con override cha</td>
                <td style={{color:"#34d399"}}>Không — luôn 1 instance</td>
                <td style={{color:"#34d399"}}>Không — chỉ 1 store</td>
              </tr>
              <tr>
                <td><strong>Dùng ngoài React?</strong></td>
                <td style={{color:"#f87171"}}>❌ Không thể</td>
                <td style={{color:"#34d399"}}>✅ getState() / subscribe()</td>
                <td>⚠️ Có thể nhưng không recommend</td>
              </tr>
              <tr>
                <td><strong>Nhiều store?</strong></td>
                <td>Nhiều Context = nhiều Provider</td>
                <td style={{color:"#34d399"}}>Nhiều store thoải mái</td>
                <td style={{color:"#f87171"}}>Chỉ 1 store (nguyên tắc core)</td>
              </tr>
            </tbody>
          </table>

          <h3 className="edu-section-title">�🎓 Tổng kết cuối cùng</h3>
          <div className="edu-tip">
            <strong>💡 Lời khuyên thực tế từ cộng đồng React 2024-2025:</strong>
            <ul className="edu-list">
              <li><strong>Mới học React?</strong> → Học Context API trước để hiểu concept, rồi chuyển sang Zustand</li>
              <li><strong>Dự án cá nhân / freelance?</strong> → Zustand 🐻 là lựa chọn tốt nhất (nhanh, gọn, đủ mạnh)</li>
              <li><strong>Đi phỏng vấn?</strong> → Cần biết cả Zustand VÀ Redux (Redux vẫn phổ biến ở công ty lớn)</li>
              <li><strong>Dự án công ty lớn?</strong> → Hỏi team dùng gì → follow theo. Thường là Redux hoặc Zustand</li>
              <li><strong>Server state (API)?</strong> → KHÔNG dùng Redux/Zustand. Dùng TanStack Query hoặc SWR</li>
            </ul>
          </div>
        </div>
      )}
    </LessonLayout>
  );
};

export default StateManagementLesson;
