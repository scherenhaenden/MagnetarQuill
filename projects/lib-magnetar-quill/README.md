
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
- [Build Specification](#build-specification-🏭)
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

To install the MagnetarQuill library from npm, run the following command in your project's terminal:

```bash
npm i --save magnetar-quill
```

*(Note: Ensure the package is published to npm for this command to work.)*

### **Prerequisites for Using the Library**

  - An existing **Angular** project compatible with the current peer dependency range.
  - Angular peer dependencies currently target `@angular/common` and `@angular/core` `^22.0.0`.

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

    *(Note: You must use a pipe like `safeHtml` to securely render the HTML output from the editor to prevent XSS attacks.)*

2.  Add the component tag to your template and use `[(ngModel)]` for two-way binding of the editor's HTML content:

    ```html
    <lib-magnetar-quill [(ngModel)]="documentContent"></lib-magnetar-quill>
    ```

3.  You can now use the editor in your application!

-----
## **Build Specification** 🏭

This section is the practical contract for how MagnetarQuill is built, verified, and prepared for distribution.

### **Build Targets**

MagnetarQuill is maintained as an Angular library under:

```text
projects/lib-magnetar-quill
```

The distributable package is generated into:

```text
dist/lib-magnetar-quill
```

That output directory is the canonical packaged artifact. If the version, README, typings, or bundles in `dist/` do not match the source library, the build is not considered ready.

### **Environment Specification**

To build the library reliably, use:

- **Node.js**: `v22.22.3` or `v24.15.0` and later for Angular 22 compatibility
- **npm**: version bundled with the selected Node.js LTS
- **Angular CLI**: repository-local CLI via `npm scripts`
- **TypeScript**: version pinned by the workspace lockfile

The library currently declares:

- Angular peer dependencies: `^22.0.0`
- Library package version: `0.10.0`

### **Repository Structure Relevant to the Build**

Important library build inputs:

- [projects/lib-magnetar-quill/ng-package.json](/home/edward/Development/MagnetarQuill/projects/lib-magnetar-quill/ng-package.json)
- [projects/lib-magnetar-quill/package.json](/home/edward/Development/MagnetarQuill/projects/lib-magnetar-quill/package.json)
- [projects/lib-magnetar-quill/tsconfig.lib.json](/home/edward/Development/MagnetarQuill/projects/lib-magnetar-quill/tsconfig.lib.json)
- [projects/lib-magnetar-quill/src/public-api.ts](/home/edward/Development/MagnetarQuill/projects/lib-magnetar-quill/src/public-api.ts)

Important workspace-level build inputs:

- [package.json](/home/edward/Development/MagnetarQuill/package.json)
- [tsconfig.json](/home/edward/Development/MagnetarQuill/tsconfig.json)

### **Install Dependencies**

From the repository root:

```bash
npm install
```

This installs the Angular toolchain, `ng-packagr`, test tooling, and lint tooling used by the library build pipeline.

### **Primary Library Build Command**

Build the library from the repository root with:

```bash
npm run build-lib
```

This is the preferred build entrypoint because it uses the workspace-local Angular CLI and keeps the command stable for contributors and CI.

### **Watch Mode for Library Development**

If you are iterating on the library itself and want rebuilds on file changes:

```bash
npm run build-lib-watch
```

This is the correct mode when you need continuous bundle regeneration into `dist/lib-magnetar-quill`.

### **Demo Application + Library Workflow**

If you want to validate the editor through the demo application while keeping the library build current:

```bash
npm run serve-with-lib
```

or on Linux:

```bash
npm run serve-with-lib-linux
```

Use this when you need to verify real UI/editor behavior rather than only checking that the library compiles.

### **What a Successful Build Must Produce**

A valid build should produce, at minimum:

- a generated `dist/lib-magnetar-quill/package.json`
- ESM/FESM bundles
- generated type declarations
- copied library assets and README

At the end of a good build, confirm:

- `dist/lib-magnetar-quill/package.json` has the intended library version
- `dist/lib-magnetar-quill/README.md` reflects the current documented feature/version state
- `projects/lib-magnetar-quill/src/public-api.ts` exports everything intended for consumers

### **Quality Gates Before Treating a Build as Release-Ready**

At a minimum, run:

```bash
npm run build-lib
npm run lint:info-docs
```

Recommended additional checks:

```bash
npm test
```

If the test environment is flaky or blocked by local browser/Karma issues, call that out explicitly instead of silently assuming the build is good.

### **Documentation Gate**

This repository now includes an info-doc generator and validator for TypeScript production sources.

Generate/update the required generated docs with:

```bash
npm run docs:generate:info-docs
```

Validate them with:

```bash
npm run lint:info-docs
```

The main `lint` script now runs the info-doc validator before Angular linting. If the generated documentation falls below the required volume threshold relative to implementation size, lint must fail.

### **Versioning Rules for the Library**

When a feature version is considered complete:

1. Update [projects/lib-magnetar-quill/package.json](/home/edward/Development/MagnetarQuill/projects/lib-magnetar-quill/package.json) with the new library version.
2. Update [projects/lib-magnetar-quill/README.md](/home/edward/Development/MagnetarQuill/projects/lib-magnetar-quill/README.md) so roadmap/progress status matches reality.
3. Rebuild the library so `dist/lib-magnetar-quill/package.json` and copied docs match source state.

Version changes are incomplete until the built output reflects them.

### **Release Interpretation**

For this repository, “the library is on version X” means all of the following are true:

- source library package metadata says version `X`
- the built package in `dist/lib-magnetar-quill` also says version `X`
- the README and roadmap do not materially contradict that claim

If only the branch name or roadmap row changed, but the packaged library metadata did not, then the version has not truly been shipped.

### **Failure Modes to Watch**

Common reasons a build should not be trusted:

- source package version and `dist/` package version differ
- public API exports were removed or drifted unintentionally
- README status says a version is complete while the package metadata still points to an older version
- editor behavior was changed in the demo but the library package was not rebuilt
- generated documentation was changed manually but not regenerated/validated

### **Practical Maintainer Sequence**

For a normal implementation cycle on the library, use this order:

```bash
npm install
npm run docs:generate:info-docs
npm run build-lib
npm run lint:info-docs
```

Then use the demo app or tests to validate runtime behavior. After that, check `dist/lib-magnetar-quill` before considering the work ready.

-----

## **Contributing & Local Development** 🧑‍💻

If you want to contribute to MagnetarQuill or run the demo application locally:

### Prerequisites for Development

  - **Node.js** `v22.22.3` or `v24.15.0` and later for Angular 22 compatibility
  - **npm** available on your path
  - No global Angular CLI is required if you use the repository scripts

### Step 1: Clone the Repository

```bash
git clone [https://github.com/scherenhaenden/MagnetarQuill.git](https://github.com/scherenhaenden/MagnetarQuill.git)
cd MagnetarQuill
```

### Step 2: Install Dependencies

```bash
npm install
npm run docs:generate:info-docs
```

### Step 3: Run the Development Server

```bash
npm run serve-with-lib
```

Open your browser at [http://localhost:4200](https://www.google.com/search?q=http://localhost:4200) to see the **MagnetarQuill** demo application.

-----

## **Available Commands (for Development)** 📜

Inside the cloned project directory:

  - `npm run build-lib`: Build the Angular library into `dist/lib-magnetar-quill`.
  - `npm run build-lib-watch`: Rebuild the library on change.
  - `npm run serve-with-lib`: Build the library, then run the demo application.
  - `npm run serve-with-lib-linux`: Watch the library build and run the demo app together.
  - `npm test`: Run the workspace test suite.
  - `npm run test-lib-magnetar-quill`: Run the library-focused test target.
  - `npm run docs:generate:info-docs`: Regenerate required long-form generated TypeScript info-doc blocks.
  - `npm run lint:info-docs`: Validate generated info-doc coverage rules.
  - `npm run lint`: Run documentation validation plus Angular linting.

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
| 9     | Copy-Paste Image Support                              | ✅ Completed  | Version 0.9 - Image Clipboard |
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
| 20    | Light and Dark Theme Support                          | ✅ Completed  | Version 0.20 - Theme Customization |
| 21    | Plugin System for Custom Toolbar Tools                | 🔴 Not Started| Version 0.21 - Plugin Support |

*(Status Key: ✅ Completed | 🔄 In Progress | 🔴 Not Started)*

-----

## **Theme Customization Guide** 🎨

`magnetar-quill` supports dynamic theme toggling and deep customization using standard CSS Custom Properties (Variables).

### **Theme API**
You can bind the theme input property and listen to changes:
```html
<magnetar-quill [(theme)]="editorTheme"></magnetar-quill>
```
Supported values for `theme` are:
* `'light'` (Default)
* `'dark'`
* `'custom'`
* Any custom string matching your CSS classes (e.g. `'theme-ocean'`).

### **Theme Overrides via CSS Variables**
To customize any color palette (especially the `'custom'` theme), you can override the target CSS custom properties globally or scoped to the editor element:

```css
/* Customizing the theme-custom class on the editor */
magnetar-quill.theme-custom {
  --mq-bg-color: #f0fdf4;       /* Container background */
  --mq-text-color: #14532d;     /* Default text color */
  --mq-border-color: #166534;   /* Component border */
  --mq-toolbar-bg: #dcfce7;     /* Toolbar background */
  --mq-toolbar-border: #15803d; /* Toolbar borders */
  --mq-editor-bg: #ffffff;      /* Editor editing area */
  --mq-primary-color: #15803d;  /* Active button/outline highlights */
}
```

#### **List of Available CSS Variables:**
| Variable Name | Description | Default (Light) |
|---|---|---|
| `--mq-bg-color` | Container overall background | `#ffffff` |
| `--mq-text-color` | Base text color | `#212529` |
| `--mq-border-color` | Border color for editor and inputs | `#dee2e6` |
| `--mq-toolbar-bg` | Toolbar background color | `#f8f9fa` |
| `--mq-toolbar-border` | Toolbar divider/border color | `#dee2e6` |
| `--mq-editor-bg` | Editing canvas background color | `#ffffff` |
| `--mq-blockquote-border`| Quote sidebar accent | `#6c757d` |
| `--mq-primary-color` | Main highlight / active state color | `#4f46e5` |

-----

## **Contributing** 🤝

We welcome contributions! Here's how you can help:

1.  **Fork the repository** (`https://github.com/scherenhaenden/MagnetarQuill.git`).
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/my-awesome-feature
    ```
3.  **Commit your changes** and open a pull request against the main repository.
4.  We’ll review your PR and merge it!

Please read our [Contributing Guidelines](https://www.google.com/search?q=CONTRIBUTING.md) (if available) for more details.

-----

## **License** 📄

MagnetarQuill is licensed under the **Creative Commons Attribution 4.0 International (CC BY 4.0)** License. You are free to use, distribute, and build upon this work, as long as proper attribution is given. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for more details.

-----

## **Stay Connected** 💬

Follow development progress or ask questions:

  - **GitHub Issues**: [MagnetarQuill Issues](https://github.com/scherenhaenden/MagnetarQuill/issues)
  - **GitHub Discussions**: [MagnetarQuill Discussions](https://github.com/scherenhaenden/MagnetarQuill/discussions)
