import type { Context$ } from "../../types/_.context.js";
import type { license } from "../../types/components/schemas/license.js";
import type { license_simple } from "../../types/components/schemas/license-simple.js";

const API_URL = "https://api.github.com";
const APP_URL = "https://github.com";
const DEFAULT_PAGE_SIZE = 30;

const asNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
};

const asBoolean = (value: unknown) =>
  value === true || value === "true" || value === 1 || value === "1";

const paginate = <T>(
  items: Array<T>,
  query?: { page?: unknown; per_page?: unknown },
) => {
  const page = asNumber(query?.page, 1);
  const perPage = asNumber(query?.per_page, DEFAULT_PAGE_SIZE);
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
};

const makeSimpleLicense = (entry: license): license_simple => ({
  key: entry.key,
  name: entry.name,
  url: entry.url,
  spdx_id: entry.spdx_id,
  node_id: entry.node_id,
  html_url: entry.html_url,
});

const LICENSES: Array<license> = [
  {
    key: "mit",
    name: "MIT License",
    spdx_id: "MIT",
    url: `${API_URL}/licenses/mit`,
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
  },
  {
    key: "apache-2.0",
    name: "Apache License 2.0",
    spdx_id: "Apache-2.0",
    url: `${API_URL}/licenses/apache-2.0`,
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
  },
  {
    key: "bsd-3-clause",
    name: 'BSD 3-Clause "New" or "Revised" License',
    spdx_id: "BSD-3-Clause",
    url: `${API_URL}/licenses/bsd-3-clause`,
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
  },
  {
    key: "gpl-3.0",
    name: "GNU General Public License v3.0",
    spdx_id: "GPL-3.0",
    url: `${API_URL}/licenses/gpl-3.0`,
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
  },
  {
    key: "lgpl-3.0",
    name: "GNU Lesser General Public License v3.0",
    spdx_id: "LGPL-3.0",
    url: `${API_URL}/licenses/lgpl-3.0`,
    node_id: "MDc6TGljZW5zZWxncGwtMy4w",
    html_url: "http://choosealicense.com/licenses/lgpl-3.0/",
    description:
      "A weak copyleft license for libraries and reusable components.",
    implementation:
      "Create a LICENSE file in the repository root and include the LGPLv3 text.",
    permissions: ["commercial-use", "modifications", "distribution"],
    conditions: ["disclose-source", "same-license-library"],
    limitations: ["liability", "warranty"],
    body: "LGPL-3.0 body",
    featured: false,
  },
  {
    key: "mpl-2.0",
    name: "Mozilla Public License 2.0",
    spdx_id: "MPL-2.0",
    url: `${API_URL}/licenses/mpl-2.0`,
    node_id: "MDc6TGljZW5zZW1wbC0yLjA=",
    html_url: "http://choosealicense.com/licenses/mpl-2.0/",
    description: "A weak copyleft license with file-level copyleft.",
    implementation:
      "Create a LICENSE file in the repository root and include the MPL 2.0 text.",
    permissions: ["commercial-use", "modifications", "distribution"],
    conditions: ["disclose-source", "include-notice"],
    limitations: ["liability", "warranty"],
    body: "MPL-2.0 body",
    featured: false,
  },
  {
    key: "unlicense",
    name: "The Unlicense",
    spdx_id: "Unlicense",
    url: `${API_URL}/licenses/unlicense`,
    node_id: "MDc6TGljZW5zZXVubGljZW5zZQ==",
    html_url: "http://choosealicense.com/licenses/unlicense/",
    description: "A license that dedicates works to the public domain.",
    implementation:
      "Create a LICENSE file in the repository root and include the Unlicense text.",
    permissions: ["commercial-use", "modifications", "distribution"],
    conditions: [],
    limitations: ["liability", "warranty"],
    body: "Unlicense body",
    featured: false,
  },
];

export class Context {
  private licensesByKey = new Map<string, license>();

  constructor(private readonly $: Context$) {
    for (const entry of LICENSES) {
      this.licensesByKey.set(entry.key, entry);
    }
  }

  saveLicense(licenseData: license): license {
    const key = licenseData.key.toLowerCase();
    const existing = this.licensesByKey.get(key);
    const entry: license = {
      ...existing,
      ...licenseData,
      key,
      url: licenseData.url ?? existing?.url ?? `${API_URL}/licenses/${key}`,
      html_url:
        licenseData.html_url ??
        existing?.html_url ??
        `${APP_URL}/licenses/${key}`,
    };
    this.licensesByKey.set(key, entry);
    return entry;
  }

  getLicense(key: string): license | undefined {
    return this.licensesByKey.get(key.toLowerCase());
  }

  listLicenses(query?: {
    featured?: unknown;
    per_page?: unknown;
    page?: unknown;
  }) {
    const licenses = [...this.licensesByKey.values()].sort((left, right) =>
      left.key.localeCompare(right.key),
    );
    const filtered = asBoolean(query?.featured)
      ? licenses.filter((entry) => entry.featured)
      : licenses;
    return paginate(
      filtered.map((entry) => makeSimpleLicense(entry)),
      query,
    );
  }
}
