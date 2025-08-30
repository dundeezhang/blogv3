import { useState } from "react";
import { getAllTags } from "../utils/articleLoader";
import ArticleList from "./components/home/article-list";
import Header from "./components/general/header";
import Footer from "./components/general/footer";
import Background from "./components/general/background";

export default function Tags() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const allTags = getAllTags();

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  return (
    <>
      <Background />
      <Header />
      <div className="tags-container">
        <div className="tags-header">
          <h2>Browse by Tags</h2>
          <div className="tags-list">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`button blur-bg ${
                  selectedTag === tag ? "active" : ""
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="filtered-articles">
          {selectedTag ? (
            <ArticleList filterByTag={selectedTag} />
          ) : (
            <>
              <div className="no-selection">
                <p>Click on a tag above to see articles with that tag.</p>
              </div>
              <ArticleList />
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
