import type { Scenario } from "../types/_.context.js";

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

export const identities: Scenario = ($) => {
  $.context.saveUser({
    id: 1,
    login: "octocat",
    name: "The Octocat",
    company: "GitHub",
    location: "San Francisco",
    bio: "Mascot and sample user",
    public_gists: 8,
  });
  $.context.saveUser({
    id: 2,
    login: "mona",
    name: "Mona Lisa",
    company: "Counterfact",
    location: "Paris",
    bio: "Maintains the sample repositories",
  });
  $.context.saveUser({
    id: 3,
    login: "hubot",
    name: "Hubot",
    company: "GitHub",
    location: "ChatOps",
    bio: "Automates pull requests and workflows",
  });

  $.context.saveOrganization({
    id: 10,
    login: "counterfact",
    name: "Counterfact",
    company: "Counterfact",
    description: "API simulator fixtures for local integration testing",
    location: "Remote",
    blog: "https://counterfact.dev",
  });
};

export const repositories: Scenario = ($) => {
  $.context.saveRepository({
    id: 101,
    owner: "octocat",
    name: "hello-world",
    description: "Classic sample repository",
    language: "TypeScript",
    default_branch: "main",
    branches: ["main", "docs"],
    readme: "# Hello World\n\nSample repository used in simulator tests.\n",
  });

  $.context.saveRepository({
    id: 102,
    owner: "counterfact",
    name: "platform-api",
    description: "Stateful API simulator fixtures",
    language: "TypeScript",
    default_branch: "main",
    branches: ["main", "feature-routing"],
    readme: "# Platform API\n\nCounterfact platform API sample repository.\n",
  });

  $.context.saveRepository({
    id: 103,
    owner: "counterfact",
    name: "actions-demo",
    description: "Repository with sample GitHub Actions runs",
    language: "JavaScript",
    default_branch: "main",
    branches: ["main", "release"],
    readme: "# Actions Demo\n\nRepository for CI workflow fixtures.\n",
  });
};

export const issues: Scenario = ($) => {
  $.context.saveIssue("counterfact", "platform-api", {
    number: 1,
    title: "Support stateful repository reads",
    body: "Replace random responses with context-backed repository data.",
    labels: [{ name: "enhancement", color: "84b6eb", default: false }],
    user: $.context.getUser("mona"),
  });

  $.context.saveIssue("counterfact", "platform-api", {
    number: 2,
    title: "Search should find open work",
    body: "Add lightweight issue discovery for the seeded repository data.",
    state: "closed",
    state_reason: "completed",
    labels: [{ name: "search", color: "0e8a16", default: false }],
    user: $.context.getUser("hubot"),
  });

  $.context.saveIssueComment("counterfact", "platform-api", 1, {
    id: 11,
    body: "Repository routes are the best first slice.",
    user: $.context.getUser("octocat"),
  });
};

export const pullRequests: Scenario = ($) => {
  $.context.savePullRequest("counterfact", "platform-api", {
    number: 1,
    title: "Implement stateful repository fixtures",
    body: "Adds repository reads and issue seeding for the simulator.",
    head: "mona:feature-routing",
    base: "main",
    draft: false,
    user: $.context.getUser("mona"),
  });

  $.context.savePullRequestReview("counterfact", "platform-api", 1, {
    id: 21,
    body: "Looks good. Please add one more route assertion.",
    state: "COMMENTED",
    user: $.context.getUser("hubot"),
  });
};

export const actions: Scenario = ($) => {
  $.context.saveWorkflow("counterfact", "actions-demo", {
    id: 301,
    name: "CI",
    path: ".github/workflows/ci.yml",
  });
  $.context.saveWorkflow("counterfact", "actions-demo", {
    id: 302,
    name: "Release",
    path: ".github/workflows/release.yml",
  });

  $.context.saveWorkflowRun("counterfact", "actions-demo", {
    id: 401,
    workflow_id: 301,
    head_branch: "main",
    event: "push",
    status: "completed",
    conclusion: "success",
    display_title: "CI on main",
    actor: $.context.getUser("hubot"),
  });
  $.context.saveWorkflowRun("counterfact", "actions-demo", {
    id: 402,
    workflow_id: 301,
    head_branch: "release",
    event: "pull_request",
    status: "completed",
    conclusion: "failure",
    display_title: "CI on release branch",
    actor: $.context.getUser("mona"),
  });

  $.context.saveWorkflowJob("counterfact", "actions-demo", 401, {
    id: 501,
    name: "lint",
    status: "completed",
    conclusion: "success",
  });
  $.context.saveWorkflowJob("counterfact", "actions-demo", 401, {
    id: 502,
    name: "test",
    status: "completed",
    conclusion: "success",
  });
  $.context.saveWorkflowJob("counterfact", "actions-demo", 402, {
    id: 503,
    name: "test",
    status: "completed",
    conclusion: "failure",
  });
};

export const seedGitHub: Scenario = ($) => {
  void identities($);
  void repositories($);
  void issues($);
  void pullRequests($);
  void actions($);
  void gists($);
  void gistComments($);
};

export const startup: Scenario = ($) => {
  void seedGitHub($);
};

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
  console.log(
    "\nTry .scenario seedGitHub to load users, repos, issues, pull requests, workflows, gists, and comments.",
  );
};
