# Third-Party Notices

This file lists the significant third-party dependencies used by
**Mermaid Diagrams for Confluence** along with their license information.

---

## Primary Dependency

| Name | Version | License | Description | URL |
|------|---------|---------|-------------|-----|
| mermaid | 11.13.0 | MIT | Diagram rendering engine -- converts Markdown-like syntax into flowcharts, sequence diagrams, Gantt charts, class diagrams, mind maps, and more. This is the core technology powering the app. | https://github.com/mermaid-js/mermaid |

---

## Frontend Dependencies

| Name | Version | License | Description | URL |
|------|---------|---------|-------------|-----|
| react | 18.3.1 | MIT | JavaScript library for building user interfaces. Used as the UI framework for the app's custom UI layer. | https://github.com/facebook/react |
| react-dom | 18.3.1 | MIT | React package for working with the DOM. Provides DOM-specific rendering methods used alongside React. | https://github.com/facebook/react |
| prismjs | 1.30.0 | MIT | Lightweight syntax highlighting library. Used to provide syntax highlighting in the Mermaid code editor. | https://github.com/PrismJS/prism |
| react-simple-code-editor | 0.14.1 | MIT | Simple code editor component for React with syntax highlighting support. Provides the in-browser code editing experience for writing Mermaid diagrams. | https://github.com/satya164/react-simple-code-editor |
| @forge/bridge | 5.14.0 | Atlassian (see LICENSE.txt) | Atlassian Forge bridge API for custom UI apps. Enables communication between the app's frontend and the Forge backend runtime. | https://developer.atlassian.com/platform/forge/ |
| @atlaskit/css-reset | 6.16.0 | Apache-2.0 | Base stylesheet for the Atlassian Design System. Provides consistent CSS baseline styling aligned with Atlassian products. | https://bitbucket.org/atlassian/atlassian-frontend-mirror |

---

## Backend Dependencies

| Name | Version | License | Description | URL |
|------|---------|---------|-------------|-----|
| @forge/kvs | 1.4.0 | Atlassian (see LICENSE.txt) | Forge Key Value Store SDK. Used for persisting diagram data and app state in the Forge storage backend. | https://developer.atlassian.com/platform/forge/ |
| @forge/resolver | 1.7.1 | Atlassian (see LICENSE.txt) | Forge function resolver. Handles incoming requests from the frontend bridge and routes them to the appropriate backend handler functions. | https://developer.atlassian.com/platform/forge/ |

---

## Notes

- The Atlassian Forge packages (@forge/bridge, @forge/kvs, @forge/resolver) are
  licensed under Atlassian's own terms. Refer to the LICENSE.txt file included in
  each package for full details.
- All other listed dependencies are licensed under the MIT License unless
  otherwise noted.
- This list covers direct (non-dev) dependencies only. Transitive dependencies
  carry their own licenses as declared in their respective packages.
