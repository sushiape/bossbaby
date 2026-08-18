# Restricted App integration contract

**Status:** Implemented boundary. The Restricted App production origin is `https://bossbabyremix.vercel.app` and the public website forwards the App Namespace to it.

This document defines the collaboration boundary between the public `bossbaby` website and the separately deployed `bossbabyremix` webapp. It is the implementation and operations handoff for both repositories.

## Agreed outcomes

- The public site remains available at `https://hibossbaby.com`.
- The restricted webapp is entered at `https://hibossbaby.com/app`.
- The website header includes an **App** item after **Bossbabes** and before **About**.
- Access control is a security boundary. Unauthorized visitors must not receive the restricted webapp, including its JavaScript bundles and other private assets.
- `bossbabyremix` owns authentication, developer authorization, the unauthorized experience, and protection of its application resources.
- `bossbaby` owns the public navigation entry and the top-level routing needed to connect the `/app` URL space to the separately deployed webapp.
- Supabase is the shared authentication and authorization provider; Vercel is the deployment and request-routing platform.

## Repository responsibilities

### `bossbaby`

- Add the App navigation item to every public page's desktop and mobile header.
- Render the App item as a plain same-tab link to `/app`; do not intercept it with the public site's React navigation callback.
- Use the exact navigation order `Drinks`, `AI machine`, `Bossbabes`, `App`, `About`.
- Use the exact label `App` and the same visual and responsive treatment as the other navigation items.
- Preserve the public URL `https://hibossbaby.com/app` when handing the request to `bossbabyremix`.
- Reserve routing rules needed for the agreed app URL space.
- Do not decide whether a visitor is a developer.
- Do not implement a duplicate under-construction, login, authorization, or app-unavailable page.
- Fail closed for the App Namespace: an upstream failure must not fall through to the public-site SPA or expose locally bundled app files.

### `bossbabyremix`

- Provide a server-verifiable developer session compatible with the shared Supabase platform decision.
- Authorize authenticated identities against a server-controlled developer allowlist or role.
- Return the restricted application only after successful server-side authorization.
- Return the agreed unauthorized experience for all other visitors.
- Protect app data and privileged operations independently of the page-delivery gate.
- Own every response within the App Namespace, including the under-construction, invitation, Entry Code, login, restricted application, authorization-failure, and app-unavailable experiences.
- Remain free of the retired Firebase authentication and Firestore coupling.

## Security invariants

- A client-side React check alone is insufficient authorization.
- A hidden navigation item is not access control.
- Device fingerprints and ordinary browser cookies are not trusted developer identities.
- Authorization secrets and the developer allowlist must not be embedded in browser-delivered code.
- Direct access to the `bossbabyremix` deployment must not bypass the production authorization gate.
- The Entry Code reveals developer sign-in but never grants access to the Restricted App.
- Bypassing or discovering the developer sign-in URL must not bypass Supabase authentication or developer authorization.
- Routing or upstream failures must not cause an App Namespace request to fall back to the public website SPA.
- Authorization-dependent responses and restricted resources must never enter a shared cache.

## URL contract

- `bossbaby` reserves the complete `/app` namespace, including `/app` and `/app/*`, exclusively for `bossbabyremix`.
- The App header item performs a document navigation to `/app`; it does not enter the public site's client-side router.
- The App header item opens in the current browser tab and does not use `target="_blank"`.
- Vercel forwards requests in the App Namespace to a stable production origin for the separately deployed `bossbabyremix` project without changing the visitor-visible `hibossbaby.com/app...` URL.
- The proxy strips the `/app` prefix when addressing the upstream: `/app` maps to upstream `/`, and `/app/:path*` maps to upstream `/:path*`.
- `bossbaby` must place the App Namespace forwarding rules before its public-site SPA fallback.
- `bossbaby` must not define a public-site React route within the App Namespace.
- `bossbabyremix` must support direct navigation and refreshes throughout the App Namespace, including a future path such as `/app/settings`.
- `bossbabyremix` must generate browser-visible route and asset URLs under `/app`, despite receiving prefix-stripped paths at its deployment origin.

