/**
 * 📖 BÀI 10: useId - Tạo ID Unique
 * useId tạo ID ổn định cho SSR, đảm bảo server và client cùng ID.
 * Hữu ích cho label-input, aria attributes.
 */
import React, { useId } from "react";
import LessonLayout from "../LessonLayout";

// Component tái sử dụng: Form Field
const FormField = ({ label, type = "text", placeholder }) => {
  // useId tạo ID unique cho MỖI instance của component
  // ID này ổn định giữa server render và client hydration
  const id = useId();
  
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: "0.85rem", marginBottom: 4, color: "#94a3b8" }}>
        {label}
      </label>
      <input id={id} type={type} className="edu-input" placeholder={placeholder} style={{ width: "100%" }} />
      <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>
        ID: <span className="edu-inline-code">{id}</span>
      </div>
    </div>
  );
};

const UseIdLesson = () => {
  const checkboxId = useId();

  return (
    <LessonLayout lessonNumber="10" title="useId - Tạo ID Unique"
      description="useId tạo ID ổn định, unique cho mỗi component instance. Đặc biệt quan trọng cho SSR (Server-Side Rendering) để đảm bảo server/client cùng ID.">
      
      <h3 className="edu-section-title">📝 Cú pháp</h3>
      <div className="edu-code-block">
        <div className="edu-code-header"><span>useId</span></div>
        <div className="edu-code-content">
{`const id = useId(); // → ":r1:", ":r2:", ...

// Dùng cho label-input
<label htmlFor={id}>Email</label>
<input id={id} type="email" />

// Dùng cho aria
<input aria-describedby={id + "-hint"} />
<p id={id + "-hint"}>Nhập email hợp lệ</p>`}
        </div>
      </div>

      <h3 className="edu-section-title">📝 Demo: Form với IDs unique</h3>
      <p className="edu-text">
        Mỗi <span className="edu-inline-code">FormField</span> tự tạo ID riêng nhờ useId. 
        Dù render nhiều lần, ID luôn unique và ổn định.
      </p>
      <div className="edu-demo">
        <div className="edu-demo-title">💡 Nhiều FormField cùng component, khác ID</div>
        <FormField label="👤 Họ tên" placeholder="Nguyễn Văn A" />
        <FormField label="📧 Email" type="email" placeholder="example@email.com" />
        <FormField label="📱 Số điện thoại" type="tel" placeholder="0123456789" />
        <FormField label="🔒 Mật khẩu" type="password" placeholder="••••••••" />
        
        <div className="edu-flex edu-items-center edu-gap-8 edu-mt-8">
          <input type="checkbox" id={checkboxId} />
          <label htmlFor={checkboxId} style={{ fontSize: "0.85rem" }}>
            Tôi đồng ý điều khoản sử dụng
          </label>
          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
            (ID: <span className="edu-inline-code">{checkboxId}</span>)
          </span>
        </div>
      </div>

      <div className="edu-warning">
        <strong>⚠️ Đừng dùng useId để tạo key cho list!</strong><br/>
        Key trong list nên đến từ dữ liệu (database ID, index...). 
        useId tạo ID mới mỗi render → không phù hợp cho key.
      </div>

      <div className="edu-tip">
        <strong>💡 Mẹo:</strong> useId chủ yếu dùng cho accessibility (a11y): label-input, 
        aria-describedby, aria-labelledby. Nếu không làm SSR, bạn cũng có thể dùng counter thường, 
        nhưng useId là cách chuẩn và an toàn hơn.
      </div>
    </LessonLayout>
  );
};

export default UseIdLesson;
