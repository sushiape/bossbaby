# Staff Workspace — waitlist management and communications

Status: accepted, partially implemented.

Delivered: steps 1–3 of the delivery order in section 9 — the capability
registry, the staff identity surface (`GET /me`), and the workspace shell at
`/admin` with Staff Sign-In, access denied, and **My Access**. Steps 4–10 are
not built; the Waitlist tab is a placeholder for them.

This spec builds the first feature area of the Staff Workspace: managing Waitlist
Subscriptions and sending communications to them. Domain terms are defined in
`CONTEXT.md` and used here without redefinition.

## 1. Scope

In scope:

- A `/admin` route on this website hosting the Staff Workspace.
- Staff Sign-In using Supabase email/password, isolated from the public site's
  anonymous Participant session.
- A capability registry replacing numeric access levels, unifying the existing
  `restricted_app_developers` allowlist.
- A **My Access** view.
- Waitlist Subscription listing, search, Staff Import, and Waitlist Removal.
- Communication Drafts, Send Scope selection, sending through Resend Broadcasts,
  and a read-only Sent Communication history.
- Resend unsubscribe handling that performs Waitlist Removal.

Out of scope, deliberately: a public link to `/admin`; staff self-registration;
any capability-management UI; changes to the public waitlist signup flow;
Pending/Confirmed subscription states; rich text, images, attachments, templates,
scheduling, segmentation, engagement analytics; permanent recipient-email
history; a dedicated test-send mode.

## 2. Design constraints inherited from the repository

These are not re-decided here.

- ADR 0008 / 0010 — browsers never touch private tables. `anon` and
  `authenticated` are revoked; Edge Functions hold the server-only secret and are
  the authorization authority.
- ADR 0001 — one capability-grouped Edge Function per feature area, not one per
  operation.
- ADR 0009 — expand-contract cutovers. The `restricted_app_developers` migration
  expands into the capability registry before anything contracts.
- ADR 0007 / 0013 — release ordering is database → Edge Functions → webapp.
- Migrations are additive; existing migration files are never edited.
- The unlisted `/admin` URL is not a security control.

## 3. Authorization model

### 3.1 Capability registry

Two tables, both RLS-enabled with all browser roles revoked and only
`service_role` granted:

`public.staff_capabilities` — the registry of capability names that exist.

| column | type | notes |
| --- | --- | --- |
| `name` | text primary key | e.g. `waitlist.read` |
| `description` | text not null | plain language, shown in **My Access** |
| `created_at` | timestamptz not null default now() | |

Seeded with exactly:

| name | description |
| --- | --- |
| `restricted_app.access` | Use the unreleased Bossbaby application before launch. |
| `waitlist.read` | View waitlist subscriptions and communication history. |
| `waitlist.manage` | Add and permanently remove waitlist subscriptions. |
| `communications.draft` | Create and edit communication drafts. |
| `communications.send` | Send communications to waitlist subscriptions. |

`public.staff_capability_grants` — which identity holds which capability.

| column | type | notes |
| --- | --- | --- |
| `user_id` | uuid references `auth.users(id)` on delete cascade | |
| `capability` | text references `staff_capabilities(name)` | |
| `granted_at` | timestamptz not null default now() | |
| `granted_by` | uuid null references `auth.users(id)` | null for migrated rows |
| | primary key `(user_id, capability)` | |

Grants are made manually in Supabase for version one. There is no grant API and
no UI that writes to these tables.

### 3.2 Definitions in terms of the registry

- A **Staff Member** is an authenticated identity holding at least one row in
  `staff_capability_grants`, whatever the capability.
- An **App User** is an authenticated identity holding none.
- Holding only `restricted_app.access` still makes someone a Staff Member for the
  purpose of entering `/admin`; they will see **My Access** and nothing else.

### 3.3 Compatibility with the Restricted App

The Restricted App is deployed separately and cannot be released in lockstep, and
`docs/app-integration-contract.md` documents its team provisioning developers by
inserting directly into `restricted_app_developers`. Both the function and the
table therefore stay fully operational; nothing that works today changes
behavior.

`is_restricted_app_developer()` is retained as a **deprecated** compatibility
boundary. Its body reads the capability registry **union** the legacy allowlist:

```sql
exists (select 1 from staff_capability_grants
        where user_id = auth.uid() and capability = 'restricted_app.access')
or
exists (select 1 from restricted_app_developers
        where user_id = auth.uid() and enabled)
```

