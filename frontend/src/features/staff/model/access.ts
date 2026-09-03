import type { StaffAccess, WorkspaceTab } from "./types";

/**
 * The frontend's capability knowledge is presentation only. Hiding a tab is a
 * courtesy so a Staff Member is not offered a view they cannot use; every real
 * check happens in the Edge Function on the verified JWT.
 */
export function hasCapability(access: StaffAccess | null, capability: string): boolean {
  return access?.capabilities.some((held) => held.name === capability) ?? false;
}

/** My Access is always present — every Staff Member can see what they hold. */
export function availableTabs(access: StaffAccess | null): WorkspaceTab[] {
  const tabs: WorkspaceTab[] = [];
  if (hasCapability(access, "waitlist.read")) tabs.push("waitlist");
  if (hasCapability(access, "surveys.read")) tabs.push("surveys");
  tabs.push("access");
  return tabs;
}

/**
 * Where a Staff Member arrives after signing in. An identity holding only
 * `restricted_app.access` has no Waitlist tab and lands on My Access.
 */
export function landingTab(access: StaffAccess | null): WorkspaceTab {
  return availableTabs(access)[0];
}

/** A Staff Member is any authenticated identity holding at least one grant. */
export function isStaffMember(access: StaffAccess | null): boolean {
  return (access?.capabilities.length ?? 0) > 0;
}
