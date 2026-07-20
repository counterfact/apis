import assert from "node:assert/strict";
import test from "node:test";
import type { Context$ } from "../types/_.context.ts";
import { Context } from "../routes/markdown/_.context.ts";

const createContext = () =>
  new Context({
    loadContext: (() => {
      throw new Error("No nested contexts are expected");
    }) as Context$["loadContext"],
    readJson: async () => ({}),
  });

test("renderMarkdown converts headings to HTML", () => {
  const context = createContext();
  assert.equal(context.renderMarkdown("# Hello"), "<h1>Hello</h1>");
  assert.equal(context.renderMarkdown("## World"), "<h2>World</h2>");
  assert.equal(context.renderMarkdown("### Third"), "<h3>Third</h3>");
});

test("renderMarkdown wraps plain text in a paragraph", () => {
  const context = createContext();
  assert.equal(context.renderMarkdown("Hello, world!"), "<p>Hello, world!</p>");
});

test("renderMarkdown renders bold and italic inline elements", () => {
  const context = createContext();
  assert.equal(
    context.renderMarkdown("**bold** and *italic*"),
    "<p><strong>bold</strong> and <em>italic</em></p>",
  );
});

test("renderMarkdown renders inline code", () => {
  const context = createContext();
  assert.equal(
    context.renderMarkdown("Use `npm install` to install"),
    "<p>Use <code>npm install</code> to install</p>",
  );
});

test("renderMarkdown renders fenced code blocks", () => {
  const context = createContext();
  const input = "```js\nconsole.log('hi');\n```";
  const output = context.renderMarkdown(input);
  assert.ok(output.includes("<pre><code"), "should have pre>code");
  assert.ok(output.includes("console.log"), "should include code content");
  assert.ok(output.includes("language-js"), "should include language class");
});

test("renderMarkdown renders unordered lists", () => {
  const context = createContext();
  const output = context.renderMarkdown("- apples\n- bananas\n- cherries");
  assert.ok(output.includes("<ul>"), "should have ul");
  assert.ok(output.includes("<li>apples</li>"), "should have list item");
  assert.ok(output.includes("<li>bananas</li>"), "should have list item");
});

test("renderMarkdown renders ordered lists", () => {
  const context = createContext();
  const output = context.renderMarkdown("1. first\n2. second\n3. third");
  assert.ok(output.includes("<ol>"), "should have ol");
  assert.ok(output.includes("<li>first</li>"), "should have list item");
});

test("renderMarkdown renders links", () => {
  const context = createContext();
  const output = context.renderMarkdown("[GitHub](https://github.com)");
  assert.ok(
    output.includes('<a href="https://github.com">GitHub</a>'),
    "should render link",
  );
});

test("renderMarkdown renders blockquotes", () => {
  const context = createContext();
  const output = context.renderMarkdown("> This is a quote");
  assert.ok(output.includes("<blockquote>"), "should have blockquote");
  assert.ok(output.includes("This is a quote"), "should include content");
});

test("renderMarkdown renders horizontal rules", () => {
  const context = createContext();
  assert.ok(context.renderMarkdown("---").includes("<hr>"), "should render hr");
});

test("renderMarkdown in gfm mode converts issue references with context", () => {
  const context = createContext();
  const output = context.renderMarkdown(
    "See #42 for details",
    "gfm",
    "octocat/hello-world",
  );
  assert.ok(
    output.includes(
      '<a href="https://github.com/octocat/hello-world/issues/42">#42</a>',
    ),
    "should render issue link",
  );
});

test("renderMarkdown in gfm mode without context does not linkify issue refs", () => {
  const context = createContext();
  const output = context.renderMarkdown("See #42 for details", "gfm");
  assert.ok(
    !output.includes("<a href="),
    "should not render link without context",
  );
});

test("renderRaw delegates to renderMarkdown in plain markdown mode", () => {
  const context = createContext();
  const direct = context.renderMarkdown("# Hello");
  const raw = context.renderRaw("# Hello");
  assert.equal(raw, direct);
});

test("commonMarkerVersion returns a semver string", () => {
  const context = createContext();
  const version = context.commonMarkerVersion();
  assert.match(version, /^\d+\.\d+\.\d+$/, "should be semver format");
});

test("renderMarkdown escapes HTML in code blocks", () => {
  const context = createContext();
  const output = context.renderMarkdown(
    "```\n<script>alert('xss')</script>\n```",
  );
  assert.ok(
    !output.includes("<script>"),
    "script tag should be escaped in code blocks",
  );
  assert.ok(output.includes("&lt;script&gt;"), "should escape angle brackets");
});