The union is the point. An identity provisioned through either path is
authorized, so this migration is safe to deploy without coordinating a release
with `bossbabyremix`, and a developer provisioned through the old runbook after
deployment still gets in.

Deprecation is announced through three channels rather than a document alone:

1. The function is converted to `plpgsql` solely so it can `RAISE WARNING` on
   every call, naming the replacement. This reaches the Restricted App's
   operators through the Postgres logs. The return value is unchanged.
2. `comment on function` and `comment on table` mark both as deprecated, visible
   to anyone inspecting the schema.
3. `docs/app-integration-contract.md` is updated in the same release, and its
   provisioning runbook now writes to `staff_capability_grants`.

New Staff Workspace code never calls the deprecated function. It calls
`has_staff_capability(name)`, which reads the registry only.

Removal is a later, separate release, and is blocked on `bossbabyremix`
confirming it no longer calls the deprecated function or reads the legacy table.
Backfill covers only rows with `enabled = true`; the registry expresses
revocation as the absence of a grant.

### 3.4 Enforcement

Every capability check happens inside the Edge Function, on the verified JWT,
before any data access. The frontend's capability knowledge is presentation only:
hiding a tab is a courtesy, never a control. A request for a capability the
caller lacks returns `403 FORBIDDEN`. A request with no or invalid identity
returns `401`.

## 4. Data model

### 4.1 Waitlist subscriptions

`public.waitlist_subscriptions` exists and is extended additively:

- add `source text not null default 'website'`, constrained to a non-empty
  lowercase key so new channels can be added without a schema change;
- add `created_by uuid null references auth.users(id)`, set only for Staff Import.

Existing rows take `source = 'website'` from the default. The one-time Formspree
transfer inserts with `source = 'legacy_formspree'`. Staff Import uses
`source = 'staff'`.

**First-touch attribution.** The public endpoint keeps its existing
`ignoreDuplicates` upsert, so a duplicate submission never overwrites `source` or
`created_at`. Staff Import uses the same semantics and reports duplicates as
skipped. This is enforced at the repository layer, not left to callers.

### 4.2 Communication drafts

`public.communication_drafts`

| column | type | notes |
| --- | --- | --- |
| `id` | uuid primary key | |
| `subject` | text not null | 1–200 chars after trim |
| `body` | text not null | plain text, 1–100000 chars |
| `created_by` | uuid not null references `auth.users(id)` | |
| `created_at` / `updated_at` | timestamptz not null default now() | |

Drafts are shared across Staff Members, not private per author — the team is
small and hiding a colleague's draft has no benefit. `created_by` is provenance,
not ownership, and does not gate editing or deletion.

Room for later images and attachments is left by keeping `body` a plain-text
column and adding a future sibling table rather than by adding unused columns
now. No `content_type` column is introduced speculatively.

### 4.3 Sent communications

`public.sent_communications`

| column | type | notes |
| --- | --- | --- |
| `id` | uuid primary key | |
| `draft_id` | uuid null references `communication_drafts(id)` on delete set null | provenance; the draft stays editable and may later be deleted |
| `subject` | text not null | snapshot, not a reference |
| `body` | text not null | snapshot |
| `send_scope` | text not null | `selected` or `all` |
| `recipient_count` | integer not null | exact count at send time |
| `sent_by` | uuid not null references `auth.users(id)` | |
| `sent_at` | timestamptz not null default now() | |
| `provider_broadcast_id` | text null | Resend's handle; null until accepted |
| `delivery_state` | text not null | `queued`, `accepted`, `failed` |
| `delivery_detail` | text null | provider error or aggregate summary |

Recipient email addresses are **not** stored. `recipient_count` and `send_scope`
are the entire audience record, which is what keeps this from becoming a second
PII copy.

The snapshot row is written **before** the provider is called, in state `queued`,
and it owns the provider handle. A send that the provider never accepts ends as
`failed` and remains visible in history — an attempted send is history too.

There is no update or delete path for this table through the workspace.

## 5. Edge Function surface

One new capability-grouped function, `staff`, at
`backend/supabase/functions/staff/`, following the existing `waitlist` module
shape (`index.ts`, `route.ts`, `repository.ts`, `types.ts`, `validation.ts`).

Every route requires a verified staff JWT. `_shared/auth.ts` gains a
`staffMember(request, capability)` helper alongside the existing `participant()`
— it verifies the token, loads the identity's grants, asserts the required
capability, and returns the identity plus its full capability set.

