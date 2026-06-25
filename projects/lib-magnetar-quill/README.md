
# **MagnetarQuill** 🖋✨
> **The Next-Gen Universe-Inspired WYSIWYG Editor - Built with Angular** 🚀💫

![MagnetarQuill](magnetar-quill.png)

**MagnetarQuill** is a versatile, extensible, and powerful **WYSIWYG editor component** built with **Angular**, designed to streamline content creation.

Inspired by the most extreme phenomena in the universe, the **Magnetar**, and combined with the elegance of a quill, this editor aims to take your text editing experience beyond the ordinary.

---
## **Current view** 🌟
*(Assuming magnetar-quill-example.png shows the current state based on completed features)*
![MagnetarQuill](magnetar-quill-example.png)

---

## **Table of Contents** 📚
- [Status](#status-🏗️)
- [Features](#features-🌟)
- [Installation](#installation-🛠)
- [Quick Start (Usage in Angular)](#quick-start-usage-in-angular-🚀)
- [Contributing & Local Development](#contributing--local-development-🧑‍💻)
- [Available Commands (for Development)](#available-commands-for-development-📜)
- [Roadmap](#roadmap-🛣)
- [License](#license-📄)
- [Stay Connected](#stay-connected-💬)

---

## **Status** 🏗️

MagnetarQuill is currently under active development. See the [Project Progress](#project-progress-📊) section for detailed status.

---

## **Features** 🌟

Based on the current completed progress, MagnetarQuill offers:

- 🖋 **Basic Text Formatting**: Support for **bold**, **italic**, **underline**, **strikethrough**.
- 🎨 **Font Options**: Change font family and font size via dropdowns.
- 🎨 **Color Selection**: Apply text and background colors using color pickers.
- 📐 **Text Alignment & Spacing**: Includes options for text alignment and line spacing.
- 📝 **Lists**: Support for ordered and unordered lists.
- 📄 **Headers**: Support for custom headers (H1-H6).

*(More features like image support, tables, clipboard enhancements, file export/import, and the plugin system are planned or in progress - see Roadmap and Progress below).*

---

## **Installation** 🛠

To use the MagnetarQuill component in your Angular project, install the library from npm (once published):

```bash
npm i --save magnetar-quill
````

*(Note: Ensure the package is published to npm for this command to work.)*

### **Prerequisites for Using the Library**

  - An existing **Angular** project (v21.0.0 or higher recommended).

-----

## **Quick Start (Usage in Angular)** 🚀

1.  Import the standalone `LibMagnetarQuillComponent` into your Angular component or module where you want to use the editor:

    ```typescript
    // Example in a standalone Angular component
    import { Component } from '@angular/core';
    import { LibMagnetarQuillComponent } from 'magnetar-quill'; // Adjust path if needed after install
    import { FormsModule } from '@angular/forms'; // Needed for ngModel

    @Component({
      selector: 'app-my-editor-page',
      standalone: true,
      imports: [ LibMagnetarQuillComponent, FormsModule ], // Import the component
      template: `
        <h2>My Editor</h2>
        <lib-magnetar-quill [(ngModel)]="documentContent"></lib-magnetar-quill>
        <hr>
        <h3>Content Preview:</h3>
        <div [innerHTML]="documentContent | safeHtml"></div>
      ` // safeHtml pipe would be needed for rendering raw HTML
    })
    export class MyEditorPageComponent {
      documentContent: string = '<p>Start editing here...</p>';
    }
    ```

    *(Note: You might need a pipe like `safeHtml` to securely render the HTML output from the editor)*

2.  Add the component tag to your template and use `[(ngModel)]` for two-way binding of the editor's HTML content:

    ```html
    <lib-magnetar-quill [(ngModel)]="documentContent"></lib-magnetar-quill>
    ```

3.  You can now use the editor in your application\!

-----

## **Contributing & Local Development** 🧑‍💻

If you want to contribute to MagnetarQuill or run the demo application locally:

### Prerequisites for Development

  - **Node.js** (v16.x or higher)
  - **Angular CLI** (v21.0.0 or higher)

### Step 1: Clone the Repository

```bash
git clone [https://github.com/scherenhaenden/MagnetarQuill.git](https://github.com/scherenhaenden/MagnetarQuill.git)
cd MagnetarQuill
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run the Development Server

```bash
ng serve
```

Open your browser at [http://localhost:4200](https://www.google.com/search?q=http://localhost:4200) to see the **MagnetarQuill** demo application.

-----

## **Available Commands (for Development)** 📜

Inside the cloned project directory:

  - `nx serve`: Start the development server.
  - `nx build`: Build the library/project for production.
  - `nx test`: Run unit tests.
  - `nx lint`: Lint the codebase for errors.

-----

## **Roadmap** 🛣

🔭 **Planned & In-Progress Features**:

  - 📷 Image Insertion, Editing, and Clipboard Support
  - 📊 Table Insertion and Editing
  - ✨ Object Context Menu & Drag-and-Drop Repositioning
  - ✂ Rich Text Copy-Paste Support & Sanitization
  - 🔄 Undo/Redo Functionality with Multi-Step History
  - 💾 HTML and Markdown Export/Import
  - 🖥 Full-Screen Mode
  - 🎨 Light/Dark Theme Support & Customization
  - 🔌 Plugin System for Custom Toolbar Tools & Extensions
  - 🤝 Advanced collaborative editing tools (Potential Future Enhancement)
  - ✅ Enhanced accessibility features (Potential Future Enhancement)
  - 📱 Mobile optimization for touch devices (Potential Future Enhancement)

*(See the detailed progress table below for current status)*

-----

## **Project Progress** 📊

Here’s the updated table with the latest progress:

| Step  | Feature Description                                   | Status       | Version Name         |
|-------|-------------------------------------------------------|--------------|----------------------|
| 1     | Project Setup and Angular Initialization              | ✅ Completed  | Version 0.1 - Setup  |
| 2     | Implement Bold, Italic, Underline, Strikethrough       | ✅ Completed  | Version 0.2 - Basic Text Formatting |
| 3     | Font Family and Font Size Dropdowns                   | ✅ Completed  | Version 0.3 - Font Options |
| 4     | Text & Background Color Pickers                       | ✅ Completed  | Version 0.4 - Color Selection |
| 5     | Text Alignment & Line Spacing                         | ✅ Completed  | Version 0.5 - Text Alignment & Spacing |
| 6     | Ordered and Unordered Lists                           | ✅ Completed | Version 0.6 - Lists |
| 7     | Custom Headers (H1-H6)                                | ✅ Completed | Version 0.7 - Headers |
| 8     | Image Insertion and Editing                           | 🔄 In Progress| Version 0.8 - Image Support |
| 9     | Copy-Paste Image Support                              | 🔄 In Progress| Version 0.9 - Image Clipboard |
| 10    | Table Insertion and Editing                           | 🔄 In Progress| Version 0.10 - Table Management |
| 11    | Object Context Menu                                   | 🔄 In Progress| Version 0.11 - Object Management |
| 12    | Drag-and-Drop Object Repositioning                    | 🔄 In Progress| Version 0.12 - Object Repositioning |
| 13    | Rich Text Copy-Paste Support                          | 🔴 Not Started| Version 0.13 - Rich Text Clipboard |
| 14    | Text Sanitization on Paste                            | 🔴 Not Started| Version 0.14 - Paste Sanitization |
| 15    | Undo/Redo Functionality                               | 🔴 Not Started| Version 0.15 - Undo/Redo |
| 16    | Multi-Step History Support                            | 🔴 Not Started| Version 0.16 - History Features |
| 17    | HTML and Markdown Export                              | 🔴 Not Started| Version 0.17 - File Export |
| 18    | File Loading (HTML & RTF)                             | 🔴 Not Started| Version 0.18 - File Import |
| 19    | Full-Screen Mode                                      | 🔴 Not Started| Version 0.19 - Full-Screen |
| 20    | Light and Dark Theme Support                          | 🔴 Not Started| Version 0.20 - Theme Customization |
| 21    | Plugin System for Custom Toolbar Tools                | 🔴 Not Started| Version 0.21 - Plugin Support |

*(Status Key: ✅ Completed | 🔄 In Progress | 🔴 Not Started)*

-----

## **Contributing** 🤝

We welcome contributions\! Here's how you can help:

1.  **Fork the repository** (`https://github.com/scherenhaenden/MagnetarQuill.git`).
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/my-awesome-feature
    ```
3.  **Commit your changes** and open a pull request against the main repository.
4.  We’ll review your PR and merge it\!

Please read our [Contributing Guidelines](https://www.google.com/search?q=CONTRIBUTING.md) (if available) for more details.

-----

## **License** 📄

MagnetarQuill is licensed under the **Creative Commons Attribution 4.0 International (CC BY 4.0)** License. You are free to use, distribute, and build upon this work, as long as proper attribution is given. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for more details.

-----

## **Stay Connected** 💬

Follow development progress or ask questions:

  - **GitHub Issues**: [MagnetarQuill Issues](https://github.com/scherenhaenden/MagnetarQuill/issues)
  - **GitHub Discussions**: [MagnetarQuill Discussions](https://github.com/scherenhaenden/MagnetarQuill/discussions)

