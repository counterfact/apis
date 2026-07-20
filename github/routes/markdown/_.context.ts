import type { Context$ } from "../../types/_.context.js";

const COMMONMARKER_VERSION = "0.23.4";

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderInline = (text: string): string =>
  text
    .replace(
      /`([^`]+)`/g,
      (_, code: string) => `<code>${escapeHtml(code)}</code>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_, alt: string, src: string) =>
        `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`,
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, label: string, href: string) =>
        `<a href="${escapeHtml(href)}">${label}</a>`,
    );

const renderIssueReferences = (text: string, repoContext: string): string =>
  text.replace(/#(\d+)/g, (_, num: string) => {
    const url = `https://github.com/${repoContext}/issues/${num}`;
    return `<a href="${url}">#${num}</a>`;
  });

const renderBlock = (
  lines: string[],
  mode: "markdown" | "gfm",
  repoContext?: string,
): string => {
  const result: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    // Fenced code block
    const fenceMatch = /^(`{3,}|~{3,})(.*)$/.exec(line);
    if (fenceMatch) {
      const fence = fenceMatch[1] ?? "";
      const lang = (fenceMatch[2] ?? "").trim();
      const codeLines: string[] = [];
      index++;
      while (index < lines.length && !lines[index]?.startsWith(fence)) {
        codeLines.push(lines[index] ?? "");
        index++;
      }
      index++;
      const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      result.push(
        `<pre><code${langAttr}>${escapeHtml(codeLines.join("\n"))}</code></pre>`,
      );
      continue;
    }

    // ATX headings
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = (headingMatch[1] ?? "").length;
      const content = headingMatch[2] ?? "";
      result.push(`<h${level}>${renderInline(content)}</h${level}>`);
      index++;
      continue;
    }

    // Horizontal rule
    if (/^(?:-{3,}|_{3,}|\*{3,})$/.test(line.trim())) {
      result.push("<hr>");
      index++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (
        index < lines.length &&
        (lines[index]?.startsWith("> ") ?? false)
      ) {
        quoteLines.push((lines[index] ?? "").slice(2));
        index++;
      }
      result.push(
        `<blockquote>\n${renderBlock(quoteLines, mode, repoContext)}\n</blockquote>`,
      );
      continue;
    }

    // Unordered list
    if (/^[*\-+]\s+/.test(line)) {
      const listItems: string[] = [];
      while (index < lines.length && /^[*\-+]\s+/.test(lines[index] ?? "")) {
        listItems.push((lines[index] ?? "").replace(/^[*\-+]\s+/, ""));
        index++;
      }
      const items = listItems
        .map((item) => `<li>${renderInline(item)}</li>`)
        .join("\n");
      result.push(`<ul>\n${items}\n</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index] ?? "")) {
        listItems.push((lines[index] ?? "").replace(/^\d+\.\s+/, ""));
        index++;
      }
      const items = listItems
        .map((item) => `<li>${renderInline(item)}</li>`)
        .join("\n");
      result.push(`<ol>\n${items}\n</ol>`);
      continue;
    }

    // Blank line — skip
    if (line.trim() === "") {
      index++;
      continue;
    }

    // Paragraph — collect until blank line
    const paraLines: string[] = [];
    while (index < lines.length && (lines[index]?.trim() ?? "") !== "") {
      paraLines.push(lines[index] ?? "");
      index++;
    }
    let paraText = paraLines.join(" ");
    if (mode === "gfm" && repoContext) {
      paraText = renderIssueReferences(paraText, repoContext);
    }
    result.push(`<p>${renderInline(paraText)}</p>`);
  }

  return result.join("\n");
};

export class Context {
  constructor(private readonly $: Context$) {}

  renderMarkdown(
    text: string,
    mode: "markdown" | "gfm" = "markdown",
    repoContext?: string,
  ): string {
    const lines = text.split("\n");
    return renderBlock(lines, mode, repoContext);
  }

  renderRaw(text: string): string {
    return this.renderMarkdown(text, "markdown");
  }

  commonMarkerVersion(): string {
    return COMMONMARKER_VERSION;
  }
}
