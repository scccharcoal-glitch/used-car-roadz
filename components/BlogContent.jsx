function parseInlineImage(line) {
  const match = line.match(/^!\[(.*?)]\((.*?)\)$/);
  if (!match) return null;
  return { alt: match[1], src: match[2] };
}

export default function BlogContent({ content }) {
  const lines = String(content || "").split("\n");

  return (
    <div className="blog-content">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        const image = parseInlineImage(trimmed);
        if (image) {
          return (
            <figure key={`${trimmed}-${index}`}>
              <img src={image.src} alt={image.alt} loading="lazy" />
              {image.alt ? <figcaption>{image.alt}</figcaption> : null}
            </figure>
          );
        }

        if (trimmed.startsWith("### ")) return <h3 key={`${trimmed}-${index}`}>{trimmed.replace(/^### /, "")}</h3>;
        if (trimmed.startsWith("## ")) return <h2 key={`${trimmed}-${index}`}>{trimmed.replace(/^## /, "")}</h2>;
        if (trimmed.startsWith("# ")) return <h2 key={`${trimmed}-${index}`}>{trimmed.replace(/^# /, "")}</h2>;

        return <p key={`${trimmed}-${index}`}>{trimmed}</p>;
      })}
    </div>
  );
}
