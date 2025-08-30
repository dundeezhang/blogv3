import { useState } from "react";
import { getArticlePreview } from "../../../utils/articleLoader";

interface CardProps {
  title: string;
  date: string;
  tag: string;
  filename: string;
  onClick?: () => void;
}

export function Card({ title, date, tag, filename, onClick }: CardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState("");

  const handleMouseEnter = () => {
    if (!preview) {
      const articlePreview = getArticlePreview(tag, filename);
      setPreview(articlePreview);
    }
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
  };

  return (
    <div
      className="card blur-bg"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="card-content">
        <p className="card-title">{title}</p>
        <p className="card-date">{date}</p>
        <div className={`card-preview ${showPreview && preview ? "show" : ""}`}>
          {preview}
        </div>
      </div>
      <div className="card-tag-container">
        <p className="card-tag">{tag}</p>
      </div>
    </div>
  );
}
