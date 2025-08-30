export interface Article {
  title: string;
  date: string;
  tag: string;
  filename: string;
}

// Import all markdown files using Vite's glob import
const articleModules = import.meta.glob("/src/data/articles/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function loadAllArticles(): Article[] {
  const articles: Article[] = [];

  Object.entries(articleModules).forEach(([path, content]) => {
    // Extract tag and filename from path
    // Path format: /src/data/articles/[tag]/[filename].md
    const pathParts = path.split("/");
    const tag = pathParts[pathParts.length - 2]; // Second to last part is the tag
    const filename = pathParts[pathParts.length - 1]; // Last part is the filename

    // Parse the first two lines to get title and date
    const lines = (content as string).split("\n");
    const title = lines[0].replace(/^#\s*/, ""); // Remove the # from the title
    const date = lines[1];

    articles.push({
      title,
      date,
      tag,
      filename,
    });
  });

  return articles;
}

export function loadArticle(tag: string, filename: string): string | null {
  // Construct the path that matches our glob pattern
  const articlePath = `/src/data/articles/${tag}/${filename}`;

  // Find the matching article content
  const content = articleModules[articlePath];

  if (content) {
    return content as string;
  }

  return null;
}
