import Reader from "./components/article/reader";
import Background from "./components/general/background";
import Footer from "./components/general/footer";
import Header from "./components/general/header";
import Comments from "./components/article/comments";

export default function Article() {
  return (
    <>
      <Background />
      <Header />
      <Reader />
      <Comments />
      <Footer />
    </>
  );
}
