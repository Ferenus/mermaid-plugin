const templates = [
  {
    name: 'Flowchart',
    description: 'A basic flowchart with decision points',
    code: `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B`,
  },
  {
    name: 'Sequence Diagram',
    description: 'Interactions between actors over time',
    code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I'm good thanks!
    Alice->>Bob: Great to hear!`,
  },
  {
    name: 'Class Diagram',
    description: 'Object-oriented class relationships',
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +fetch()
    }
    class Cat {
        +String color
        +purr()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  {
    name: 'State Diagram',
    description: 'State transitions in a system',
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Submit
    Processing --> Success : Valid
    Processing --> Error : Invalid
    Error --> Idle : Retry
    Success --> [*]`,
  },
  {
    name: 'ER Diagram',
    description: 'Entity-relationship database model',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date created
    }
    LINE-ITEM {
        string product
        int quantity
        float price
    }`,
  },
  {
    name: 'Gantt Chart',
    description: 'Project timeline and scheduling',
    code: `gantt
    title Project Schedule
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements    :a1, 2024-01-01, 7d
    Design          :a2, after a1, 5d
    section Development
    Implementation  :b1, after a2, 14d
    Testing         :b2, after b1, 7d
    section Release
    Deployment      :c1, after b2, 3d`,
  },
  {
    name: 'Pie Chart',
    description: 'Data distribution visualization',
    code: `pie title Browser Market Share
    "Chrome" : 65
    "Safari" : 19
    "Firefox" : 4
    "Edge" : 4
    "Other" : 8`,
  },
  {
    name: 'Mindmap',
    description: 'Hierarchical brainstorming diagram',
    code: `mindmap
  root((Project))
    Planning
      Requirements
      Timeline
      Resources
    Development
      Frontend
      Backend
      Database
    Testing
      Unit Tests
      Integration
      UAT`,
  },
  {
    name: 'Timeline',
    description: 'Chronological events display',
    code: `timeline
    title Project Milestones
    2024-Q1 : Planning phase
            : Requirements gathered
    2024-Q2 : Development starts
            : Alpha release
    2024-Q3 : Beta testing
            : Bug fixes
    2024-Q4 : Production release
            : Post-launch support`,
  },
];

export default templates;
