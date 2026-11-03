# Voalt

A community publishing, knowledge, intelligence and automation-partner network —
one place where independent projects, topical communities and research agents can
cooperate instead of operating as isolated platforms.

**Status: concept and architecture.** Voalt is not a finished network, has no
public deployment, and does not accept sign-ups. The architecture and the first
integration pilot are developed in a private repository.

This repository is a **public project showcase**. It describes purpose, model and
roadmap at a level useful to an outside reader. Implementation detail, schemas and
permission design are not published here.

---

## The idea

Most of the knowledge produced by small independent projects dies inside that
project. A conservation site collects a paper nobody else sees. A local
publication reports a fact that five other sites independently need. A genealogy
researcher finds a record that would settle someone else's question. Each site is
an island with its own search box.

Voalt is the attempt to build the water between the islands: **communities,
publications and automated researchers that can share structured, attributed
findings with each other, with provenance intact.**

Voalt is not limited to politics, journalism or any one subject. It is intended to
work for any lawful field of human interest — music, genealogy, software, science,
local communities, conservation, technology, education, history, literature and
ideas that do not have a category yet.

## What Voalt combines

| Element | What it means here |
|---|---|
| **Communities** | Topical spaces for links, posts, voting and discussion, organised by subject or issue. |
| **Investigations** | Evidence-backed workspaces where a claim, its sources and its corrections live together. |
| **Automated participants** | Collectors, publication agents and research assistants that are visibly labelled as automated and tied to the project that owns them. |
| **Independent partners** | Existing websites keep their own identity, editorial control and audience, and contribute through an authenticated interface. |
| **Cross-pollination** | A finding collected on one site can be routed to relevant communities, matched against evidence held elsewhere, and offered back to projects that need it. |

## Two kinds of space

- **Native Voalt communities** — spaces inside Voalt, comparable to a forum
  community, each with its own discussion and organisation.
- **Independent partner websites** — existing projects that remain separate sites
  and integrate through an authenticated publishing and research interface.

Community identity is kept deliberately separate from URL and hosting, so a
community can exist before it has a permanent home. Domain and subdomain
arrangements are designed but **not provisioned**: no wildcard DNS and no custom
domains have been configured.

## Provenance first

The rules that make cross-pollination useful instead of noisy:

- Every syndicated item keeps a link to its **canonical origin**, its original
  publisher and its collection time.
- **One story appearing on five sites is one story, not five corroborations.**
  Duplicate deliveries are matched by stable origin identifiers; repeated imports
  do not create new posts and do not inflate apparent agreement.
- Uncertainty is displayed. A machine-suggested association is not a verified
  fact, and the interface says which is which.
- Corrections and withdrawals travel with the item. When a publisher corrects
  something, its representation is flagged; when something is withdrawn, it is
  marked rather than quietly deleted.

## Automated participants are labelled, and are not voters

- Every automated account is visibly identified as automated and linked to the
  project that controls it.
- Automated accounts do **not** cast ordinary human votes, and do not add
  comments or promotion to simulate community agreement.
- Evidence, recommendations and research output produced by agents appear in
  separate, clearly labelled systems from human discussion.

## Human review stays in the loop

Agents may propose. Where the consequence is publication, money, sensitive
information or anything else consequential, a person decides. Partners grant
bounded, revocable permission for specific capabilities — never access to another
project's files, credentials or sessions.

## What exists today

- A written architecture: community and domain model, identity model for humans
  and agents, provenance schema, permission model, correction and withdrawal
  flows, threat model, and a bounded integration pilot design.
- A private reference implementation of the receiving side plus a local/staging
  pilot demonstrating a single safe automated publication exchange from a partner
  publication into a Voalt community, including duplicate suppression, corrections
  and withdrawal.

**What does not exist:** a public deployment, real accounts, live cross-posting,
federation between separate installations, and any provisioned domains. No live
automated cross-posting is authorised.

## Roadmap

| Milestone | State |
|---|---|
| Scope, identity model and provenance schema | Documented |
| Local pilot: one partner publication → one community | Implemented and tested on local fixtures |
| Human discussion, corrections and withdrawal propagation | Demonstrated in the pilot |
| Opt-in staging integration with a partner project | Next, requires owner approval |
| Multiple partner projects and a capability registry | Planned |
| Public read-only community preview | Planned, not scheduled |
| Federation between independently operated instances | Concept only |

## Governance direction

- Ordinary users are peers. There are no hierarchical "executive" tiers.
- Communities are organised by subject or issue, not by status.
- Public pseudonymous vote accountability remains part of the design, with
  privacy and abuse review required before anything is released.
- Coordinated voting rings and manipulation are handled by documented,
  contestable rules with an appeals path — never by secret scoring.

## Related projects

Voalt is intended to connect these projects rather than absorb them:

- [Whale Intelligence Network](https://github.com/DanUrtnowski/Whale-Intelligence-Network) — whale and dolphin research intelligence
- [Power Line News](https://github.com/DanUrtnowski/Power-Line-News) — utility infrastructure accountability
- [Coronado Happenings](https://github.com/DanUrtnowski/Coronado-Happenings) — a hyperlocal community publication
- [Immigration Law & Intelligence](https://github.com/DanUrtnowski/Immigration-Law-Intelligence) — official-record legal intelligence
- [MuseForge](https://github.com/DanUrtnowski/MuseForge-Showcase) — real-instrument music learning
- [LegacyOS](https://github.com/DanUrtnowski/LegacyOS) — a modern environment for old x86 hardware
- [Open E-Reader](https://github.com/DanUrtnowski/Open-E-Reader) — a free, offline-first reader
- [Secure Browser](https://github.com/DanUrtnowski/Secure-Browser) — a privacy-oriented browser concept

Portfolio profile: [DanUrtnowski](https://github.com/DanUrtnowski)

## Scope and licensing

This is a **showcase repository** containing documentation only:

- No implementation source code, schema definitions or permission configuration is
  published here.
- **No open-source licence is granted** for the private implementation.
- The community names and account labels mentioned in the wider documentation are
  examples of potential slugs and proposed labels — they are not registered
  accounts, reserved handles or production URLs.

See [CHANGELOG.md](CHANGELOG.md) for the public milestone record.
