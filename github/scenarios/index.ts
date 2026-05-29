import type { Scenario } from "../types/_.context.js";

/**
 * Scenario scripts are plain TypeScript functions that receive the live REPL
 * environment and can read or mutate server state. Run them from the REPL with:
 *   .scenario <functionName>
 */

/**
 * Read or mutate the root context (same object routes see as $.context):
 *   $.context.<property> = <value>;
 *
 * Load a context for a specific path:
 *   const gistsCtx = $.loadContext("/gists");
 *
 * Store a pre-configured route builder for later use in the REPL:
 *   $.routes.myRequest = $.route("/gists").method("get");
 */

/**
 * startup() runs automatically when the server initializes, right before the
 * REPL starts. Use it to seed dummy data so the server is ready to use
 * immediately. It receives the same $ argument as all other scenario functions.
 *
 * Tip: delegate to other scenario functions and pass $ along so each function
 * stays focused on a single concern. You can also pass additional arguments to
 * configure them, e.g. addGists($, 5).
 *
 * If you don't need a startup scenario, delete this function or leave it empty.
 */

export const gists: Scenario = ($) => {
  $.context.saveGist({
    id: "aa5a315d61ae9438b18d",
    description: "Hello World Ruby",
    public: true,
    files: {
      "hello_world.rb": {
        filename: "hello_world.rb",
        type: "application/x-ruby",
        language: "Ruby",
        size: 167,
        content:
          'class HelloWorld\n   def initialize(name)\n      @name = name.capitalize\n   end\n   def say_hi\n      puts "Hello!"\n   end\nend',
      },
    },
  });

  $.context.saveGist({
    id: "b5a5ce3049c14e426f30",
    description: "Hello World Python",
    public: true,
    files: {
      "hello_world.py": {
        filename: "hello_world.py",
        type: "text/x-python",
        language: "Python",
        size: 25,
        content: 'print("Hello, World!")',
      },
      "README.md": {
        filename: "README.md",
        type: "text/plain",
        language: "Markdown",
        size: 48,
        content: "# Hello World\n\nA simple Python hello world script.",
      },
    },
  });

  $.context.saveGist({
    id: "c6db0bec360bb87e9418",
    description: "Secret configuration snippet",
    public: false,
    files: {
      "config.json": {
        filename: "config.json",
        type: "application/json",
        language: "JSON",
        size: 42,
        content: '{\n  "env": "development",\n  "debug": true\n}',
      },
    },
  });
};

export const gistComments: Scenario = ($) => {
  $.context.saveComment("aa5a315d61ae9438b18d", {
    id: 1,
    body: "Great Ruby snippet!",
  });

  $.context.saveComment("b5a5ce3049c14e426f30", {
    id: 2,
    body: "Classic Python example.",
  });
};

export const seedGitHub: Scenario = ($) => {
  gists($);
  gistComments($);
};

export const startup: Scenario = ($) => {
  seedGitHub($);
};

/**
 * An example scenario. To use it in the REPL, type:
 *   .scenario help
 */
export const help: Scenario = ($) => {
  void $;

  console.log(
    [
      "Scenarios are functions that populate the context object",
      "and / or the REPL environment. They are intended to",
      "populate your environment with specific data and",
      "configurations for testing purposes.",
    ].join("\n"),
  );

  console.log(
    "\nScenarios (including this one) are defined in the ./scenarios directory.",
  );
  console.log("\nTry .scenario seedGitHub to load sample gists and comments.");
};
