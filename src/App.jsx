
import { useState } from "react";
import LoginForm from "./LoginForm";
import UpdateNameForm from "./UpdateNameForm";
import { UserContext } from "./UserContext";
import UserProfile from "./UserProfile";
import ReduxDemo from "./redux/ReduxDemo";
import UseCallbackDemo from "./useCallback/UseCallbackDemo";
import UseMemoDemo from "./useMemo/UseMemoDemo";
import ComplexReducerDemo from "./useReducer/ComplexReducerDemo";
import ZustandDemo from "./zustand/ZustandDemo";


// Helper component để tạo các phần (section) riêng biệt, dễ quan sát
const Section = ({ title, children, color = "#2196f3" }) => (
  <div style={{
    border: `2px solid ${color}`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  }}>
    <h3 style={{ marginTop: 0, color: color, borderBottom: `1px solid ${color}`, paddingBottom: '8px' }}>
      {title}
    </h3>
    {children}
  </div>
);

const App = () => {
  const [user, setUser] = useState(null);

  const login = name => setUser({ name });
  const logout = () => setUser(null);
  const updateName = name => setUser(u => ({ ...u, name }));

  const contextValue = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    updateName,
  };

  return (
    <UserContext.Provider value={contextValue}>
      <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '16px' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>🚀 Ôn tập React Hooks & State Management</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
          Giao diện được chia thành từng phần để bạn dễ dàng theo dõi bản chất từng loại Hook.
        </p>

        {/* 1. Context API Section */}
        <Section title="1. useContext Demo (Global State nhẹ)" color="#e91e63">
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Dùng khi muốn truyền dữ liệu xuyên qua nhiều cấp component mà không cần prop-drilling.</p>
          <LoginForm />
          <UserProfile />
          <UpdateNameForm />
        </Section>

        {/* 2. useReducer Section */}
        <Section title="2. useReducer Demo (Logic phức tạp)" color="#4caf50">
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Dùng khi state có nhiều logic phụ thuộc hoặc cần quản lý tập trung qua Actions.</p>
          {/* <UseReducerDemo /> */}
          <ComplexReducerDemo />
        </Section>

        {/* 3. Performance Hooks Section */}
        <Section title="3. Performance Hooks (Tối ưu hóa)" color="#ff9800">
          <p style={{ fontSize: '0.9rem', color: '#666' }}>useCallback tránh tạo lại hàm, useMemo tránh tính toán lại những thứ nặng nhọc.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <UseCallbackDemo />
            <UseMemoDemo />
          </div>
        </Section>

        {/* 4. External Stores Section */}
        <Section title="4. External State Libraries" color="#673ab7">
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Zustand và Redux Toolkit dùng cho các ứng dụng thực tế quy mô lớn.</p>
          <ZustandDemo />
          <ReduxDemo />
        </Section>

      </div>
    </UserContext.Provider>
  );
};

export default App;