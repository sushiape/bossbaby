# Reconcile the delivery representation at send time

Supabase is the canonical waitlist; the Resend audience is a Delivery
Representation that exists only so the provider can address a send. Rather than
synchronizing contacts on every subscription write, the Staff Workspace
reconciles the provider's audience against Supabase immediately before each send
and fails closed if it cannot establish the intended audience.

Write-through synchronization was the alternative: call Resend on every add and
Waitlist Removal. It was rejected because it couples staff CRUD availability to
provider uptime — a Resend outage would either block a Waitlist Removal or leave
Supabase and the provider silently divergent with no later point at which the
divergence is caught. Since a send is the only moment the provider copy actually
matters, that is the moment to make it correct.

Ordinary writes still call Resend best-effort, but nothing depends on those calls
succeeding. Every send resolves its Recipient Selection from Supabase, rejects
the request if the resolved count differs from the count the Staff Member
confirmed, reconciles contacts for exactly that set, and only then creates the
broadcast. A reconciliation that cannot complete leaves a `failed` Sent
Communication and creates no broadcast, so the failure is visible rather than
partial.

The cost is a slower, more failure-prone send path and one reconciliation pass
per send, which is acceptable at a waitlist of well under a thousand contacts.
The benefit is that provider drift can never cause a send to reach an audience
the team did not confirm.
