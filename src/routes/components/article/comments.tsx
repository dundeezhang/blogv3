import Giscus from "@giscus/react";
import { useTheme } from "../../../hooks/useTheme";

export default function Comments() {
  const { theme } = useTheme();

  return (
    <div>
      <div className="comment-section">
        <Giscus
          id="comments"
          repo="dundeezhang/giscus"
          repoId="R_kgDONnvt2g"
          category="General"
          categoryId="DIC_kwDONnvt2s4Cl3B9"
          mapping="pathname"
          term="Welcome to @giscus/react component!"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme={theme}
          lang="en"
          loading="lazy"
        />
      </div>
    </div>
  );
}
