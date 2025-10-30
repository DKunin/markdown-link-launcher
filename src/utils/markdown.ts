export interface MarkdownLink {
  text: string;
  url: string;
  lineNumber: number;
}

const VALID_PROTOCOLS = ["http://", "https://", "mailto:", "/"] as const;

function isValidUrl(url: string): boolean {
  return VALID_PROTOCOLS.some((protocol) => url.startsWith(protocol));
}

export function extractMarkdownLinks(content: string): MarkdownLink[] {
  const links: MarkdownLink[] = [];
  const lines = content.split("\n");
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  lines.forEach((line, index) => {
    markdownLinkRegex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = markdownLinkRegex.exec(line)) !== null) {
      const text = match[1]?.trim() ?? "Untitled";
      const url = match[2]?.trim() ?? "";

      if (!url || !isValidUrl(url)) {
        continue;
      }

      links.push({
        text: text || "Untitled",
        url,
        lineNumber: index + 1,
      });
    }
  });

  return links;
}
