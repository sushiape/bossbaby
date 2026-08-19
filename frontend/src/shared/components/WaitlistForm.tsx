import type { CSSProperties, ReactNode } from "react";
import { useWaitlistForm } from "../services/useWaitlistForm";

interface WaitlistFormProps {
  submittingLabel: string;
  idleLabel: string;
  successMessage: ReactNode;
  errorMessage: ReactNode;
  formClassName?: string;
  fieldsClassName?: string;
  inputClassName?: string;
  inputStyle?: CSSProperties;
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  successClassName?: string;
  successStyle?: CSSProperties;
  errorClassName?: string;
  errorStyle?: CSSProperties;
}

export function WaitlistForm({
  submittingLabel,
  idleLabel,
  successMessage,
  errorMessage,
  formClassName,
  fieldsClassName,
  inputClassName,
  inputStyle,
  buttonClassName,
  buttonStyle,
  successClassName,
  successStyle,
  errorClassName,
  errorStyle,
}: WaitlistFormProps) {
  const { status, handleSubmit } = useWaitlistForm();

  return (
    <form onSubmit={handleSubmit} className={formClassName} aria-live="polite">
      <div className={fieldsClassName}>
        <input
          type="email"
          name="email_address"
          placeholder="enter your email"
          aria-label="Email address"
          autoComplete="email"
          required
          className={inputClassName}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className={buttonClassName}
          style={buttonStyle}
        >
          {status === "submitting" ? submittingLabel : idleLabel}
        </button>
      </div>
      {status === "success" && (
        <p className={successClassName} style={successStyle}>
          {successMessage}
        </p>
      )}
      {status === "error" && (
        <p className={errorClassName} style={errorStyle}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
