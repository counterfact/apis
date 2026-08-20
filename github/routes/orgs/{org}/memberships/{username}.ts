import type { orgsGetMembershipForUser } from "../../../../types/paths/orgs/{org}/memberships/{username}.types.js";
import type { orgsSetMembershipForUser } from "../../../../types/paths/orgs/{org}/memberships/{username}.types.js";
import type { orgsRemoveMembershipForUser } from "../../../../types/paths/orgs/{org}/memberships/{username}.types.js";

export const GET: orgsGetMembershipForUser = async ($) => {
  const membership = $.context.getOrgMembership($.path.org, $.path.username);
  return membership
    ? $.response[200].json(membership)
    : $.response[404].json({ message: "Not Found", status: "404" });
};

export const PUT: orgsSetMembershipForUser = async ($) => {
  return $.response[200].json(
    $.context.setOrgMembership(
      $.path.org,
      $.path.username,
      $.body.role ?? "member",
    ),
  );
};

export const DELETE: orgsRemoveMembershipForUser = async ($) => {
  return $.context.deleteOrgMembership($.path.org, $.path.username)
    ? $.response[204].empty()
    : $.response[404].json({ message: "Not Found", status: "404" });
};