| method + path | capability | behavior |
| --- | --- | --- |
| `GET /me` | any grant | The signed-in identity and its capabilities with descriptions. Powers **My Access**. |
| `GET /waitlist/subscriptions` | `waitlist.read` | Paged list with `search`, `limit`, `cursor`. Returns email, source, created_at, id, plus total count. |
| `POST /waitlist/subscriptions` | `waitlist.manage` | Staff Import. Body: `emails[]`, `consent_affirmed: true`. Rejects if consent is not affirmed. |
| `DELETE /waitlist/subscriptions/:id` | `waitlist.manage` | Waitlist Removal from Supabase and the Delivery Representation. |
| `GET /communications/drafts` | `communications.draft` | List drafts. |
| `POST /communications/drafts` | `communications.draft` | Create. |
| `PUT /communications/drafts/:id` | `communications.draft` | Explicit save. |
| `DELETE /communications/drafts/:id` | `communications.draft` | Delete after confirmation. |
| `POST /communications/sends` | `communications.send` | Send. Body: `draft_id`, `send_scope`, `subscription_ids[]` when scope is `selected`, `expected_recipient_count`. |
| `GET /communications/sends` | `waitlist.read` | Sent Communication history. |

The public `waitlist` function is unchanged. Its deliberate non-disclosure of
whether an address already exists stays as it is; the staff function is a
separate surface with a separate authorization story.

### 5.1 Staff Import behavior

Input is pasted text, one address per line. The function normalizes (trim,
lowercase), validates shape with the same rule as the public endpoint, then
returns a per-request summary:

```json
{ "added": 12, "skipped_duplicate": 3, "rejected": [{ "line": 7, "value": "…", "reason": "malformed" }] }
```

A partially valid paste is not rejected wholesale — valid addresses are added and
invalid ones are reported. `consent_affirmed` must be `true` or the whole request
fails with `400`; the affirmation is recorded by the fact that `created_by` and
`source = 'staff'` are set on the resulting rows.

## 6. Sending

### 6.1 Sequence

1. Frontend shows the final confirmation: subject, sender identity, exact
   recipient count, and whether the scope is selected or all. The action reads
   **Send to N people**.
2. `POST /communications/sends` arrives with `expected_recipient_count`.
3. The function resolves the Recipient Selection from Supabase — for scope `all`,
   every subscription that exists at this instant, ignoring any search text or
   pagination the Staff Member was looking at.
4. If the resolved count differs from `expected_recipient_count`, the send is
   **rejected** with `409 RECIPIENT_SET_CHANGED` and the current count. The Staff
   Member re-confirms against the real number. This is the fail-closed rule.
5. A `sent_communications` row is written with state `queued`.
6. The Delivery Representation is reconciled at this moment for exactly this
   recipient set — contacts added or removed in Resend so the audience matches
   Supabase. Supabase is canonical; writes during ordinary CRUD are best-effort,
   and this send-time reconcile is the authority.
7. If reconciliation cannot establish the intended audience, the row moves to
   `failed` with a reason and **no broadcast is created**.
8. The Resend broadcast is created and sent. Its id is stored and the row moves
   to `accepted`.
9. The response distinguishes acceptance from delivery in its wording. The UI
   says "queued with the email provider," never "sent."

Sending to the Staff Member's own waitlist subscription is the real-path test.
No separate test mode exists.

### 6.2 Unsubscribe webhook

A Resend webhook endpoint receives unsubscribe events and performs permanent
Waitlist Removal: delete the Supabase subscription, delete the Resend contact.

- The endpoint verifies the provider's signature before acting.
- It is idempotent by email: removing an address that is already absent is a
  success, not an error. This is what makes retried webhook deliveries safe
  without an events table.
- Deletion is terminal. Re-entry happens only through a genuine public signup or
  a consented Staff Import, both of which constitute new consent. No suppression
  list and no removal audit are kept, consistent with avoiding secondary PII.

## 7. Frontend

### 7.1 Route and session isolation

`/admin` is a route of this website. It is not linked from public navigation and
is excluded from any sitemap.

The public site signs visitors in anonymously via the shared `supabase` client in
[supabaseClient.ts](frontend/src/lib/supabaseClient.ts). Staff Sign-In must not
clobber that Participant session. A second Supabase client is created for the
workspace with its own `storageKey` (e.g. `bossbaby-staff-auth`), so the two
sessions coexist in the same browser. `persistSession` and `autoRefreshToken`
stay on; `detectSessionInUrl` is enabled for this client only, since password
recovery returns through a URL fragment.

### 7.2 Screens

