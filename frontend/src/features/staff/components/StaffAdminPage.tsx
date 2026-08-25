import { useStaffSession } from "../hooks/useStaffSession";
import { STAFF_THEME } from "../model/theme";
import AccessDenied from "./AccessDenied";
import SetNewPassword from "./SetNewPassword";
import StaffSignIn from "./StaffSignIn";
import StaffWorkspace from "./StaffWorkspace";

/**
 * The /admin route. Unlisted in public navigation, but the URL is not a security
 * control — every capability is enforced by the staff Edge Function.
 */
export default function StaffAdminPage() {
  const { status, access, error, signIn, signOut, requestPasswordRecovery, completePasswordSetup } =
    useStaffSession();

  if (status === "unconfigured") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: STAFF_THEME.background }}
      >
        <p className="text-sm text-black/70">The Supabase backend is not configured.</p>
      </main>
    );
  }

  if (status === "loading") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: STAFF_THEME.background }}
      >
        <p className="text-sm text-black/50">Loading…</p>
      </main>
    );
  }

  if (status === "password-setup") {
    return <SetNewPassword onSetPassword={completePasswordSetup} />;
  }

  if (status === "signed-out") {
    return <StaffSignIn onSignIn={signIn} onRecover={requestPasswordRecovery} />;
  }

  if (status === "denied" || !access) {
    return <AccessDenied message={error} onSignOut={signOut} />;
  }

  return <StaffWorkspace access={access} onSignOut={signOut} />;
}
