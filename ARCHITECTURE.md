# Architecture of MagnetarQuill

## High-Level Architecture Diagram
```text
+--------------------+        +---------------------+        +--------------------+
| Host Angular App   | <----> | MagnetarQuill API   | <----> | Editor Core Engine |
| (consumer)         |        | (component facade)  |        | (commands/state)   |
+--------------------+        +---------------------+        +--------------------+
                                         |                              |
                                         v                              v
                                +-------------------+          +-------------------+
                                | Rendering Layer   |          | Persistence Layer |
                                | (toolbar/content) |          | (HTML/Markdown IO)|
                                +-------------------+          +-------------------+
                                         |
                                         v
                                +-------------------+
                                | Extension Layer   |
                                | (plugins/hooks)   |
                                +-------------------+
```

## Component Descriptions
- **Host Angular App**
  - **Responsibility:** Integrates the editor and binds content to business flows.
  - **Technology:** Angular.
- **MagnetarQuill API (Component Facade)**
  - **Responsibility:** Exposes public inputs/outputs, command bindings, and lifecycle hooks.
  - **Technology:** Angular standalone component patterns.
- **Editor Core Engine**
  - **Responsibility:** Maintains editing state, applies formatting commands, and manages undo/redo behavior.
  - **Technology:** TypeScript command/state modules.
- **Rendering Layer**
  - **Responsibility:** Renders toolbar controls and editable surface.
  - **Technology:** Angular templates, styles, and DOM interactions.
- **Persistence Layer**
  - **Responsibility:** Import/export of content (initially HTML, optionally Markdown).
  - **Technology:** TypeScript serializers/parsers.
- **Extension Layer**
  - **Responsibility:** Enables optional plugin tools and integrations.
  - **Technology:** Hook interfaces and extension registration contracts.

## Key Design Decisions
- Keep core editing logic decoupled from UI rendering for testability.
- Treat serialization as a dedicated concern to avoid leaking format logic into toolbar code.
- Use explicit interfaces for extension points to preserve backward compatibility.
