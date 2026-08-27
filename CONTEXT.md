# BossBaby Website

BossBaby Website contains public brand and community experiences and provides entry to the unreleased Bossbaby application.

## Language

**You Pick**:
A community poll where participants select packaging and flavour preferences and may propose flavours.

**Participant**:
A person who answers a You Pick poll or a Survey without needing a registered account. Participant identity distinguishes ownership and one-response-per-Survey behavior; it is claimed by the client, not verified, so it deduplicates rather than authenticates.
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

**Survey**:
An immutable set of questions asked at one time. Changing the questions produces a new Survey that supersedes the old one, so answers already given always refer to the wording they were given against. Distinct from You Pick, which is one long-running poll with fixed options.
_Avoid_: Poll, Quiz, Form, Questionnaire

**Question**:
One item in a Survey: a key, a type (single choice, multiple choice, or free text), the prompt as the Participant reads it, and for the choice types the options they may pick. Answers are validated against it on submission, so an answer no Question allows is refused.
_Avoid_: Field, Item

**Survey Response**:
One Participant's answers to one Survey, replaced rather than duplicated if they answer again. It holds answers and nothing else: an email address is never a Survey answer, and a flow that collects one joins the Waitlist separately.
_Avoid_: Vote, Submission, Entry

**Survey Family**:
The name shared by every version of one Survey, so the versions can be read together and asked for as a group. A place that runs a Survey names the family rather than a version, and is given whichever version is currently open.
_Avoid_: Survey group, campaign, series

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

**Staff Sign-In**:
The identity-verification step through which a Staff Member enters the private staff workspace. It is separate from both Developer Sign-In and App Sign-Up.
_Avoid_: Admin sign-up, Developer Sign-In

**Password Setup**:
The step in which a Staff Member establishes the password on their own account, reached by following either an invite link or a reset link. The two entrances differ only in whether a password already existed, so they lead to the same screen.
_Avoid_: Password recovery, password reset, forgot password

**Staff Workspace**:
The private, evolving workspace where Staff Members use features permitted by their capabilities. Its first feature area is waitlist management.
_Avoid_: Admin page, hidden page

**App Sign-Up**:
Account creation intended for future public users of the Restricted App, not an additional account step for an Authorized Developer.
_Avoid_: Developer Sign-In, developer authorization

**Authorized Developer**:
An authenticated person granted the capability to use the Restricted App before launch.
_Avoid_: User, code holder

**App User**:
An authenticated person who uses the Bossbaby application without staff capabilities.
_Avoid_: Normal user, customer

**Staff Member**:
An authenticated person granted one or more staff capabilities. Staff access is defined by those capabilities rather than a numeric access level.
_Avoid_: Admin user, access-level user

**Capability**:
A named permission granting a Staff Member one specific category of access or action. Capabilities are combined explicitly rather than inferred from a numbered hierarchy.
_Avoid_: Access level, permission tier

**Communication Draft**:
An editable subject and message prepared by a Staff Member and reusable across deliveries to different Recipient Selections.
_Avoid_: Newsletter, template, email blast

**Sent Communication**:
A read-only snapshot of communication content created for one delivery to one Recipient Selection. Sending the source draft again creates another snapshot without changing earlier history.
_Avoid_: Editable draft, newsletter template

**Recipient Selection**:
The waitlist subscriptions that will receive one communication, resolved from canonical storage at the moment of sending. It is either a set of individually chosen subscriptions or, by deliberate choice of Send Scope, every subscription that exists.
_Avoid_: User list, automatic audience

**Waitlist Subscription**:
A standing expression of consent to receive Bossbaby launch and exclusive-news communications, identified by one normalized email address. A subscription has no lifecycle states: it exists and is therefore eligible to receive communications, or it does not exist.
_Avoid_: Waitlist user, email row, pending subscription

**Subscription Source**:
The original channel through which a Waitlist Subscription was received: the public signup on the website, a Survey that collected an address alongside its answers, a Staff Import, or the one-time transfer of the earlier list. It is preserved across duplicate submissions so the team can compare how people first join as new channels are introduced.
_Avoid_: Referrer, campaign

**Waitlist Removal**:
Permanent withdrawal of a waitlist subscription: the retained email address is deleted from canonical storage and from the delivery representation. Because every stored subscription is eligible, removal is deletion — there is no deactivated or suppressed state to fall back to. The person may voluntarily join the waitlist again later, which is new consent.
_Avoid_: Suppression, deactivation, soft deletion, unsubscribe flag

**Staff Import**:
The addition of one or more Waitlist Subscriptions by a Staff Member on behalf of people who have already consented elsewhere. It records which Staff Member performed it and requires them to affirm that consent exists. It is a transfer of existing consent, never a way to enroll people who have not given it.
_Avoid_: Bulk add, upload, seeding

**Delivery Representation**:
The copy of the waitlist held by the email provider so that it can address a send. It is derived from canonical storage and never authoritative; when the two disagree, canonical storage wins and the provider copy is corrected.
_Avoid_: Audience, contact list, mirror

**Send Scope**:
The deliberate choice between delivering to individually chosen subscriptions and delivering to every subscription. It is chosen explicitly for one delivery and is never inferred from what the Staff Member happens to be searching or paging through.
_Avoid_: Filter, segment, audience rule

**Delivery State**:
The aggregate, provider-reported progress of one Sent Communication. Acceptance by the provider is not delivery; a communication may be accepted and still fail to reach people.
_Avoid_: Sent status, success flag

**Affiliation**:
An entry in the `affiliations` list (About page, Landing page marquee) — covers both organizational partners (e.g. TUM Venture Labs) and government funding bodies (e.g. BMWE, EXIST, EU co-funding) under one shared display pattern. The list does not distinguish the two categories today; a logo's presence there means "shown in the affiliation strip," not necessarily "funded by" or "partnered with" in a legal sense.
_Avoid_: Partner, sponsor (implies a distinction the current data model doesn't make)
