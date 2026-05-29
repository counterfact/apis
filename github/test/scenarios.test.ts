import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../routes/_.context.ts";
import { gists, gistComments, seedGitHub } from "../scenarios/index.ts";

const createScenario$ = () => {
  const context = new Context({} as never);
  return {
    context,
    loadContext: (path: string) => (path === "/" ? context : {}),
    routes: {},
    route: () => ({}),
  };
};

test("gists scenario seeds sample gist data", () => {
  const $ = createScenario$();

  gists($);

  const allGists = $.context.listGists();
  assert.equal(allGists.length, 3);

  const rubyGist = $.context.getGist("aa5a315d61ae9438b18d");
  assert.ok(rubyGist, "Ruby gist should exist");
  assert.equal(rubyGist.description, "Hello World Ruby");
  assert.equal(rubyGist.public, true);
  assert.ok(rubyGist.files?.["hello_world.rb"]);

  const pythonGist = $.context.getGist("b5a5ce3049c14e426f30");
  assert.ok(pythonGist, "Python gist should exist");
  assert.equal(pythonGist.description, "Hello World Python");
  assert.ok(pythonGist.files?.["hello_world.py"]);
  assert.ok(pythonGist.files?.["README.md"]);

  const secretGist = $.context.getGist("c6db0bec360bb87e9418");
  assert.ok(secretGist, "Secret gist should exist");
  assert.equal(secretGist.public, false);
});

test("gists scenario produces correct public/private split", () => {
  const $ = createScenario$();

  gists($);

  assert.equal($.context.listPublicGists().length, 2);
});

test("gistComments scenario seeds comments on existing gists", () => {
  const $ = createScenario$();

  gists($);
  gistComments($);

  const rubyComments = $.context.listComments("aa5a315d61ae9438b18d");
  assert.equal(rubyComments.length, 1);
  assert.equal(rubyComments[0].body, "Great Ruby snippet!");

  const pythonComments = $.context.listComments("b5a5ce3049c14e426f30");
  assert.equal(pythonComments.length, 1);
  assert.equal(pythonComments[0].body, "Classic Python example.");
});

test("gistComments updates comment count on gist", () => {
  const $ = createScenario$();

  gists($);
  gistComments($);

  assert.equal($.context.getGist("aa5a315d61ae9438b18d")?.comments, 1);
  assert.equal($.context.getGist("b5a5ce3049c14e426f30")?.comments, 1);
});

test("seedGitHub seeds all gists and comments together", () => {
  const $ = createScenario$();

  seedGitHub($);

  assert.equal($.context.listGists().length, 3);
  assert.equal($.context.listComments("aa5a315d61ae9438b18d").length, 1);
  assert.equal($.context.listComments("b5a5ce3049c14e426f30").length, 1);
});