### Required `bossbaby` routing shape

The verified stable upstream is `https://bossbabyremix.vercel.app`. The routing semantics are:

```json
{
  "rewrites": [
    { "source": "/app", "destination": "https://bossbabyremix.vercel.app/" },
    { "source": "/app/:path*", "destination": "https://bossbabyremix.vercel.app/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The production configuration uses this verified origin directly; no placeholder is deployable.

If the upstream is unavailable, `bossbaby` does not substitute a local page. The request fails closed, and `bossbabyremix` remains responsible for its controlled unavailable response whenever its deployment can run.

## Entry Code contract

- An unauthenticated request to `/app` receives the branded under-construction experience owned by `bossbabyremix`.
- The page contains a **Have an invite?** prompt that recognizes an exact Entry Code. It is not a message-delivery feature.
- Entry Code comparison happens only in server-side code. The code must be stored in a server-only Vercel environment variable and must not appear in browser JavaScript, HTML, source maps, public configuration, or any `VITE_` variable.
- A correct Entry Code sets a short-lived, signed, `HttpOnly`, `Secure`, and appropriately scoped cookie, then redirects the visitor to `/app/login`.
- An incorrect value is discarded, returns the generic **Invite not recognized** response, and reveals nothing about the code.
- Submitted values must not be persisted, logged, emailed, or forwarded anywhere.
- The verification endpoint must be rate-limited and return non-distinguishing failure responses.
- `/app/login` remains safe if visited directly: it may reveal sign-in UI but cannot provide app or data access without an authenticated, allowlisted developer identity.

## Developer authorization contract

- Developer Login uses Supabase email/password authentication and offers no developer sign-up action.
- Developer identities are provisioned manually in the shared Supabase project's dashboard.
- The server authorizes the authenticated Supabase user UUID against `restricted_app_developers`; merely existing in `auth.users` never grants access.
- The allowlist is server-controlled and inaccessible to browser roles.
- An authorized developer session lasts 12 hours and the allowlist is rechecked for every protected request.
- The verified developer session is also the identity used inside the Restricted App, so an Authorized Developer does not log in twice.
- App Sign-Up remains a future public product capability and is not part of the pre-release gate.

### Developer provisioning runbook

1. In the shared **Bossbaby Website** Supabase project, open **Authentication → Users → Add user**.
2. Create the developer's email/password identity and mark the email confirmed. Do not expose a sign-up route in the Restricted App.
3. In the Supabase SQL Editor, enable that exact identity:

```sql
insert into public.restricted_app_developers (user_id, label, enabled)
select id, 'Bossbaby developer', true
from auth.users
where lower(email) = lower('developer@example.com')
on conflict (user_id) do update
set enabled = true,
    updated_at = now();
