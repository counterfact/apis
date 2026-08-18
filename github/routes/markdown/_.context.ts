import type { Context$ } from "../../types/_.context.js";

const COMMONMARKER_VERSION = "0.23.4";

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");

const isSafeUrl = (url: string, image = false): boolean => {
  if (/^[\u0000-\u001f\u007f]/.test(url)) return false;
  if (/^(?:https?:|\/|\.\/|\.\.\/)/i.test(url)) return true;
  return !image && /^(?:mailto:|#)/i.test(url);
};

const renderIssueReferences = (text: string, repoContext?: string): string => {
  if (!repoContext || !/^[\w.-]+\/[\w.-]+$/.test(repoContext)) return text;

  return text.replace(
    /(^|[^\w/])#(\d+)\b/g,
    (_, prefix: string, num: string) => {
      const url = `https://github.com/${repoContext}/issues/${num}`;
      return `${prefix}<a href="${url}">#${num}</a>`;
    },
  );
};

const renderText = (
  text: string,
  mode: "markdown" | "gfm",
  repoContext?: string,
): string => {
  let html = escapeHtml(text);
  if (mode === "gfm") html = renderIssueReferences(html, repoContext);

  return html
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");
};

const renderInline = (
  text: string,
  mode: "markdown" | "gfm",
  repoContext?: string,
): string => {
  const token =
    /(`+)([\s\S]*?)\1|!\[([^\]]*)\]\(([^)\s]+)\)|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let html = "";
  let cursor = 0;

  for (const match of text.matchAll(token)) {
    const index = match.index ?? 0;
    html += renderText(text.slice(cursor, index), mode, repoContext);

    if (match[1]) {
      html += `<code>${escapeHtml(match[2] ?? "")}</code>`;
    } else if (match[3] !== undefined && match[4] !== undefined) {
      html += isSafeUrl(match[4], true)
        ? `<img src="${escapeHtml(match[4])}" alt="${escapeHtml(match[3])}">`
        : escapeHtml(match[3]);
    } else if (match[5] !== undefined && match[6] !== undefined) {
      html += isSafeUrl(match[6])
        ? `<a href="${escapeHtml(match[6])}">${escapeHtml(match[5])}</a>`
        : escapeHtml(match[5]);
    }

    cursor = index + match[0].length;
  }

  return html + renderText(text.slice(cursor), mode, repoContext);
};

const renderBlock = (
  lines: string[],
  mode: "markdown" | "gfm",
  repoContext?: string,
): string => {
  const result: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

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
      if (index < lines.length) index++;
      const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      result.push(
        `<pre><code${langAttr}>${escapeHtml(codeLines.join("\n"))}</code></pre>`,
      );
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = (headingMatch[1] ?? "").length;
      result.push(
        `<h${level}>${renderInline(headingMatch[2] ?? "", mode, repoContext)}</h${level}>`,
      );
      index++;
      continue;
    }

    if (/^(?:-{3,}|_{3,}|\*{3,})$/.test(line.trim())) {
      result.push("<hr>");
      index++;
      continue;
    }

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

    if (/^[*\-+]\s+/.test(line)) {
      const listItems: string[] = [];
      while (index < lines.length && /^[*\-+]\s+/.test(lines[index] ?? "")) {
        listItems.push((lines[index] ?? "").replace(/^[*\-+]\s+/, ""));
        index++;
      }
      result.push(
        `<ul>\n${listItems.map((item) => `<li>${renderInline(item, mode, repoContext)}</li>`).join("\n")}\n</ul>`,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index] ?? "")) {
        listItems.push((lines[index] ?? "").replace(/^\d+\.\s+/, ""));
        index++;
      }
      result.push(
        `<ol>\n${listItems.map((item) => `<li>${renderInline(item, mode, repoContext)}</li>`).join("\n")}\n</ol>`,
      );
      continue;
    }

    if (line.trim() === "") {
      index++;
      continue;
    }

    const paraLines: string[] = [];
    while (index < lines.length && (lines[index]?.trim() ?? "") !== "") {
      paraLines.push(lines[index] ?? "");
      index++;
    }
    result.push(
      `<p>${renderInline(paraLines.join(" "), mode, repoContext)}</p>`,
    );
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
    return renderBlock(text.split("\n"), mode, repoContext);
  }

  renderRaw(text: string): string {
    return this.renderMarkdown(text, "markdown");
  }

  commonMarkerVersion(): string {
    return COMMONMARKER_VERSION;
  }
}
