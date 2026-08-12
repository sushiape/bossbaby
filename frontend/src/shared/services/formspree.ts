const WAITLIST_ENDPOINT = "https://formspree.io/f/xgvrwpyr";

export async function submitWaitlist(formData: FormData): Promise<void> {
  const response = await fetch(WAITLIST_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  if (!response.ok) throw new Error("Waitlist submission failed.");
}
