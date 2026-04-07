# Mermaid Diagrams for Confluence

An Atlassian Forge app that lets users create and render Mermaid diagrams directly in Confluence pages. Write diagram code using Mermaid syntax, preview it in real time, and publish it as a native Confluence macro.

## Features

- Full Mermaid diagram editor with live preview
- Split view with three modes: code, split, and preview
- Syntax highlighting for Mermaid code (powered by Prism.js)
- 9 built-in templates: Flowchart, Sequence, Class, State, ER, Gantt, Pie, Mindmap, and Timeline
- Version history with pagination (up to 50 entries)
- Dark and light theme support (follows the active Confluence theme)
- Pan and zoom controls for rendered diagrams
- Powered by Mermaid.js v11.4.0

## Screenshots

> **Note:** Add screenshots before Atlassian Marketplace submission.

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Atlassian Forge CLI](https://developer.atlassian.com/platform/forge/getting-started/) (`npm install -g @forge/cli`)

## Installation

If you want to install the app on your Confluence site:

```
forge install
```

Follow the prompts to select your Atlassian site and the product (Confluence).

## Development

### Install dependencies

Install root (backend) dependencies:

```
npm install
```

Install frontend dependencies:

```
cd static/app && npm install
```

### Build the frontend

```
cd static/app && npm run build
```

### Deploy

```
forge deploy
```

### Local development

Start a tunnel for live reloading during development:

```
forge tunnel
```

While the tunnel is running, rebuild the frontend after code changes:

```
cd static/app && npm run build
```

The tunnel detects the updated bundle and serves it automatically.

### Notes

- Use `forge deploy` to persist code changes to the hosted environment.
- Use `forge install` to install the app on a new site. Once installed, subsequent deploys are picked up automatically without reinstalling.

## Project Structure

```
manifest.yml          Forge app manifest (modules, permissions, resources)
src/
  index.js            Backend resolver (Forge function handler)
static/app/
  src/
    App.js            Main React application
    index.js          Entry point
    templates.js      Built-in Mermaid diagram templates
    mermaid-prism.js  Custom Prism.js grammar for Mermaid syntax
    components/
      Editor.js       Code editor with syntax highlighting
      Viewer.js       Read-only diagram renderer (macro view)
      Toolbar.js      Editor toolbar (view modes, actions)
      MermaidRenderer.js  Mermaid diagram rendering
      ZoomControls.js Pan and zoom controls
      TemplatesPanel.js   Template picker panel
      HistoryPanel.js     Version history panel
      HelpPanel.js        Help and reference panel
    hooks/            Custom React hooks
```

## Tech Stack

- [Atlassian Forge](https://developer.atlassian.com/platform/forge/) -- app platform and backend runtime
- [React 18](https://react.dev/) -- frontend UI
- [Mermaid.js 11.4](https://mermaid.js.org/) -- diagram rendering engine
- [Prism.js](https://prismjs.com/) -- syntax highlighting
- [Forge Bridge](https://developer.atlassian.com/platform/forge/apis-reference/ui-api-bridge/) -- communication between frontend and backend

## License

MIT -- see [package.json](package.json).

## Additional Resources

- [PRIVACY.md](PRIVACY.md) -- Privacy policy
- [SECURITY.md](SECURITY.md) -- Security policy
