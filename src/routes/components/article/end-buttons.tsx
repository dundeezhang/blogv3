export default function EndButtons() {
  return (
    <div className="end-buttons">
      <button
        onClick={() => (window.location.href = "/")}
        className="blur-bg button"
      >
        Back to Home
      </button>
      <button
        onClick={() => (window.location.href = "/tags")}
        className="blur-bg button"
      >
        Read other Articles
      </button>
    </div>
  );
}
