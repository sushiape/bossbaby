import { useState, type FormEvent } from "react";
import { submitWaitlist } from "./formspree";

export type WaitlistStatus = "idle" | "submitting" | "success" | "error";

export function useWaitlistForm() {
  const [status, setStatus] = useState<WaitlistStatus>("idle");

  const resetStatus = () => setStatus("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    try {
      await submitWaitlist(new FormData(form));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return { status, handleSubmit, resetStatus };
}
