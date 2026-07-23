# Security policy

NgNova UI takes vulnerabilities in the library, generated package, documentation application, and
release pipeline seriously.

## Supported versions

| Version                      | Security support                        |
| ---------------------------- | --------------------------------------- |
| Latest stable major          | Supported                               |
| Current `main` prerelease    | Supported until the next stable release |
| Older majors and prereleases | Not supported                           |

Before 1.0 is published, the current `main` prerelease is the only supported line. After 1.0,
security fixes target the latest stable major. A fix may be backported when severity, consumer
impact, and maintainer capacity justify it, but a backport is not guaranteed.

## Report a vulnerability privately

Do not open a public issue for a suspected vulnerability.

Use the repository's
[private vulnerability reporting](https://github.com/chiragpatel273/ngnova-ui/security/advisories/new)
form. Include:

- the affected package version and entry point;
- the Angular, browser, Node, and rendering environment;
- a minimal reproduction or proof of concept;
- the security impact and realistic attack path;
- any known workaround; and
- whether the report or exploit details have been shared elsewhere.

If private reporting is unavailable, open a minimal repository issue asking the maintainer to
enable a private security channel. Do not include exploit details in that issue.

## What to expect

The maintainer will acknowledge a complete report as capacity permits, validate severity and
affected versions, coordinate a fix and advisory, and credit the reporter unless anonymity is
requested. Public disclosure should wait until a fix or mitigation is available.

Security releases may bypass the normal deprecation window. They still receive a Changeset,
changelog entry, advisory, and migration or mitigation notes when consumers must act.

## Scope

Reports are in scope when they demonstrate a security impact caused by NgNova UI code, package
metadata, documentation deployment, or release automation. General dependency scanner output
without a reachable exploit path, social engineering, denial-of-service traffic against third-party
hosting, and unsupported versions are normally out of scope.
