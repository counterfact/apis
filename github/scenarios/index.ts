import type { Scenario } from "../types/_.context.ts";

export const emojis: Scenario = ($) => {
  $.context.saveEmoji(
    "smile",
    "https://github.githubassets.com/images/icons/emoji/unicode/1f604.png",
  );
  $.context.saveEmoji(
    "heart",
    "https://github.githubassets.com/images/icons/emoji/unicode/2764.png",
  );
  $.context.saveEmoji(
    "+1",
    "https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png",
  );
  $.context.saveEmoji(
    "tada",
    "https://github.githubassets.com/images/icons/emoji/unicode/1f389.png",
  );
  $.context.saveEmoji(
    "rocket",
    "https://github.githubassets.com/images/icons/emoji/unicode/1f680.png",
  );
};

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
    user: $.context.getUser("hubot"),
  });

  $.context.saveIssueComment("counterfact", "platform-api", 1, {
    id: 11,
    body: "Repository routes are the best first slice.",
    user: $.context.getUser("octocat"),
  });
};

export const milestones: Scenario = ($) => {
  const v1 = $.context.saveMilestone("counterfact", "platform-api", {
    title: "v1.0",
    description: "Track v1.0 launch",
    due_on: "2024-05-01T00:00:00Z",
    state: "open",
  });
  $.context.saveMilestone("counterfact", "platform-api", {
    title: "v0.9",
    description: "Pre-release cleanup",
    due_on: "2024-03-01T00:00:00Z",
    state: "closed",
    closed_at: "2024-03-05T00:00:00Z",
  });

  const existingOpenIssue = $.context.getIssue(
    "counterfact",
    "platform-api",
    1,
  );
  if (existingOpenIssue) {
    $.context.saveIssue("counterfact", "platform-api", {
      ...existingOpenIssue,
      number: existingOpenIssue.number,
      title: existingOpenIssue.title,
      milestone: v1,
    });
  }
};

export const labels: Scenario = ($) => {
  $.context.saveLabel("counterfact", "platform-api", {
    name: "bug",
    color: "d73a4a",
    description: "Something isn't working",
  });
  $.context.saveLabel("counterfact", "platform-api", {
    name: "enhancement",
    color: "84b6eb",
    description: "New feature or request",
  });
  $.context.saveLabel("counterfact", "platform-api", {
    name: "documentation",
    color: "0075ca",
    description: "Improvements or additions to documentation",
  });
  $.context.saveLabel("counterfact", "platform-api", {
    name: "question",
    color: "d876e3",
    description: "Further information is requested",
  });
};

