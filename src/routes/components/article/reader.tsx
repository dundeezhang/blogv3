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
import EndButtons from "./end-buttons";

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
      <div className="reader-container">
        <div>Prepping Article!</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reader-container">
        <div>
          <p>Error: {error}</p>
          <button onClick={handleBackClick}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-container">
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
          img({ src, alt, ...props }) {
            // handle images
            let imageSrc = src;
            if (src?.startsWith("./")) {
              imageSrc = src.substring(1);
            } else if (src?.startsWith("../")) {
              imageSrc = "/" + src.replace(/^\.\.\//, "");
            } else if (src && !src.startsWith("/") && !src.startsWith("http")) {
              imageSrc = "/" + src;
            }

            return <img src={imageSrc} alt={alt} {...props} />;
          },
        }}
      >
        {markdownContent}
      </ReactMarkdown>
      <EndButtons />
    </div>
  );
};

export default Reader;
