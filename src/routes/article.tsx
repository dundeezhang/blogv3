import Reader from "./components/article/reader";
import Background from "./components/general/background";
import Footer from "./components/general/footer";
import Header from "./components/general/header";

export default function Article() {
  return (
    <>
      <Background />
      <Header />
      <Reader />
      <Footer />
    </>
  );
}
