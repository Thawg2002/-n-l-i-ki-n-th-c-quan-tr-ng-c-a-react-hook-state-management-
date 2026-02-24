import React, { useReducer } from "react";

// 1. Initial State
const initialState = {
  todos: [
    { id: 1, text: "Học bản chất React Hook", completed: true },
    { id: 2, text: "Luyện tập useReducer", completed: false },
  ],
  filter: "all", // "all" | "active" | "completed"
  inputValue: "",
};

// 2. Reducer Function
function todoReducer(state, action) {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, inputValue: action.payload };
      
    case "ADD_TODO":
      if (!state.inputValue.trim()) return state;
      const newTodo = {
        id: Date.now(),
        text: state.inputValue,
        completed: false,
      };
      return {
        ...state,
        todos: [...state.todos, newTodo],
        inputValue: "", // Clear input after adding
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case "SET_FILTER":
      return { ...state, filter: action.payload };

    case "CLEAR_COMPLETED":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    default:
      return state;
  }
}

const ComplexReducerDemo = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Derived state (Logic tính toán dựa trên state hiện tại)
  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = state.todos.filter((t) => !t.completed).length;

  return (
    <div style={{ border: "2px solid #4caf50", padding: 20, borderRadius: 8, marginTop: 20 }}>
      <h3 style={{ color: "#2e7d32" }}>Advanced useReducer: Todo App</h3>
      
      {/* Input Area */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={state.inputValue}
          onChange={(e) => dispatch({ type: "SET_INPUT", payload: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && dispatch({ type: "ADD_TODO" })}
          placeholder="Bạn cần làm gì?"
          style={{ padding: "8px 12px", width: "70%", borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button 
          onClick={() => dispatch({ type: "ADD_TODO" })}
          style={{ marginLeft: 8, padding: "8px 16px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Thêm
        </button>
      </div>

      {/* Filter Buttons */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <span>Lọc:</span>
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => dispatch({ type: "SET_FILTER", payload: f })}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid #4caf50",
              backgroundColor: state.filter === f ? "#4caf50" : "transparent",
              color: state.filter === f ? "white" : "#4caf50",
              cursor: "pointer",
              textTransform: "capitalize"
            }}
          >
            {f === "all" ? "Tất cả" : f === "active" ? "Chưa xong" : "Đã xong"}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span
              onClick={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#888" : "#000",
                cursor: "pointer",
              }}
            >
              {todo.completed ? "✅" : "⬜"} {todo.text}
            </span>
            <button
              onClick={() => dispatch({ type: "DELETE_TODO", payload: todo.id })}
              style={{ backgroundColor: "#f44336", color: "white", border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>

      {/* Footer Info */}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#666" }}>
        <span>Còn {activeCount} việc cần làm</span>
        <button 
          onClick={() => dispatch({ type: "CLEAR_COMPLETED" })}
          style={{ background: "none", border: "none", color: "#2196f3", cursor: "pointer", textDecoration: "underline" }}
        >
          Xóa các việc đã xong
        </button>
      </div>
    </div>
  );
};

export default ComplexReducerDemo;
