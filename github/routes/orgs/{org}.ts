import type {
  orgsDelete,
  orgsGet,
  orgsUpdate,
} from "../../types/paths/orgs/{org}.types.js";

export const GET: orgsGet = async ($) => {
  const organization = $.context.getOrganization($.path.org);
  if (!organization) {
    return $.response[404].empty();
  }
  return $.response[200].json(organization);
};

export const PATCH: orgsUpdate = async ($) => {
  const existing = $.context.getOrganization($.path.org);
  if (!existing) {
    return $.response[404].empty();
  }

  const organization = $.context.saveOrganization({
    ...existing,
    login: $.path.org,
    billing_email: $.body.billing_email ?? existing.billing_email,
    company: $.body.company ?? existing.company,
    email: $.body.email ?? existing.email,
    twitter_username: $.body.twitter_username ?? existing.twitter_username,
    location: $.body.location ?? existing.location,
    name: $.body.name ?? existing.name,
    description: $.body.description ?? existing.description,
    has_organization_projects:
      $.body.has_organization_projects ?? existing.has_organization_projects,
    has_repository_projects:
      $.body.has_repository_projects ?? existing.has_repository_projects,
  });

  return $.response[200].json(organization);
};

export const DELETE: orgsDelete = async ($) => {
  if (!$.context.getOrganization($.path.org)) {
    return $.response[404].empty();
  }
  return $.response[202].empty();
};