```

Replace `developer@example.com` with the account created in step 2. The statement must affect one row; a zero-row result means the email does not match a Supabase identity. Disable access by setting `enabled = false` for that UUID rather than deleting the auth identity unless account deletion is separately intended.

## Local development contract

- Local integration mirrors production routing: the `bossbaby` Vite server proxies `/app` and `/app/*` to a separately running local `bossbabyremix` server and strips the `/app` prefix upstream.
- `bossbaby` retains `http://localhost:3000`; `bossbabyremix` uses `http://localhost:3001`.
- Both Vite servers use strict ports and fail startup if their assigned port is occupied rather than silently selecting another port.
- Developers enter through `http://localhost:3000/app`; they do not navigate directly to port 3001 for integration tests.
- If the local `bossbabyremix` server is unavailable, App Namespace requests fail and must not fall through to the website SPA.
- The local proxy target is development-server configuration, not a browser-visible authorization secret.

## Caching contract

- During restricted access, the complete App Namespace is non-cacheable by shared and browser caches.
- `bossbaby` must not add CDN caching headers or cache rules for `/app` or `/app/*`.
- `bossbabyremix` returns `Cache-Control: private, no-store` for under-construction, invitation, Entry Code, login, authorization, app HTML, protected JavaScript, protected assets, API, redirect, and error responses.
- A response produced for an Authorized Developer must never be reused for another visitor.
- This conservative policy remains until a separately reviewed public-launch caching design replaces it.

## Release contract

Release is coordinated in this order:

1. Deploy `bossbabyremix` to its stable production origin.
2. At that origin, verify the under-construction page, Entry Code flow, authorization gate, direct-origin protection, nested-route refreshes, and browser asset URLs.
3. Configure the `bossbaby` rewrite with `https://bossbabyremix.vercel.app`.
4. Deploy the `bossbaby` App navigation item and App Namespace rewrite together in one release.
5. Smoke-test `https://hibossbaby.com/app` as an anonymous visitor, an authenticated but unauthorized visitor, and an Authorized Developer.

If the integrated release fails, roll back the `bossbaby` release so the public navigation item and proxy are removed together. Never relax or bypass the `bossbabyremix` authorization gate as a recovery action.

## `bossbabyremix` handoff checklist

The deployed `bossbabyremix` handoff provides:

- a Vercel deployment with a stable production origin;
- browser-visible routes and resource URLs rooted at `/app`, while accepting prefix-stripped upstream requests;
- the public under-construction experience at upstream `/`;
- the invitation prompt and server-only Entry Code flow;
- server-verifiable Supabase sessions and server-side developer authorization;
- fail-closed protection for HTML, JavaScript, assets, APIs, nested routes, and the direct Vercel origin;
- `Cache-Control: private, no-store` throughout the restricted experience;
- local startup on strict port 3001;
- a controlled unavailable response; and
- passing evidence for the acceptance scenarios below.

The webapp handoff back to `bossbaby` must state its stable production origin, local startup command, required environment setup without secret values, health-check URL, and any cookie/path requirements the reverse proxy must preserve.

## Acceptance scenarios

The integrated release is evaluated against these scenarios:

1. An anonymous request receives the under-construction experience and no restricted app bundle.
2. A non-matching invitation value is discarded without being interpreted as access authorization.
3. An incorrect Entry Code neither reveals the expected value nor opens developer sign-in.
4. A correct Entry Code opens developer sign-in but does not itself grant app access.
5. An authenticated, non-allowlisted identity receives no restricted app or data.
6. An Authorized Developer receives the app.
7. Direct requests for protected JavaScript, assets, APIs, and nested paths are denied without authorization.
8. Direct access through the Vercel project origin enforces the same gate.
9. Refreshing a nested browser URL beneath `/app` resolves correctly through a prefix-stripping proxy.
10. All App Namespace responses use the agreed private/no-store policy.
11. Missing or invalid sessions, authorization-service errors, and upstream failures fail closed.
12. The app runs locally on strict port 3001 behind the website's prefix-stripping proxy.

## Implemented `bossbaby` integration

This repository implements the universal same-tab App header item, the strict local proxy to port 3001, and the production `/app` rewrites using the verified stable origin. Those changes are tested and released together; no placeholder production origin is committed.

## Open integration decisions

- No integration decisions remain open.

## Resolved implementation decisions

- Stable preview deployments enforce the same Entry Code, Supabase authentication, allowlist, routing, asset protection, and no-store policy as production.
- Wrong Entry Codes, invalid credentials, non-allowlisted identities, and dependency failures use distinct approved messages without revealing secrets or restricted resources.
- Structured server logs record request IDs, timestamps, routes, and authorization outcomes but never Entry Code submissions, passwords, or tokens.
- Migration away from Firebase is complete; product data remains session-local while the shared Supabase project supplies developer authentication and authorization.
