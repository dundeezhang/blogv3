import { Card } from "./card.tsx";
import { loadAllArticles } from "../../../utils/articleLoader.ts";
import { useNavigate } from "react-router-dom";

export default function ArticleList() {
  const articles = loadAllArticles();
  const navigate = useNavigate();

  const handleCardClick = (tag: string, filename: string) => {
    const articleSlug = filename.replace(/\.md$/, "");
    navigate(`/${tag}/${articleSlug}`);
  };

  return (
    <div className="article-list">
      {articles.map((article, index) => (
        <Card
          key={index}
          title={article.title}
          date={article.date}
          tag={article.tag}
          onClick={() => handleCardClick(article.tag, article.filename)}
        />
      ))}
    </div>
  );
}
