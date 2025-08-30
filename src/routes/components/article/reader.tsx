import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { loadArticle } from "../../../utils/articleLoader";
import { useTheme } from "../../../hooks/useTheme";

const Reader = () => {
  const { tag, article } = useParams<{ tag: string; article: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [markdownContent, setMarkdownContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDarkMode = theme === "dark";

  useEffect(() => {
    if (tag && article) {
      try {
        const filename = article.endsWith(".md") ? article : `${article}.md`;
        const content = loadArticle(tag, filename);
        if (content) {
          setMarkdownContent(content);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError("Error loading article");
        console.error("Error loading article:", err);
      }
    } else {
      setError("Invalid article parameters");
    }
    setLoading(false);
  }, [tag, article]);

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div>
        <div>Prepping Article!</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>
          <p>Error: {error}</p>
          <button onClick={handleBackClick}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-content">
      <ReactMarkdown
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).trim();
            return match ? (
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={isDarkMode ? materialDark : materialLight}
              >
                {codeString}
              </SyntaxHighlighter>
            ) : (
              <code className={className}>{codeString}</code>
            );
          },
        }}
      >
        {markdownContent}
      </ReactMarkdown>
      <p className="end-of-article-marker">End of Article</p>
    </div>
  );
};

export default Reader;
