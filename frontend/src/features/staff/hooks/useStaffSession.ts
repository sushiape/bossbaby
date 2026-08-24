import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { fetchAccess, StaffApiError } from "../api/staffApi";
import { isStaffBackendConfigured, requireStaffSupabase, staffSupabase } from "../api/staffClient";
import { isRecoveryUrl } from "../model/recovery";
import type { StaffAccess } from "../model/types";

export type StaffSessionStatus =
  | "loading"
  | "signed-out"
  | "denied"
  | "authorized"
  | "recovery"
  | "unconfigured";

export interface StaffSessionState {
  status: StaffSessionStatus;
  access: StaffAccess | null;
  error: string | null;
}

/**
 * Owns the workspace's signed-in state. A session alone is not enough: an
 * authenticated identity with no grants is an App User, and the Edge Function
 * says so with 403. That distinction is what separates "denied" from
 * "authorized" here.
 */
export function useStaffSession() {
  const [state, setState] = useState<StaffSessionState>({
    status: isStaffBackendConfigured ? "loading" : "unconfigured",
    access: null,
    error: null,
  });

  const resolve = useCallback(async (session: Session | null, isActive: () => boolean) => {
    if (!session) {
      if (isActive()) setState({ status: "signed-out", access: null, error: null });
      return;
    }
    try {
      const access = await fetchAccess();
      // A sign-out may have landed while /me was in flight; the newer state wins.
      if (isActive()) setState({ status: "authorized", access, error: null });
    } catch (error) {
      if (!isActive()) return;
      if (error instanceof StaffApiError && error.status === 403) {
        setState({ status: "denied", access: null, error: error.message });
        return;
      }
      if (error instanceof StaffApiError && error.status === 401) {
        setState({ status: "signed-out", access: null, error: null });
        return;
      }
      setState({
        status: "denied",
        access: null,
        error: error instanceof Error ? error.message : "Could not load staff access.",
      });
    }
  }, []);

  useEffect(() => {
    if (!staffSupabase) return;
    let active = true;
    const isActive = () => active;

    // A recovery link lands here with type=recovery in the URL fragment, and
    // detectSessionInUrl signs the identity in as it consumes it. Reading the
    // fragment directly is what separates "arrived to set a password" from an
    // ordinary visit: the PASSWORD_RECOVERY event can fire before this listener
    // attaches, and without this the staff member is dropped into the workspace
    // with their old password still in place.
    if (isRecoveryUrl(window.location.hash)) {
      setState({ status: "recovery", access: null, error: null });
      return () => {
        active = false;
      };
    }

    void staffSupabase.auth.getSession().then(({ data }) => resolve(data.session, isActive));

    const { data: subscription } = staffSupabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      // TOKEN_REFRESHED fires roughly hourly and carries the same identity.
      // Re-resolving there would remount the workspace and lose the open tab.
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
      if (event === "PASSWORD_RECOVERY") {
        setState({ status: "recovery", access: null, error: null });
        return;
      }
      setState((current) => ({ ...current, status: "loading" }));
      void resolve(session, isActive);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [resolve]);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = requireStaffSupabase();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const requestPasswordRecovery = useCallback(async (email: string) => {
    const client = requireStaffSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    });
    if (error) throw new Error(error.message);
  }, []);

  const completePasswordRecovery = useCallback(async (password: string) => {
    const client = requireStaffSupabase();
    const { error } = await client.auth.updateUser({ password });
    if (error) throw new Error(error.message);
    window.history.replaceState(null, "", window.location.pathname);
    const { data } = await client.auth.getSession();
    setState({ status: "loading", access: null, error: null });
    await resolve(data.session, () => true);
  }, [resolve]);

  const signOut = useCallback(async () => {
    const client = requireStaffSupabase();
    await client.auth.signOut();
    setState({ status: "signed-out", access: null, error: null });
  }, []);

  return { ...state, signIn, signOut, requestPasswordRecovery, completePasswordRecovery };
}