- **Staff Sign-In** — signed-out state. Email, password, and password recovery.
  No sign-up affordance of any kind.
- **Access denied** — an authenticated identity with no grants. States plainly
  that the account has no staff capabilities, and offers sign-out.
- **Workspace** — header with **Waitlist** and **My Access** tabs. The Waitlist
  tab is present only with `waitlist.read`; an identity holding only
  `restricted_app.access` lands on **My Access**.
- **My Access** — read-only: the signed-in identity, each held capability with
  its plain-language description, and sign-out.
- **Waitlist → Subscriptions** — table with selection checkbox, email, source,
  join date, delete action; plus search, total count, Staff Import, and
  **Compose for all**. Nothing is selected by default.
- **Waitlist → Communications** — draft list, composer (subject + plain-text
  body), unsaved-changes indicator, **Save draft**, delete with confirmation, and
  the read-only Sent Communication history.

Subscriptions and Communications are local views inside the Waitlist tab, not
header tabs.

### 7.3 Selection and scope

Row selection and **Compose for all** are different actions producing different
`send_scope` values, and the confirmation states which one is in play. Selection
does not survive a search or a page change; if the Staff Member changes either,
the selection is cleared and this is visible, so a stale selection can never be
silently sent.

### 7.4 Visual design

White, black, and subtle Bossbaby-pink. No public-site animations. Dense,
functional table layout.

## 8. Provider configuration (operational, not code)

None of this is code. It is done once, by hand, and steps 8 and 9 of the delivery
order cannot be verified until it is finished. The outbound half is finished and
verified; the inbound half is not. Section 8.6 is the current status of record.

### 8.1 Sending and reply identity

- Sending identity: `Bossbaby <newsletter@hibossbaby.com>`.
- Sending does not require a mailbox. Only DNS authorization is needed for the
  outbound direction.
- Replies were to be handled by adding `newsletter@hibossbaby.com` as a Namecheap
  email forwarding rule pointing at the existing public contact inbox already
  named in [BossBabyPrivacyPage.jsx](frontend/src/pages/BossBabyPrivacyPage.jsx).
  **This is not in place**: the apex MX records are gone and inbound mail is
  delivered nowhere (see 8.3). The address must not be used as a reply-to until
  an inbound path is restored.

### 8.2 Where DNS actually lives

`hibossbaby.com` is deployed on Vercel, but **Vercel does not hold its DNS**. The
domain is registered at Namecheap and delegated to Namecheap nameservers; Vercel
lists it as a third-party domain and holds zero records for it. All records below
are edited in the Namecheap dashboard. `vercel dns` cannot be used.

Verified against the authoritative nameservers on 2026-08-25:

| record | current value |
| --- | --- |
| NS | `dns1.registrar-servers.com`, `dns2.registrar-servers.com` |
| A | `216.198.79.1` |
| DKIM (TXT) | `resend._domainkey` — Resend's public key, verified |
| SPF (TXT) | `send.hibossbaby.com` → `v=spf1 include:amazonses.com ~all`, verified |
| SPF (MX) | `send.hibossbaby.com` → `feedback-smtp.us-east-1.amazonses.com`, priority 10, verified |
| DMARC | `_dmarc` → `v=DMARC1; p=none; rua=mailto:bossbabiezzy@gmail.com` |
| MX (apex) | **none** |
| SPF (apex) | **none** |

### 8.3 Record changes as they were actually made

The apex SPF merge this section previously prescribed did not happen and was not
needed. Resend scopes its own records to a `send.hibossbaby.com` subdomain, so
sending authorization never touches the apex and cannot collide with whatever a
forwarding provider publishes there. That is strictly better than merging two
`include` mechanisms into one apex record: there is no shared record to get
wrong, and the RFC 7208 duplicate-SPF hazard does not arise at all.

**DKIM, SPF, and the bounce MX — added and verified.** All three live under
Resend's own hostnames. Sending is enabled and confirmed working end to end:
Supabase transactional mail delivered through Resend on 2026-08-25.

**DMARC — added** at `p=none`, reporting to `bossbabiezzy@gmail.com`. Reports
observe without affecting delivery; a stricter policy is a later decision.

**Apex MX and apex SPF — absent.** Both were recorded as present on 2026-08-24
and both are now gone, confirmed against `dns1` and `dns2` directly rather than
through a cache. These were Namecheap Email Forwarding's records. Whether they
were removed deliberately or lost while Resend's records were added is not
recoverable from DNS, and nothing in this repository records the change.

