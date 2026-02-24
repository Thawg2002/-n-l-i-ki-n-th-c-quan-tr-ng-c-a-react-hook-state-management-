/**
 * ============================================================
 * 📖 LessonLayout - Layout chung cho mỗi bài học
 * ============================================================
 * 
 * Component này đóng vai trò như "khung bài giảng" chung.
 * Mỗi bài học sẽ được bọc trong layout này để đảm bảo
 * giao diện nhất quán: tiêu đề, mô tả, nội dung demo.
 * 
 * Props:
 * - lessonNumber: số thứ tự bài học (VD: "01")
 * - title: tiêu đề hook (VD: "useState")
 * - description: mô tả ngắn về bài học
 * - children: nội dung bài học (demo + giải thích)
 * ============================================================
 */
import React from "react";

const LessonLayout = ({ lessonNumber, title, description, children }) => {
  return (
    <div className="edu-lesson">
      {/* === HEADER BÀI HỌC === */}
      {/* Hiển thị số bài, tiêu đề hook, và mô tả ngắn */}
      <div className="edu-lesson-header">
        <span className="edu-lesson-number">Bài {lessonNumber}</span>
        <h2 className="edu-lesson-title">{title}</h2>
        <p className="edu-lesson-desc">{description}</p>
      </div>

      {/* === NỘI DUNG BÀI HỌC === */}
      {/* Phần này sẽ chứa toàn bộ demo + giải thích từ mỗi lesson component */}
      {children}
    </div>
  );
};

export default LessonLayout;
