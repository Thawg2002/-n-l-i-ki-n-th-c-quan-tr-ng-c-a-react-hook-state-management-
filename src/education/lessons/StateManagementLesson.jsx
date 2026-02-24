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

// Tạo Context để chia sẻ state
const TodoContext = createContext();

// Reducer quản lý todo
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

// Provider component bọc children
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

// Component sử dụng Context
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

// Zustand store: tạo bằng `create`
// Cực kỳ đơn giản — state + actions trong 1 object duy nhất
const useZustandTodoStore = create((set) => ({
  // State
  todos: [
    { id: 1, text: "Học React Hooks", done: true },
    { id: 2, text: "Học Zustand", done: false },
  ],
  
  // Actions — gọi set() để cập nhật state
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

// Component sử dụng Zustand
const ZustandTodoApp = () => {
  // Lấy state & actions từ store — giống như dùng hook thường!
  const { todos, addTodo, toggleTodo, deleteTodo } = useZustandTodoStore();
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input.trim()); // ← Gọi action trực tiếp, không cần dispatch
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

// Bước 1: Tạo Slice (bao gồm state + reducers + actions)
const reduxTodoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [
      { id: 1, text: "Học React Hooks", done: true },
      { id: 2, text: "Học Redux Toolkit", done: false },
    ],
  },
  reducers: {
    // Redux Toolkit dùng Immer → CÓ THỂ mutate trực tiếp!
    addTodo: (state, action) => {
      state.items.push({ id: Date.now(), text: action.payload, done: false });
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done; // ← Mutate trực tiếp nhờ Immer
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
  },
});

// Bước 2: Export actions (auto-generated từ reducers)
const { addTodo: reduxAddTodo, toggleTodo: reduxToggleTodo, deleteTodo: reduxDeleteTodo } = reduxTodoSlice.actions;

// Bước 3: Tạo Store
const reduxStore = configureStore({
  reducer: { todos: reduxTodoSlice.reducer },
});

// Bước 4: Component sử dụng Redux
const ReduxTodoContent = () => {
  const todos = useSelector(state => state.todos.items); // ← Lấy state từ store
  const dispatch = useDispatch(); // ← Lấy dispatch function
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch(reduxAddTodo(input.trim())); // ← Dispatch action
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

// Bọc Provider riêng cho Redux demo (self-contained, không ảnh hưởng global)
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
    { key: "compare", label: "⚖️ So sánh" },
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
          <h3 className="edu-section-title">🤔 Khi nào cần State Management?</h3>
          <div className="edu-info">
            <strong>useState + Props</strong> đủ dùng khi:
            <ul className="edu-list">
              <li>State chỉ dùng trong 1-2 component</li>
              <li>Truyền data qua 1-2 cấp component</li>
              <li>App nhỏ, ít trang</li>
            </ul>
          </div>
          <div className="edu-warning">
            <strong>Cần State Management</strong> khi:
            <ul className="edu-list">
              <li>Nhiều component ở các cấp khác nhau cần cùng một data</li>
              <li>Prop drilling quá sâu (truyền qua 3+ cấp)</li>
              <li>State phức tạp (user auth, cart, notifications...)</li>
              <li>Cần DevTools để debug state</li>
            </ul>
          </div>

          <h3 className="edu-section-title">🗺️ Bản đồ State Management</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Quyết định chọn giải pháp</span></div>
            <div className="edu-code-content">
{`State cần chia sẻ?
├── Không → useState + props ✅
└── Có → Bao nhiêu component?
    ├── 2-5 component → useContext + useReducer ✅
    └── Nhiều hơn → Cần thư viện?
        ├── App nhỏ-trung → Zustand 🐻 (đơn giản, nhẹ)
        └── App lớn/enterprise → Redux Toolkit 🟣 (mạnh mẽ, DevTools)

💡 Lưu ý: React Query / TanStack Query cho SERVER state
   (API data, caching...) — khác với CLIENT state ở trên`}
            </div>
          </div>

          <h3 className="edu-section-title">📊 So sánh nhanh</h3>
          <table className="edu-table">
            <thead>
              <tr><th>Tiêu chí</th><th>Context API</th><th>Zustand 🐻</th><th>Redux Toolkit 🟣</th></tr>
            </thead>
            <tbody>
              <tr><td>📦 Cài đặt</td><td style={{color:"#34d399"}}>Không cần (built-in)</td><td>npm i zustand</td><td>npm i @reduxjs/toolkit react-redux</td></tr>
              <tr><td>📝 Boilerplate</td><td>Trung bình</td><td style={{color:"#34d399"}}>Ít nhất</td><td>Nhiều nhất</td></tr>
              <tr><td>🔍 DevTools</td><td style={{color:"#f87171"}}>Không</td><td>Có (middleware)</td><td style={{color:"#34d399"}}>Tốt nhất</td></tr>
              <tr><td>⚡ Performance</td><td style={{color:"#f87171"}}>Re-render toàn bộ tree</td><td style={{color:"#34d399"}}>Chỉ re-render subscriber</td><td style={{color:"#34d399"}}>Chỉ re-render subscriber</td></tr>
              <tr><td>📈 Scalability</td><td>App nhỏ</td><td>App nhỏ-lớn</td><td style={{color:"#34d399"}}>App enterprise</td></tr>
              <tr><td>📚 Learning</td><td style={{color:"#34d399"}}>Dễ nhất</td><td style={{color:"#34d399"}}>Dễ</td><td>Khó hơn</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ============ TAB: CONTEXT API ============ */}
      {activeTab === "context" && (
        <div>
          <h3 className="edu-section-title">🔗 Context API — Built-in React</h3>
          <div className="edu-info">
            <strong>Context API</strong> là giải pháp state management có sẵn trong React. 
            Không cần cài thêm thư viện. Phù hợp cho state đơn giản (theme, locale, auth).
          </div>

          <h3 className="edu-section-title">📝 Cách hoạt động</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>3 bước setup Context</span></div>
            <div className="edu-code-content">
{`// Bước 1: Tạo Context
const TodoContext = createContext();

// Bước 2: Tạo Provider (bọc component tree)
const TodoProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

// Bước 3: Sử dụng trong component con
const TodoList = () => {
  const { todos, dispatch } = useContext(TodoContext);
  // → Truy cập state và dispatch từ BẤT KỲ component nào
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

          <div className="edu-warning">
            <strong>⚠️ Nhược điểm Context:</strong>
            <ul className="edu-list">
              <li><strong>Re-render toàn bộ:</strong> Khi value thay đổi → TẤT CẢ consumer re-render, kể cả khi chỉ dùng 1 phần state</li>
              <li><strong>Không có DevTools:</strong> Khó debug khi app phức tạp</li>
              <li><strong>Provider Hell:</strong> Nhiều context → nested providers rất sâu</li>
            </ul>
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
            Hiện tại rất phổ biến trong cộng đồng React.
          </div>

          <h3 className="edu-section-title">📝 Cách setup</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Zustand Store</span></div>
            <div className="edu-code-content">
{`import { create } from "zustand";

// ✅ GỌN GHẼ: state + actions trong 1 object
const useTodoStore = create((set) => ({
  // State
  todos: [],
  
  // Actions — gọi set() để cập nhật
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), text, done: false }],
  })),
  
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ),
  })),
  
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(t => t.id !== id),
  })),
}));

