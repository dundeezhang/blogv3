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
          Here are my most recent articles. Feel free to explore my{" "}
          <a href="/tags" className="link">
            tags page
          </a>{" "}
          for a more organized way to view my content.
        </p>
      </div>
      <ArticleList />
      <Footer />
    </div>
  );
}
