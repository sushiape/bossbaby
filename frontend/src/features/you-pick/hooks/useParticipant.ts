import { useCallback, useEffect, useState } from "react";
import { ensureAnonymousParticipant } from "../../../lib/supabaseClient";

export function useParticipant() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ initialized: boolean; ready: boolean; error: string | null }>({
    initialized: false,
    ready: false,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState({ initialized: false, ready: false, error: null });
    ensureAnonymousParticipant()
      .then(() => active && setState({ initialized: true, ready: true, error: null }))
      .catch((error: unknown) => {
        console.error("Anonymous sign-in failed", error);
        if (active) {
          setState({
            initialized: true,
            ready: false,
            error: "Anonymous participation could not start. Public results remain available; retry to vote or post.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return { ...state, retry };
}
