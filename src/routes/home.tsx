import Footer from "./components/general/footer";
import Background from "./components/general/background";
import ArticleList from "./components/home/article-list";
import Header from "./components/general/header";

export default function Home() {
  return (
    <div>
      <Background />
      <Header />
      <div className="home-intro">
        <h2>Welcome to My Blog</h2>
        <p>Explore my brain! You can find some of my course notes here too.</p>
        <p>
          If you were looking for my portfolio or projects, they are found at{" "}
          <a href="https://dundeezhang.com" className="link">
            dundeezhang.com
          </a>{" "}
          or at any other of my root domains.
        </p>
        <p>
          Here are my 10 most recent articles. See my{" "}
          <a href="/articles" className="link">
            articles page
          </a>{" "}
          for all my writings and a more robust way to explore them.
        </p>
      </div>
      <ArticleList limit={10} />
      <div className="home-intro">
        <p>
          See the rest of my articles on the{" "}
          <a href="/articles" className="link">
            articles page
          </a>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
}
