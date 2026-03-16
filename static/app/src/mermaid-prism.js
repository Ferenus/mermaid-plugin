import Prism from 'prismjs';

Prism.languages.mermaid = {
  comment: /%%.*$/m,
  string: [
    { pattern: /"[^"]*"/, greedy: true },
    { pattern: /\|[^|]*\|/, greedy: true },
  ],
  'diagram-type': {
    pattern: /\b(?:sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gantt|pie|flowchart|graph|journey|gitGraph|mindmap|timeline|quadrantChart|sankey-beta|xychart-beta|block-beta|packet-beta|kanban|architecture-beta|C4Context|C4Container|C4Component|C4Deployment|requirementDiagram)\b/,
    alias: 'keyword',
  },
  'direction': {
    pattern: /\b(?:TB|TD|BT|RL|LR)\b/,
    alias: 'keyword',
  },
  'block-keyword': {
    pattern: /\b(?:subgraph|end|loop|alt|else|opt|par|and|critical|break|rect|note\s+(?:left|right|over)|note|activate|deactivate|participant|actor|title|section|dateFormat|axisFormat|excludes|includes|class|style|linkStyle|classDef|click|callback|direction)\b/,
    alias: 'keyword',
  },
  arrow: {
    pattern: /-->|==>|-.->|---->|->>|-->>|<<->>|--x|--o|===|---|->|<-->|~~~|--/,
    alias: 'operator',
  },
  number: /\b\d+(?:\.\d+)?\b/,
  punctuation: /[{}[\];(),:]/,
};

export default Prism;
