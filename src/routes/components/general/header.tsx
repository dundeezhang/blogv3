export default function Header() {
  return (
    <header className="blur-bg">
      <h1>blog.dhz.app</h1>
      <p className="subtitle">Life and Dev Notes</p>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/articles">Articles</a>
          </li>
          <li>
            <a href="https://dundeezhang.com">About</a>
          </li>
          <li>
            <a href="https://x.com/dundeezhang">Twitter</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
