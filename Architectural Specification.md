# **MagnetarQuill - Architectural Specification** 🏗️📐

---

### **1. System Overview** 🌌

**MagnetarQuill** is fundamentally a **WYSIWYG editor component/library** built using **Angular** for the frontend. Its core architecture prioritizes a rich client-side editing experience, flexibility through plugins, and ease of integration into Angular applications.

While the core library operates on the client-side, the architecture allows for *optional future integration* with backend systems to enable advanced features like real-time collaboration, user profiles, and server-side document storage/processing.

-   **Primary Focus**: Angular WYSIWYG Component Library
-   **Frontend**: Angular (v18+ recommended), TypeScript, HTML, CSS/Less/Sass
-   **Key Principles**: Modularity, Extensibility, Performance, Client-Side Focus

---

### **2. Core Frontend Components** ✨

#### **2.1. Text Formatting Engine** 🖋️
Handles the real-time application of text styling and structuring of content within the editor.

-   **Mechanism**: Leverages Angular's reactivity combined with the browser's `contenteditable` capabilities.
-   **Core Functionalities**: Bold, Italics, Underline, Strikethrough, Font Selection (Family, Size), Color Application (Text, Background), Lists (Ordered, Unordered), Headers (H1-H6), Alignment, Spacing.
-   **DOM Interaction**: Aims for direct DOM manipulation for standard formatting, generating clean, semantic HTML markup where possible. Utilizes services (like `FormattingService`) to abstract logic.

#### **2.2. Plugin Architecture (Client-Side)** 🔌
A modular system allowing developers to extend editor functionality with custom tools, formats, or behaviours without modifying the core library.

-   **Design**: Plugins are envisioned to follow a defined lifecycle (e.g., registration, initialization, destruction) and interact via a stable API.
-   **Integration**: Hooks into predefined client-side editor events (e.g., `onTextChange`, `onSelectionChange`, `onObjectInsert`, `beforeCommand`, `afterCommand`).

#### **2.3. File Operations (Client-Side)** 💾
Handles exporting content generated in the editor and potentially importing content.

-   **Export Formats (Planned)**: HTML (core), Markdown. (RTF/PDF export might require significant client-side libraries or future server-side assistance).
-   **Import Formats (Planned)**: HTML, potentially Markdown/RTF with sanitization.
-   **Implementation**: Primarily client-side using browser APIs and JavaScript libraries. Large operations might utilize Web Workers to avoid blocking the UI thread.

#### **2.4. Toolbar Component** 🛠️
The primary user interface for accessing formatting and editor commands.

-   **Location**: `src/app/lib/components/toolbar` (or similar standard library structure)
-   **Files**: `toolbar.component.html`, `toolbar.component.ts`, `toolbar.component.less` (or .scss/.css)
-   **Key UI Elements**: Buttons, dropdowns, and color pickers for Font Selection, Text Styling, Color Selection, Alignment & Spacing, Lists, Headers. Designed to be extensible by plugins.
-   **Service Integration**: Interacts heavily with services like `FormattingService` to apply changes and reflect the current selection's state.

---

### **3. Frontend Architecture** 🧱

#### **3.1. Key Architectural Elements**
-   **Core Editor Component (`LibMagnetarQuillComponent`)**: The main component housing the `contenteditable` area and orchestrating interactions. Standalone component design preferred.
-   **Toolbar Component**: Provides the UI controls (as described above). Likely a separate standalone component.
-   **Formatting Service**: Centralizes the logic for applying/removing text formats, interacting with the DOM/selection.
-   **Selection Service**: Manages and provides information about the current user selection within the editor.
-   **History Service (Planned)**: Manages undo/redo state.
-   **Renderer/Content Handler**: Manages the conversion between the internal editor state (if any) and the output HTML, including sanitization.
-   **Plugin Registry/Service (Planned)**: Manages the lifecycle and integration of loaded plugins.

