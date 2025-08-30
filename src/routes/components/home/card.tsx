interface CardProps {
  title: string;
  date: string;
  tag: string;
  onClick?: () => void;
}

export function Card({ title, date, tag, onClick }: CardProps) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <p className="card-title">{title}</p>
      <p className="card-date">{date}</p>
      <p className="card-tag">{tag}</p>
    </div>
  );
}