The consequence is that **inbound mail to `@hibossbaby.com` is not delivered
anywhere.** A send to `newsletter@hibossbaby.com` on 2026-08-25 did not arrive.
Sending is unaffected — it requires no MX record — so this blocks replies, not
delivery. Section 8.4 step 5 exists to catch exactly this, and it did.

Resolving it is a live decision, not a documented one: either restore Namecheap
Email Forwarding, or enable receiving on Resend (currently disabled) and point
apex MX there. The second keeps one provider but was not considered when this
section was first written. Until one is chosen, the reply address in section 8.1
is unreachable and must not be advertised.

### 8.4 Order of operations

1. ~~Create the Resend account and add `hibossbaby.com` as a sending domain.~~
   Done — the domain is verified and sending is enabled.
2. ~~In Namecheap: add the records Resend generates.~~ Done — DKIM, the `send`
   subdomain SPF and bounce MX, and DMARC are published and verified. Resend
   scopes its records to `send.hibossbaby.com`, so no apex SPF edit was required.
3. Add an inbound path for `newsletter@hibossbaby.com`. **Outstanding** — no
   apex MX record exists, so this cannot work until 8.3 is resolved.
4. ~~Confirm domain verification in Resend.~~ Done.
5. **Confirm inbound mail arrives** by sending to `newsletter@hibossbaby.com` and
   to an address that was being forwarded before this change. **Run on
   2026-08-25 and failed** — the message was delivered nowhere.

Step 5 is the step most often skipped and the one that catches a record mistake.
It caught this one. Sending is unaffected and does not wait on it, but the
reply-to identity in 8.1 does.

### 8.5 Provider limits

Resend's free Marketing tier covers up to 1,000 contacts with no published daily
marketing-send quota. Provider rate, bounce, and abuse limits still apply and are
deliberately not modeled in this system.

### 8.6 Current status

Verified 2026-08-25 against Resend and the authoritative nameservers.

**Done.** The Resend account exists and `hibossbaby.com` is verified with sending
enabled. DKIM, SPF, and the bounce MX are in place and verified. DMARC is
published at `p=none`. Supabase transactional email is routed through Resend on
the `supabase-smtp-noreply` API key and is confirmed delivering.

**Not done.** No forwarding rule, and no inbound path at all — see 8.3. No
audience, no contacts, and no broadcast exist in Resend, so there is nothing yet
to send a Communication to. No API key has been issued for the Edge Function that
steps 8 and 9 will need; the existing key is scoped to SMTP and must not be
reused for it.

Nothing in this repository calls Resend. The provider work above unblocks steps 8
and 9 of the delivery order but does not begin them.

## 9. Delivery order

Each step is independently releasable and respects database → functions → webapp.

1. **Capability registry (expand).** Registry tables, seed, backfill from
   `restricted_app_developers`, `has_staff_capability()`, and the deprecated
   union-reading `is_restricted_app_developer()` with its runtime warning. The
   Restricted App keeps working with no change on its side.
2. **Staff identity surface.** `staffMember()` helper, `staff` Edge Function with
   `GET /me` only.
3. **Workspace shell.** `/admin`, isolated auth client, Staff Sign-In, access
   denied, **My Access**. First end-to-end slice — a Staff Member can sign in and
   see their capabilities.
4. **Subscription columns.** Add `source` and `created_by` additively.
5. **Subscription management.** List, search, Staff Import, Waitlist Removal —
   function then UI.
6. **Formspree transfer.** One-time import of the 21 consented addresses as
   `legacy_formspree`. Addresses never appear in docs, logs, or commit messages.
7. **Drafts.** Table, CRUD routes, composer with explicit save.
8. **Sending.** `sent_communications`, Resend reconcile-and-send, confirmation
   flow, history.
9. **Unsubscribe webhook.** Signature verification and idempotent removal.
10. **Contract.** Drop `restricted_app_developers` and
    `is_restricted_app_developer()` in a later release, only after
    `bossbabyremix` confirms it has migrated to `has_staff_capability()`.

Step 6 is blocked on step 4. Steps 8 and 9 are blocked on provider
configuration in section 8. Step 10 is blocked on `bossbabyremix` migrating off
the deprecated function and table — an external dependency this repository
cannot verify on its own.

## 10. Open questions

- Which Resend audience the Delivery Representation maps to when the contact
  count approaches the 1,000 free-tier limit.
- Whether the aggregate `delivery_state` should be refreshed by polling Resend or
  by additional webhook events. Section 4.3 stores the handle either way, so this
  can be decided at step 8 without reworking the schema.
