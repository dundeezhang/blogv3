import { Card } from "./card.tsx";
import {
  loadAllArticles,
  getArticlesByTag,
} from "../../../utils/articleLoader.ts";
import { useNavigate } from "react-router-dom";

interface ArticleListProps {
  filterByTag?: string;
  limit?: number;
}

export default function ArticleList({ filterByTag, limit }: ArticleListProps) {
  let articles = filterByTag
    ? getArticlesByTag(filterByTag)
    : loadAllArticles();

  if (limit) {
    articles = articles.slice(0, limit);
  }
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
          filename={article.filename}
          onClick={() => handleCardClick(article.tag, article.filename)}
        />
      ))}
    </div>
  );
}
