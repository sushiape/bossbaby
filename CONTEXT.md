# BossBaby Website

BossBaby Website contains public brand and community experiences and provides entry to the unreleased Bossbaby application.

## Language

**You Pick**:
A community poll where participants select packaging and flavour preferences and may propose flavours.

**Participant**:
A person who uses You Pick without needing a registered account. Participant identity distinguishes ownership and one-vote-per-poll behavior.
_Avoid_: Customer, registered user

**Suggestion**:
A participant-owned flavour proposal visible to everyone. Its owner may remove it.
_Avoid_: Comment, post

**Vote**:
A participant's current selections for one poll. Submitting again replaces that participant's previous selections for the poll.
_Avoid_: Ballot submission, response

**Vote Result**:
Public aggregate counts or percentages derived from votes.
_Avoid_: Vote rows, ballots

**Restricted App**:
The unreleased Bossbaby application whose use is limited to explicitly authorized people until public launch.
_Avoid_: Hidden page, preview page

**App Namespace**:
The complete public URL space beginning at `/app`, reserved exclusively for the Restricted App, including its screens and resources.
_Avoid_: App page, redirect link

**Entry Code**:
A shared phrase that reveals the developer sign-in flow but grants no access to the Restricted App.
_Avoid_: Developer password, access token, authorization code

**Developer Sign-In**:
The pre-release Supabase identity-verification step revealed by a valid Entry Code. Its verified identity is also used inside the Restricted App.
_Avoid_: App Sign-Up, Entry Code verification, app access

**App Sign-Up**:
Account creation intended for future public users of the Restricted App, not an additional account step for an Authorized Developer.
_Avoid_: Developer Sign-In, developer authorization

**Authorized Developer**:
An authenticated person whose identity is present in the server-controlled developer allowlist and may therefore use the Restricted App before launch.
_Avoid_: User, code holder

**Affiliation**:
An entry in the `affiliations` list (About page, Landing page marquee) — covers both organizational partners (e.g. TUM Venture Labs) and government funding bodies (e.g. BMWE, EXIST, EU co-funding) under one shared display pattern. The list does not distinguish the two categories today; a logo's presence there means "shown in the affiliation strip," not necessarily "funded by" or "partnered with" in a legal sense.
_Avoid_: Partner, sponsor (implies a distinction the current data model doesn't make)