#### **3.2. Component Interaction**
-   User interacts with the **Toolbar Component**.
-   Toolbar actions call methods on the **Formatting Service** or other relevant services.
-   Services update the content within the **Core Editor Component**'s editable area, often via the **Selection Service**.
-   Editor content changes might trigger events handled by plugins or update the state managed by the **History Service**.

---

### **4. Potential Backend Integration (Future/Optional)** ☁️

The core MagnetarQuill library is backend-agnostic. However, for features beyond basic client-side editing, integration with a backend service may be necessary.

#### **4.1. Potential Use Cases for a Backend**
-   **Real-Time Collaboration**: Synchronizing edits between multiple users.
-   **User Accounts & Profiles**: Storing user preferences, custom plugins, themes.
-   **Server-Side Document Storage**: Saving/loading documents to/from a database.
-   **Advanced File Operations**: Server-assisted generation of complex formats like PDF or DOCX.
-   **Asset Management**: Storing and serving uploaded images or media.

#### **4.2. Example Technologies (If Backend is Implemented)**
-   **Frameworks**: Node.js (Express, NestJS), ASP.NET Core, Python (Django, Flask), etc.
-   **Communication**: REST API for standard requests, WebSockets (e.g., Socket.io) for real-time features.
-   **Database**: SQL (e.g., PostgreSQL, MySQL) or NoSQL (e.g., MongoDB) depending on specific needs (e.g., storing structured user data vs. flexible document content).

---

### **5. Security Considerations** 🔒

#### **5.1. Client-Side Security (Core)**
-   **Cross-Site Scripting (XSS) Prevention**: Crucial for any WYSIWYG editor. All HTML content generated by the editor or pasted/imported into it **must** be sanitized. Using established libraries like **DOMPurify** is highly recommended. Configuration should allow necessary formatting tags/attributes while blocking potentially malicious code.

#### **5.2. Backend-Related Security (If Applicable)**
-   **Authentication/Authorization**: If user accounts or server-side storage are implemented, standard practices like **JWT** or session management are needed.
-   **Cross-Site Request Forgery (CSRF)**: Implement CSRF token protection for any state-changing requests to the backend.
-   **Role-Based Access Control (RBAC)**: If different user roles exist (e.g., admin, editor), enforce permissions server-side.
-   **Input Validation**: All data sent to the backend must be validated.

---

### **6. Performance Considerations** ⚡

#### **6.1. Frontend Performance**
-   **Efficient DOM Handling**: Minimize direct DOM manipulations and batch updates where possible to avoid layout thrashing, especially during complex formatting or object insertions. Virtual DOM concepts are generally not applicable within `contenteditable`.
-   **Lazy Loading**: Consider lazy loading for heavy components, plugins, or features not immediately needed.
-   **Client-Side Caching**: Use `localStorage` or `sessionStorage` for caching non-sensitive user settings or temporary states to improve load times or resilience.
-   **Bundle Size**: Optimize the library's bundle size through code splitting, tree shaking (`sideEffects: false` helps), and mindful dependency management.

---

### **7. Scalability & Extensibility** 📈

#### **7.1. Plugin API**
-   A well-defined, stable client-side **Plugin API** is key to extensibility. It should provide necessary hooks and methods for plugins to interact with the editor core safely.

#### **7.2. Modular Design**
-   Maintain clear separation of concerns between core services (Formatting, Selection, History) and UI components (Toolbar, Editor). This facilitates maintenance, testing, and adding new features without major refactoring.

---

### **8. Collaboration & Versioning (Future Enhancement)** 👥⏳

-   **Real-Time Collaboration**: Requires significant architectural additions, likely involving Operational Transformation (OT) or Conflict-free Replicated Data Types (CRDTs) and WebSocket communication with a dedicated backend service.
-   **Document Versioning**: Saving snapshots of document states, potentially requiring backend storage and diffing capabilities.

---
