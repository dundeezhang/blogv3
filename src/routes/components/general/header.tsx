export default function Header() {
  return (
    <header>
      <h1>blog.dhz.app</h1>
      <p className="subtitle">Life and Dev Notes</p>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/tags">Tags</a>
          </li>
          <li>
            <a href="https://dundeezhang.com">Portfolio</a>
          </li>
          <li>
            <a href="https://x.com/dundeezhang">Twitter</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
