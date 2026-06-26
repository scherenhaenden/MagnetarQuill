# Pendings

1. **Library Packaging and Delivery**:
   - **Package Format**: Define if the library will be delivered as an npm package, zip file, or GitHub repository.
   - **Installation Process**: Step-by-step guide on how to install and integrate the library into various environments (e.g., Angular, React).
   - **Dependency Management**: Specify any external dependencies and how they should be managed (e.g., versions of Angular or Node.js required).

2. **Documentation**:
   - Provide details on how the library will be documented, including **API references**, **usage examples**, and any **configuration options**.

3. **Versioning and Updates**:
   - **Versioning strategy**: Define how versions will be managed (e.g., Semantic Versioning).
   - **Release Process**: Include a plan for how updates will be delivered and communicated (e.g., changelogs).

4. **Licensing**:
   - If relevant, specify the **licensing** model (open-source, proprietary) and any usage restrictions.

5. **Outward Update Events (contentChange)**:
   - **Issue**: For some reason, the events to update outward (such as `contentChange`) do not always work consistently.
   - **Symptom**: When copying and pasting content into the editor, the flow of outward updates seems to lock or get blocked. If you then go to the end of the text and continue typing, the event is still not emitted.
   - **Workaround/Trigger**: To force the outward update functionality to work, the user has to go to the beginning of the text, press `Enter` (new line), and then press `Backspace/Return` (delete the new line to return to the start of the editor). Only after this manual sequence do outward events resume working properly. The internal state update always works, but the outward one does not. It is possible that the copy-paste action locks/blocks a listener or change detection mechanism.