export const licenses: Scenario = ($) => {
  $.context.saveLicense({
    key: "mit",
    name: "MIT License",
    spdx_id: "MIT",
    url: "https://api.github.com/licenses/mit",
    node_id: "MDc6TGljZW5zZW1pdA==",
    html_url: "http://choosealicense.com/licenses/mit/",
    description: "A permissive license that is short and to the point.",
    implementation:
      "Create a LICENSE file in the repository root and copy the MIT text into it.",
    permissions: ["commercial-use", "modifications", "distribution"],
    conditions: ["include-copyright"],
    limitations: ["no-liability"],
    body: "MIT License body",
    featured: true,
  });

  $.context.saveLicense({
    key: "apache-2.0",
    name: "Apache License 2.0",
    spdx_id: "Apache-2.0",
    url: "https://api.github.com/licenses/apache-2.0",
    node_id: "MDc6TGljZW5zZWFwYWNoZS0yLjA=",
    html_url: "http://choosealicense.com/licenses/apache-2.0/",
    description:
      "A permissive license that provides an express grant of patent rights.",
    implementation:
      "Create a LICENSE file in the repository root and include the Apache 2.0 text.",
    permissions: [
      "commercial-use",
      "modifications",
      "distribution",
      "patent-use",
    ],
    conditions: ["include-notice", "state-changes"],
    limitations: ["trademark-use", "no-liability"],
    body: "Apache License 2.0 body",
    featured: true,
  });

  $.context.saveLicense({
    key: "bsd-3-clause",
    name: 'BSD 3-Clause "New" or "Revised" License',
    spdx_id: "BSD-3-Clause",
    url: "https://api.github.com/licenses/bsd-3-clause",
    node_id: "MDc6TGljZW5zZWJzZC0zLWNsdWF1c2U=",
    html_url: "http://choosealicense.com/licenses/bsd-3-clause/",
    description:
      "A permissive license with minimal restrictions on redistribution.",
    implementation:
      "Create a LICENSE file in the repository root and include the BSD 3-Clause text.",
    permissions: ["commercial-use", "modifications", "distribution"],
    conditions: ["include-notice"],
    limitations: ["liability", "warranty"],
    body: "BSD 3-Clause body",
    featured: true,
  });

  $.context.saveLicense({
    key: "gpl-3.0",
    name: "GNU General Public License v3.0",
    spdx_id: "GPL-3.0",
    url: "https://api.github.com/licenses/gpl-3.0",
    node_id: "MDc6TGljZW5zZWdwbC0zLjA=",
    html_url: "http://choosealicense.com/licenses/gpl-3.0/",
    description:
      "A copyleft license that requires anyone who distributes your code to make the source available under the same terms.",
    implementation:
      "Create a LICENSE file in the repository root and include the GPLv3 text.",
    permissions: ["commercial-use", "modifications", "distribution"],
    conditions: ["disclose-source", "same-license"],
    limitations: ["liability", "warranty"],
    body: "GPL-3.0 body",
    featured: true,
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

export const commitStatuses: Scenario = ($) => {
  const commitSha = $.context.getRepositoryBranch(
    "counterfact",
    "actions-demo",
    "main",
  )?.commit.sha;
  if (!commitSha) {
    return;
  }

  $.context.saveCommitStatus("counterfact", "actions-demo", commitSha, {
    state: "success",
    context: "ci/lint",
    description: "Lint checks passed",
    target_url: "https://github.com/counterfact/actions-demo/actions/runs/401",
  });
  $.context.saveCommitStatus("counterfact", "actions-demo", commitSha, {
    state: "success",
    context: "ci/test",
    description: "Tests passed",
    target_url: "https://github.com/counterfact/actions-demo/actions/runs/401",
  });
};

export const releases: Scenario = ($) => {
  $.context.saveRelease("counterfact", "platform-api", {
    id: 601,
    tag_name: "v1.0.0",
    name: "v1.0.0",
    body: "First stable release of the platform API.",
    draft: false,
    prerelease: false,
    created_at: "2024-01-15T10:00:00Z",
    published_at: "2024-01-15T10:00:00Z",
  });

  $.context.saveRelease("counterfact", "platform-api", {
    id: 602,
    tag_name: "v2.0.0-beta.1",
    name: "v2.0.0-beta.1",
    body: "Beta release with new stateful context features.",
    draft: false,
    prerelease: true,
    created_at: "2024-03-01T12:00:00Z",
    published_at: "2024-03-01T12:00:00Z",
  });

  $.context.saveRelease("counterfact", "platform-api", {
    id: 603,
    tag_name: "v2.0.0",
    name: "v2.0.0",
    body: "Draft of the next major release.",
    draft: true,
    prerelease: false,
    created_at: "2024-04-01T08:00:00Z",
    published_at: "",
  });
};

export const notifications: Scenario = ($) => {
  const repository = $.context.getRepository("counterfact", "platform-api");
  if (!repository) {
    throw new Error(
      "notifications requires counterfact/platform-api; run the repositories scenario first",
    );
  }

  const fixtures = [
    {
      id: "101",
      reason: "mention",
      title: "New comment on issue #1",
      type: "Issue" as const,
      url: "https://api.github.com/repos/counterfact/platform-api/issues/1",
      latestCommentUrl:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/11",
      updatedAt: "2026-08-18T13:00:00.000Z",
    },
    {
      id: "102",
      reason: "review_requested",
      title: "Pull request #1 received a review",
      type: "PullRequest" as const,
      url: "https://api.github.com/repos/counterfact/platform-api/pulls/1",
      latestCommentUrl:
        "https://api.github.com/repos/counterfact/platform-api/pulls/1/reviews/21",
      updatedAt: "2026-08-18T12:00:00.000Z",
    },
    {
      id: "103",
      reason: "subscribed",
      title: "Workflow CI completed",
      type: "CheckSuite" as const,
      url: "https://api.github.com/repos/counterfact/platform-api/actions/runs/401",
      latestCommentUrl:
        "https://api.github.com/repos/counterfact/platform-api/actions/runs/401",
      updatedAt: "2026-08-18T11:00:00.000Z",
    },
  ];

  for (const fixture of fixtures) {
    $.context.saveNotification({
      id: fixture.id,
      repository,
      subject: {
        title: fixture.title,
        url: fixture.url,
        latest_comment_url: fixture.latestCommentUrl,
        type: fixture.type,
      },
      reason: fixture.reason,
      updated_at: fixture.updatedAt,
      last_read_at: fixture.updatedAt,
    });
  }
  $.context.setThreadSubscription("101", { ignored: false });
};

export const rateLimit: Scenario = ($) => {
  $.context.setRateLimit("core", { limit: 5000 });
  $.context.setRateLimit("search", { limit: 30 });
  $.context.setRateLimit("graphql", { limit: 5000 });
  $.context.setRateLimit("code_search", { limit: 10 });
};

export const codesOfConduct: Scenario = ($) => {
  const entries: [string, string][] = [
    ["agpl-3.0", "GNU Affero General Public License v3.0"],
    ["apache-2.0", "Apache License 2.0"],
    ["bsd-2-clause", "BSD 2-Clause Simplified License"],
    ["bsd-3-clause", "BSD 3-Clause New or Revised License"],
    ["cc0-1.0", "Creative Commons Zero v1.0 Universal"],
    ["contributor_covenant", "Contributor Covenant"],
    ["gpl-2.0", "GNU General Public License v2.0"],
    ["gpl-3.0", "GNU General Public License v3.0"],
    ["lgpl-2.1", "GNU Lesser General Public License v2.1"],
    ["mit", "MIT License"],
    ["mpl-2.0", "Mozilla Public License 2.0"],
    ["unlicense", "The Unlicense"],
  ];

  for (const [key, name] of entries) {
    $.context.saveCodeOfConduct({
      key,
      name,
      url: `https://api.github.com/codes_of_conduct/${key}`,
      html_url: `https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/${key}.txt`,
      body: `# ${name}\n\nThis deterministic simulator fixture represents ${name}.`,
    });
  }
};

export const gitignoreTemplates: Scenario = ($) => {
  const templates = [
    {
      name: "Go",
      source: "# Binaries for programs and plugins\n*.exe\n*.test\n*.out\n",
    },
    {
      name: "Java",
      source: "# Compiled class files\n*.class\n# Package files\n*.jar\n",
    },
    { name: "Node", source: "# Dependencies\nnode_modules/\n# Logs\n*.log\n" },
    {
      name: "Python",
      source: "# Byte-compiled files\n__pycache__/\n*.py[cod]\n.venv/\n",
    },
    { name: "Ruby", source: "# Bundler\n.bundle/\nvendor/bundle\n*.gem\n" },
  ];
  for (const template of templates) {
    $.context.saveGitignoreTemplate(template);
  }
};

export const apiMetadata: Scenario = ($) => {
  $.context.setApiOverview({
    verifiable_password_authentication: true,
    ssh_key_fingerprints: {
      SHA256_RSA: "SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8",
      SHA256_ED25519: "SHA256:p2QAMXNIC1TJYWeIOttrVc98/R1BUFWu3/LiyKgUfQM",
    },
    api: ["192.30.252.0/22", "185.199.108.0/22"],
    git: ["192.30.252.0/22"],
    hooks: ["192.30.252.0/22"],
    web: ["185.199.108.0/22"],
    actions: ["20.201.28.0/25"],
    packages: ["140.82.112.0/20"],
    pages: ["185.199.108.0/22"],
  });
};

export const organizationMembers: Scenario = ($) => {
  $.context.setOrgMembership("counterfact", "octocat", "admin");
  $.context.setOrgMembership("counterfact", "mona", "member");
  $.context.publicizeMembership("counterfact", "mona");
  const [inviter] = $.context.listSimpleUsers();
  $.context.saveOrgInvitation("counterfact", {
    id: 201,
    login: "hubot",
    email: "hubot@example.com",
    role: "direct_member",
    created_at: "2024-01-02T00:00:00Z",
    inviter,
    team_count: 0,
    node_id: "OI_201",
    invitation_teams_url:
      "https://api.github.com/orgs/counterfact/invitations/201/teams",
    invitation_source: "member",
  });
};

export const authenticatedUser: Scenario = ($) => {
  $.context.setProfile({
    login: "octocat",
    id: 1,
    name: "The Octocat",
    email: "octocat@github.com",
  });
  $.context.saveEmail({
    email: "octocat@github.com",
    primary: true,
    verified: true,
    visibility: "public",
  });
  $.context.saveEmail({
    email: "octocat@users.noreply.github.com",
    primary: false,
    verified: true,
    visibility: "private",
  });
  $.context.saveSshKey({
    id: 301,
    title: "Octocat laptop",
    key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICounterfact octocat",
    url: "https://api.github.com/user/keys/301",
    created_at: "2024-01-03T00:00:00Z",
    verified: true,
    read_only: false,
  });
  $.context.follow("mona");
  $.context.saveFollower("hubot");
  $.context.starRepo("counterfact", "platform-api");
  $.context.subscribeRepo("counterfact", "actions-demo");
  $.context.saveSocialAccount({
    provider: "github",
    url: "https://github.com/octocat",
  });
};

export const seedGitHub: Scenario = ($) => {
  void emojis($);
  void codesOfConduct($);
  void gitignoreTemplates($);
  void apiMetadata($);
  void identities($);
  void repositories($);
  void organizationMembers($);
  void authenticatedUser($);
  void labels($);
  void issues($);
  void milestones($);
  void pullRequests($);
  void actions($);
  void commitStatuses($);
  void releases($);
  void notifications($);
  void licenses($);
  void gists($);
  void gistComments($);
  void rateLimit($);
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
    "\nTry .scenario seedGitHub to load users, repos, issues, pull requests, workflows, gists, licenses, and comments.",
  );
};