// Sử dụng — giống hook thường!
const { todos, addTodo } = useTodoStore();
addTodo("Học Zustand"); // ← Gọi trực tiếp, không cần dispatch`}
            </div>
          </div>

          <h3 className="edu-section-title">🎯 Demo: Todo App với Zustand</h3>
          <div className="edu-demo">
            <div className="edu-demo-title">💡 Zustand — không cần Provider!</div>
            <ZustandTodoApp />
          </div>

          <h3 className="edu-section-title">🌟 Tại sao chọn Zustand?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="edu-info">
              <strong>✅ Ưu điểm</strong>
              <ul className="edu-list">
                <li>Siêu nhẹ (~1KB gzipped)</li>
                <li>Không cần Provider wrapper</li>
                <li>API đơn giản, ít boilerplate</li>
                <li>Chỉ re-render component dùng state đó</li>
                <li>Hỗ trợ middleware (persist, devtools)</li>
                <li>TypeScript friendly</li>
              </ul>
            </div>
            <div className="edu-warning">
              <strong>⚠️ Nhược điểm</strong>
              <ul className="edu-list">
                <li>DevTools không mạnh bằng Redux</li>
                <li>Ít middleware có sẵn hơn Redux</li>
                <li>Community nhỏ hơn Redux</li>
                <li>Chưa phù hợp cho app cực lớn</li>
              </ul>
            </div>
          </div>

          <div className="edu-code-block">
            <div className="edu-code-header"><span>Zustand Persist — lưu localStorage</span></div>
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
// Reload trang → state vẫn còn! ✨`}
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

          <h3 className="edu-section-title">📝 Kiến trúc Redux</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Core Concepts</span></div>
            <div className="edu-code-content">
{`// Luồng dữ liệu Redux (One-way data flow):
// Component → dispatch(action) → Reducer → Store → Component

// ┌─────────┐  dispatch  ┌──────────┐  update  ┌───────┐
// │Component│ ─────────→ │ Reducer  │ ───────→ │ Store │
// └────┬────┘            └──────────┘          └───┬───┘
//      │                                          │
//      └──────────── useSelector ←────────────────┘`}
            </div>
          </div>

          <h3 className="edu-section-title">📝 Cách setup RTK</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Redux Toolkit Setup</span></div>
            <div className="edu-code-content">
{`import { configureStore, createSlice } from "@reduxjs/toolkit";

// Bước 1: Tạo Slice (state + reducers + actions)
const todoSlice = createSlice({
  name: "todos",
  initialState: { items: [] },
  reducers: {
    // ✅ RTK dùng Immer → mutate trực tiếp!
    addTodo: (state, action) => {
      state.items.push({ id: Date.now(), text: action.payload });
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.done = !todo.done; // ← OK nhờ Immer!
    },
  },
});

// Bước 2: Export actions (auto-generated)
export const { addTodo, toggleTodo } = todoSlice.actions;

// Bước 3: Tạo Store
const store = configureStore({
  reducer: { todos: todoSlice.reducer },
});

// Bước 4: Bọc Provider + sử dụng
// <Provider store={store}> ... </Provider>
const todos = useSelector(state => state.todos.items);
const dispatch = useDispatch();
dispatch(addTodo("Học Redux")); // ← dispatch action`}
            </div>
          </div>

          <h3 className="edu-section-title">🎯 Demo: Todo App với Redux Toolkit</h3>
          <div className="edu-demo">
            <div className="edu-demo-title">💡 Redux Toolkit — self-contained Provider</div>
            <ReduxTodoApp />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="edu-info">
              <strong>✅ Ưu điểm Redux Toolkit</strong>
              <ul className="edu-list">
                <li>DevTools tốt nhất (time-travel debugging)</li>
                <li>Immer built-in (mutate trực tiếp)</li>
                <li>Middleware mạnh (thunk, saga, logger)</li>
                <li>RTK Query cho data fetching</li>
                <li>Community & ecosystem lớn nhất</li>
                <li>Predictable (1 source of truth)</li>
              </ul>
            </div>
            <div className="edu-warning">
              <strong>⚠️ Nhược điểm</strong>
              <ul className="edu-list">
                <li>Boilerplate nhiều hơn Zustand</li>
                <li>Learning curve cao hơn</li>
                <li>Cần Provider wrapper</li>
                <li>Bundle size lớn hơn (~10KB)</li>
                <li>Overkill cho app nhỏ</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============ TAB: SO SÁNH ============ */}
      {activeTab === "compare" && (
        <div>
          <h3 className="edu-section-title">⚖️ So sánh chi tiết</h3>
          
          <table className="edu-table">
            <thead>
              <tr><th style={{width:"20%"}}>Tiêu chí</th><th>🔗 Context API</th><th>🐻 Zustand</th><th>🟣 Redux Toolkit</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Cài đặt</strong></td>
                <td style={{color:"#34d399"}}>Không cần</td>
                <td><code>npm i zustand</code> (~1KB)</td>
                <td><code>npm i @reduxjs/toolkit react-redux</code> (~10KB)</td>
              </tr>
              <tr>
                <td><strong>Setup code</strong></td>
                <td>createContext + Provider + useReducer</td>
                <td style={{color:"#34d399"}}>{"create(set => {...})"}</td>
                <td>createSlice + configureStore + Provider</td>
              </tr>
              <tr>
                <td><strong>Sử dụng</strong></td>
                <td>useContext(MyCtx)</td>
                <td style={{color:"#34d399"}}>useStore() — giống hook</td>
                <td>useSelector + useDispatch</td>
              </tr>
              <tr>
                <td><strong>Provider</strong></td>
                <td style={{color:"#f87171"}}>Bắt buộc</td>
                <td style={{color:"#34d399"}}>Không cần!</td>
                <td style={{color:"#f87171"}}>Bắt buộc</td>
              </tr>
              <tr>
                <td><strong>Re-render</strong></td>
                <td style={{color:"#f87171"}}>Toàn bộ consumer tree</td>
                <td style={{color:"#34d399"}}>Chỉ component subscribe</td>
                <td style={{color:"#34d399"}}>Chỉ component subscribe</td>
              </tr>
              <tr>
                <td><strong>DevTools</strong></td>
                <td style={{color:"#f87171"}}>❌ Không</td>
                <td>✅ Middleware</td>
                <td style={{color:"#34d399"}}>✅✅ Mạnh nhất</td>
              </tr>
              <tr>
                <td><strong>Middleware</strong></td>
                <td style={{color:"#f87171"}}>❌ Không</td>
                <td>persist, devtools, immer...</td>
                <td style={{color:"#34d399"}}>thunk, saga, RTK Query...</td>
              </tr>
              <tr>
                <td><strong>Async logic</strong></td>
                <td>Tự handle (useEffect)</td>
                <td>Gọi async trong action</td>
                <td style={{color:"#34d399"}}>createAsyncThunk / RTK Query</td>
              </tr>
              <tr>
                <td><strong>TypeScript</strong></td>
                <td>Tốt</td>
                <td style={{color:"#34d399"}}>Rất tốt</td>
                <td style={{color:"#34d399"}}>Rất tốt (auto-infer types)</td>
              </tr>
              <tr>
                <td><strong>Learning</strong></td>
                <td style={{color:"#34d399"}}>⭐ Dễ nhất</td>
                <td style={{color:"#34d399"}}>⭐⭐ Dễ</td>
                <td>⭐⭐⭐ Khó hơn</td>
              </tr>
              <tr>
                <td><strong>Testing</strong></td>
                <td>Trung bình</td>
                <td style={{color:"#34d399"}}>Dễ test (subscribe)</td>
                <td style={{color:"#34d399"}}>Dễ test (pure reducers)</td>
              </tr>
            </tbody>
          </table>

          <h3 className="edu-section-title">🎓 Kết luận: Nên chọn gì?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="edu-demo" style={{ borderColor: "rgba(99,102,241,0.3)" }}>
              <div className="edu-demo-title">🔗 Context API</div>
              <p className="edu-text">
                <strong>Dùng khi:</strong> App nhỏ, state đơn giản (theme, locale, auth role). 
                Không muốn cài thêm thư viện.
              </p>
              <div style={{ fontSize: "0.8rem", color: "#818cf8" }}>
                "Miễn phí, built-in, đủ dùng cho app nhỏ"
              </div>
            </div>
            <div className="edu-demo" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
              <div className="edu-demo-title">🐻 Zustand</div>
              <p className="edu-text">
                <strong>Dùng khi:</strong> App nhỏ đến lớn, muốn đơn giản, ít boilerplate. 
                Hầu hết dự án React hiện đại.
              </p>
              <div style={{ fontSize: "0.8rem", color: "#34d399" }}>
                "Lựa chọn #1 cho hầu hết projects"
              </div>
            </div>
            <div className="edu-demo" style={{ borderColor: "rgba(124,58,237,0.3)" }}>
              <div className="edu-demo-title">🟣 Redux Toolkit</div>
              <p className="edu-text">
                <strong>Dùng khi:</strong> App enterprise, cần DevTools mạnh, middleware phức tạp, 
                team lớn cần quy chuẩn.
              </p>
              <div style={{ fontSize: "0.8rem", color: "#a78bfa" }}>
                "Chuẩn công nghiệp cho app lớn"
              </div>
            </div>
          </div>

          <h3 className="edu-section-title">📝 Code so sánh — cùng 1 chức năng</h3>
          <div className="edu-code-block">
            <div className="edu-code-header"><span>Context vs Zustand vs Redux</span></div>
            <div className="edu-code-content">
{`// ======= CONTEXT API =======
const ctx = useContext(TodoContext);
ctx.dispatch({ type: "ADD", payload: "New" }); // dispatch + action type

// ======= ZUSTAND =======
const { addTodo } = useTodoStore();
addTodo("New"); // ← Gọi trực tiếp, ĐỈNH!

// ======= REDUX TOOLKIT =======
const dispatch = useDispatch();
dispatch(addTodo("New")); // dispatch + action creator`}
            </div>
          </div>

          <div className="edu-tip">
            <strong>💡 Lời khuyên từ thực tế:</strong> Nếu bạn mới bắt đầu, hãy học Zustand trước — 
            nó dễ nhất và đủ mạnh cho hầu hết dự án. Chỉ chuyển sang Redux khi dự án yêu cầu 
            DevTools phức tạp hoặc middleware đặc biệt (saga, RTK Query cho data fetching lớn).
          </div>
        </div>
      )}
    </LessonLayout>
  );
};

export default StateManagementLesson;
