import Prism from 'prismjs';

Prism.manual = true;

Prism.languages.mermaid = {
  comment: /%%.*$/m,
  // Quoted strings only - pipe strings handled after arrows
  'quoted-string': {
    pattern: /"[^"]*"/,
    greedy: true,
    alias: 'string',
  },
  'diagram-type': {
    pattern: /\b(?:sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gantt|pie|flowchart|graph|journey|gitGraph|mindmap|timeline|quadrantChart|sankey-beta|xychart-beta|block-beta|packet-beta|kanban|architecture-beta|C4Context|C4Container|C4Component|C4Deployment|requirementDiagram)\b/,
    alias: 'keyword',
  },
  'direction': {
    pattern: /\b(?:TB|TD|BT|RL|LR)\b/,
    alias: 'keyword',
  },
  'block-keyword': {
    pattern: /\b(?:subgraph|end|loop|alt|else|opt|par|and|critical|break|rect|note\s+(?:left|right|over)|note|activate|deactivate|participant|actor|title|section|dateFormat|axisFormat|excludes|includes|class|style|linkStyle|classDef|click|callback|direction|state|as)\b/,
    alias: 'keyword',
  },
  // Class diagram annotations like <<interface>>, <<abstract>>
  annotation: {
    pattern: /<<\w+>>/,
    alias: 'builtin',
  },
  // ER diagram relationship operators
  'er-relation': {
    pattern: /[|}o]\|(?:--|\.\.)[|}o][|{]/,
    alias: 'operator',
  },
  // Class diagram relationship arrows and flowchart arrows
  // MUST come before pipe-string so <|-- isn't consumed by pipe matching
  arrow: {
    pattern: /<\|\.\.|\.\.\|>|\*--|\*\.\.|o--|\.\.|<\|--|--\|>|<--\*|--o|o\.\.|--\*|<~~>|<<->>|-->>|->>|<-->|---->|-\.->|-->|==>|--x|===|---|->|~~~/,
    alias: 'operator',
  },
  // Pipe-delimited link labels like |text| (after arrows so <|-- is matched first)
  'pipe-string': {
    pattern: /\|[^|\n]*\|/,
    greedy: true,
    alias: 'string',
  },
  // Member visibility modifiers (+public, -private, #protected, ~package)
  'visibility': {
    pattern: /((?:^\s*)|(?::\s*))[+\-#~](?=\w)/m,
    lookbehind: true,
    alias: 'important',
  },
  // Colon separator (for member definitions like "Animal : +int age")
  'separator': {
    pattern: /\s:\s/,
    alias: 'punctuation',
  },
  number: /\b\d+(?:\.\d+)?\b/,
  punctuation: /[{}[\];(),]/,
};

export default Prism;
