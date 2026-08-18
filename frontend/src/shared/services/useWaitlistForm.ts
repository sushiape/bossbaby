import { useState, type FormEvent } from "react";
import { createWaitlistSubscription } from "./waitlistApi";

export type WaitlistStatus = "idle" | "submitting" | "success" | "error";

export function useWaitlistForm() {
  const [status, setStatus] = useState<WaitlistStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const email = new FormData(form).get("email_address");
    if (typeof email !== "string") {
      setStatus("error");
      return;
    }
    try {
      await createWaitlistSubscription(email);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return { status, handleSubmit };
}
