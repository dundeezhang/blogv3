export interface Article {
  title: string;
  date: string;
  tag: string;
  filename: string;
}

function parseDateString(dateString: string): Date {
  // Month Day, Year (e.g., "July 4, 2024", "January 7, 2025") format
  const trimmedDate = dateString.trim();
  const dateObj = new Date(trimmedDate);

  if (isNaN(dateObj.getTime())) {
    console.warn(`Invalid date format: "${dateString}"`);
    return new Date(1970, 0, 1); // January 1, 1970
  }

  return dateObj;
}

// import all markdown files using glob import
const articleModules = import.meta.glob("/src/data/articles/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function loadAllArticles(): Article[] {
  const articles: Article[] = [];

  Object.entries(articleModules).forEach(([path, content]) => {
    // /src/data/articles/[tag]/[filename].md
    const pathParts = path.split("/");
    const tag = pathParts[pathParts.length - 2];
    const filename = pathParts[pathParts.length - 1];

    const lines = (content as string).split("\n");
    const title = lines[0].replace(/^#\s*/, "");
    const date = lines[2];

    articles.push({
      title,
      date,
      tag,
      filename,
    });
  });

  articles.sort((a, b) => {
    const dateA = parseDateString(a.date);
    const dateB = parseDateString(b.date);
    const dateComparison = dateB.getTime() - dateA.getTime();
    if (dateComparison === 0) {
      return a.title.localeCompare(b.title);
    }

    return dateComparison;
  });

  return articles;
}

export function loadArticle(tag: string, filename: string): string | null {
  const articlePath = `/src/data/articles/${tag}/${filename}`;
  const content = articleModules[articlePath];

  if (content) {
    return content as string;
  }

  return null;
}

export function getArticlePreview(tag: string, filename: string): string {
  const content = loadArticle(tag, filename);
  if (!content) return "";

  const lines = content.split("\n");
  const contentStart = 4;

  // first 5 lines of actual content
  const previewLines = lines
    .slice(contentStart)
    .filter((line) => line.trim() !== "")
    .slice(0, 5);

  return previewLines.join(" ").substring(0, 200) + "..."; // 200 char lim
}
