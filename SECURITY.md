# Security Statement — Mermaid Diagrams for Confluence

## Overview

Mermaid Diagrams for Confluence is a Confluence Cloud app built on the Atlassian Forge platform. It allows users to create and render Mermaid.js diagrams directly within Confluence pages. The app is open-source and distributed under the MIT license.

This document describes the security posture of the app in accordance with the Atlassian Marketplace Cloud Security Self-Assessment requirements.

## Architecture

The app runs entirely on the Atlassian Forge serverless platform. There are no self-hosted servers, databases, or external infrastructure components.

- **Runtime**: Atlassian Forge (serverless functions hosted and managed by Atlassian)
- **Frontend**: React-based UI Kit rendered within Confluence
- **Rendering**: Mermaid.js client-side diagram rendering
- **Storage**: Forge Key-Value Store (KVS), managed by Atlassian

No data leaves the Atlassian environment. The app makes zero external network calls.

## Authentication & Authorization

The app relies entirely on the Atlassian Forge platform for authentication and authorization.

- **No Basic authentication** is used.
- **No OAuth tokens, API keys, or secrets** are stored or managed by the app.
- **No custom authentication logic** is implemented. All user identity and permission checks are handled by the Forge platform and Confluence's native permission model.
- Users can only access diagrams on pages they already have permission to view or edit through Confluence's standard access controls.

## Data Storage & Encryption

- Diagram source code (Mermaid markup) is stored in Forge Key-Value Store (KVS).
- Forge KVS data is **encrypted at rest** by Atlassian.
- Forge KVS data is **encrypted in transit** using TLS.
- **No user passwords, personal access tokens, or sensitive credentials** are collected or stored.
- **No personally identifiable information (PII)** is collected beyond what Confluence natively provides (e.g., user display names for edit history).
- All data resides within Atlassian's infrastructure and is subject to Atlassian's own data residency and security policies.

## Network Security

- The app makes **no outbound HTTP/HTTPS requests** to external services.
- All communication occurs within the Atlassian Forge runtime environment.
- No webhooks, callbacks, or third-party API integrations are used.
- Content Security Policy (CSP): the app requires only `unsafe-inline` for styles, which is necessary for React's inline style rendering. No `unsafe-eval` or external script sources are permitted.

## Input Validation

- **Mermaid.js** is configured with `securityLevel: 'strict'`, which prevents embedded HTML and script injection within diagrams.
- The **React frontend** provides automatic XSS escaping for all rendered content.
- User-supplied Mermaid markup is treated as untrusted input and is never executed as code.
- No `dangerouslySetInnerHTML` or equivalent patterns are used for user-provided content.

## Vulnerability Management

- Dependencies are monitored for known vulnerabilities using `npm audit`.
- The app is open-source (MIT license), enabling community review and contribution.
- Security issues can be reported via the contact information below.

## Scopes & Permissions

The app requests the minimum scopes necessary for its functionality:

| Scope | Purpose |
|---|---|
| `storage:app` | Read and write diagram data to Forge KVS |
| `read:confluence-content.all` | Read page content to support macro rendering in view mode |

No write access to Confluence content is requested beyond what the Forge macro module inherently provides.

## Contact

To report a security vulnerability or ask questions about this security statement, contact:

- **Email**: your-email@example.com
- **Repository**: File an issue in the project's source repository
