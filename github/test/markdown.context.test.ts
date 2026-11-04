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

test("renderMarkdown converts common block and inline Markdown", () => {
  const context = createContext();
  assert.equal(context.renderMarkdown("# Hello"), "<h1>Hello</h1>");
  assert.equal(
    context.renderMarkdown("**bold** and *italic* with `code`"),
    "<p><strong>bold</strong> and <em>italic</em> with <code>code</code></p>",
  );
  assert.equal(
    context.renderMarkdown("- apples\n- bananas"),
    "<ul>\n<li>apples</li>\n<li>bananas</li>\n</ul>",
  );
});

test("renderMarkdown escapes HTML while preserving Markdown output", () => {
  const context = createContext();
  assert.equal(
    context.renderMarkdown("<script>alert('xss')</script>"),
    "<p>&lt;script&gt;alert('xss')&lt;/script&gt;</p>",
  );
  assert.equal(
    context.renderMarkdown("`<strong>**not bold**</strong>`"),
    "<p><code>&lt;strong&gt;**not bold**&lt;/strong&gt;</code></p>",
  );
  assert.equal(
    context.renderMarkdown("[<em>label</em>](javascript:alert)"),
    "<p>&lt;em&gt;label&lt;/em&gt;</p>",
  );
});

test("renderMarkdown renders fenced code blocks without interpreting contents", () => {
  const context = createContext();
  assert.equal(
    context.renderMarkdown(
      "```js\n<script>#42</script>\n```",
      "gfm",
      "octocat/hello-world",
    ),
    '<pre><code class="language-js">&lt;script&gt;#42&lt;/script&gt;</code></pre>',
  );
});

test("renderMarkdown renders GFM issue references only with repository context", () => {
  const context = createContext();
  assert.equal(
    context.renderMarkdown("See #42", "gfm", "octocat/hello-world"),
    '<p>See <a href="https://github.com/octocat/hello-world/issues/42">#42</a></p>',
  );
  assert.equal(context.renderMarkdown("See #42", "gfm"), "<p>See #42</p>");
  assert.equal(
    context.renderMarkdown("#42\n\n- #43", "gfm", "octocat/hello-world"),
    '<p><a href="https://github.com/octocat/hello-world/issues/42">#42</a></p>\n<ul>\n<li><a href="https://github.com/octocat/hello-world/issues/43">#43</a></li>\n</ul>',
  );
  assert.equal(
    context.renderMarkdown("C#42 and `#43`", "gfm", "octocat/hello-world"),
    "<p>C#42 and <code>#43</code></p>",
  );
});

test("renderRaw uses Markdown mode and exposes a CommonMarker version", () => {
  const context = createContext();
  assert.equal(context.renderRaw("# Hello"), context.renderMarkdown("# Hello"));
  assert.match(context.commonMarkerVersion(), /^\d+\.\d+\.\d+$/);
});
