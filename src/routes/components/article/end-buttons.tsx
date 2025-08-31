export default function EndButtons() {
  return (
    <div className="end-buttons">
      <button
        onClick={() => (window.location.href = "/articles")}
        className="blur-bg button"
      >
        Read other Articles
      </button>
      <button
        onClick={() => (window.location.href = "/")}
        className="blur-bg button"
      >
        Home Page
      </button>
    </div>
  );
}
