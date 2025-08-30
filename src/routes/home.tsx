import Footer from "./components/general/footer";
import Background from "./components/general/background";
import ArticleList from "./components/home/article-list";
import Header from "./components/general/header";

export default function Home() {
  return (
    <div>
      <Background />
      <Header />
      <ArticleList />
      <Footer />
    </div>
  );
}
