import type { reposGetPages } from "../../../../types/paths/repos/{owner}/{repo}/pages.types.js";
import type { reposCreatePagesSite } from "../../../../types/paths/repos/{owner}/{repo}/pages.types.js";
import type { reposUpdateInformationAboutPagesSite } from "../../../../types/paths/repos/{owner}/{repo}/pages.types.js";
import type { reposDeletePagesSite } from "../../../../types/paths/repos/{owner}/{repo}/pages.types.js";

export const GET: reposGetPages = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreatePagesSite = async ($) => {
  return $.response[201].random();
};

export const PUT: reposUpdateInformationAboutPagesSite = async ($) => {
  return $.response[204].empty();
};

export const DELETE: reposDeletePagesSite = async ($) => {
  return $.response[204].empty();
};
