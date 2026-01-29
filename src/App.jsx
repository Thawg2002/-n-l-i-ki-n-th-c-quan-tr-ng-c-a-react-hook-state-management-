
import React, { useState } from "react";
import { UserContext } from "./UserContext";
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";
import UpdateNameForm from "./UpdateNameForm";
import ZustandDemo from "./zustand/ZustandDemo";
import ReduxDemo from "./redux/ReduxDemo";
import UseReducerDemo from "./useReducer/UseReducerDemo";
import UseCallbackDemo from "./useCallback/UseCallbackDemo";
import UseMemoDemo from "./useMemo/UseMemoDemo";

// App: quản lý state user, cung cấp context và hiển thị các component con
const App = () => {
  // State user: null nếu chưa đăng nhập, object nếu đã đăng nhập
  const [user, setUser] = useState(null);

  // Hàm đăng nhập
  const login = name => setUser({ name });
  // Hàm đăng xuất
  const logout = () => setUser(null);
  // Hàm cập nhật tên
  const updateName = name => setUser(u => ({ ...u, name }));

  // Truyền xuống context
  const contextValue = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    updateName,
  };

  return (
    <UserContext.Provider value={contextValue}>
      <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'Arial' }}>
        <h2>So sánh useContext, Zustand, Redux</h2>
        <ol>
          <li>App tạo UserContext và giữ state user.</li>
          <li>App truyền user và các hàm login, logout, updateName xuống Provider.</li>
          <li>Các component con sử dụng context để đăng nhập, đăng xuất, đổi tên.</li>
        </ol>
        <div style={{ marginBottom: 32 }}>
          <h3>useContext Demo</h3>
          <LoginForm />
          <UserProfile />
          <UpdateNameForm />
        </div>
        <UseReducerDemo />
        <UseCallbackDemo />
        <UseMemoDemo />
        <ZustandDemo />
        <ReduxDemo />
        {/* Có thể thêm nhiều component khác cùng dùng context này */}
      </div>
    </UserContext.Provider>
  );
};

export default App;