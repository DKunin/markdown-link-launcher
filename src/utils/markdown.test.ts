import { describe, expect, it } from "vitest";

import { extractMarkdownLinks } from "./markdown";

const sampleMarkdown = `# Sample File

Here is a [valid link](https://example.com) inside the text.
Another [Mail link](mailto:test@example.com) lives here.
A [relative link](/docs/guide.md) should also be captured.

Broken [link](ftp://example.com) and [empty]() should be ignored.
`;

describe("extractMarkdownLinks", () => {
  it("returns an empty array when no markdown links exist", () => {
    const content = "# Title\nNo links here.";

    expect(extractMarkdownLinks(content)).toEqual([]);
  });

  it("extracts valid markdown links with their metadata", () => {
    const result = extractMarkdownLinks(sampleMarkdown);

    expect(result).toEqual([
      {
        text: "valid link",
        url: "https://example.com",
        lineNumber: 3,
      },
      {
        text: "Mail link",
        url: "mailto:test@example.com",
        lineNumber: 4,
      },
      {
        text: "relative link",
        url: "/docs/guide.md",
        lineNumber: 5,
      },
    ]);
  });

  it("trims whitespace around text and urls", () => {
    const content = "Check [ spaced link ]( https://example.com/page ) here.";
    const result = extractMarkdownLinks(content);

    expect(result).toEqual([
      {
        text: "spaced link",
        url: "https://example.com/page",
        lineNumber: 1,
      },
    ]);
  });
});
