You are working on my existing Enigma/Lotus builder UI. Do a careful full-file review before editing. Do not redesign the whole app. Keep the current visual style, spacing, rounded panels, soft premium colors, and builder layout, but upgrade the product experience.

Main goal:
Upgrade the existing builder interface into a more capable AI app-builder workspace while keeping the same style. Make it cleaner, more powerful, and more client-ready without making it messy.

Important:
- Preserve the current UI direction.
- Do not rip out the layout.
- Do not change the brand style dramatically.
- Do not overcomplicate the app.
- Make every new button/panel feel intentional.
- Use mock/placeholder logic where backend functionality does not exist yet.
- Everything must run without errors.

Changes required:

1. Upgrade the bottom chat input area

At the bottom where the user currently sees “Describe a change…”, turn that area into a full builder command bar.

Add these controls around or above the input:

- Plus button
- File upload button
- Image upload button
- Model selector
- Connector button
- Skills button
- Agents button
- Functions button

The user should still have the main text input with placeholder:
“Describe a change, feature, screen, or function…”

The send button should stay clean and visible.

The controls should feel similar to a modern AI chat composer. Keep them compact. Do not make the bottom area huge or cluttered.

Expected behavior:
- Plus button opens a quick action menu.
- File upload opens a file picker.
- Image upload opens an image picker.
- Model selector opens a dropdown.
- Connector opens a connector panel/modal.
- Skills opens a skills panel/modal.
- Agents opens an agents panel/modal.
- Functions opens a functions panel/modal.

For now, these can use mock data and placeholder actions. The UI must be complete and ready for real backend wiring later.

2. Plus menu

When clicking the plus button, show a clean popover menu with:

- Upload File
- Upload Image
- Add Connector
- Add Skill
- Add Agent
- Add Function
- Import Design
- Import GitHub Repo
- Add API Key
- Add Device Capability

Do not make these real integrations yet. Create clean placeholder handlers.

3. File and image uploader

Add upload support in the UI:

File uploader should accept:
- PDF
- DOC/DOCX
- TXT
- CSV
- JSON
- ZIP
- JS/TS/TSX/CSS/HTML files

Image uploader should accept:
- PNG
- JPG/JPEG
- WEBP
- SVG

After upload, show uploaded items as small attachment chips above the chat input.

Each chip should show:
- File name
- File type icon
- Remove X button

Do not actually upload to a server yet. Store selected files in local component state only.

4. Model selector

Add a model dropdown in the bottom command bar.

Include mock model options:
- Enigma Auto
- GPT-4.1
- Claude Sonnet
- Claude Opus
- Gemini Pro
- DeepSeek Coder
- Local Model

Show the selected model clearly but compactly.

Default:
“Enigma Auto”

5. Connector panel

Add a connector modal or side panel.

Connector categories:
- Supabase
- Firebase
- GitHub
- Vercel
- Stripe
- OpenRouter
- OpenAI
- Anthropic
- Google Drive
- Gmail
- Google Calendar
- Apple Developer
- Google Play Console
- Bluetooth
- Camera
- Microphone
- Push Notifications
- Maps / Location

Each connector should show:
- Name
- Short description
- Status badge: Not Connected
- Connect button

The Connect button can be placeholder for now.

6. Skills panel

Add a skills modal/panel.

Mock skills:
- UI Polish
- Landing Page Builder
- Auth Setup
- Supabase Schema
- App Store Prep
- Play Store Prep
- SEO Setup
- Copywriter
- Bug Fixer
- Payment Flow
- Image Generator
- Data Importer

Each skill should show:
- Name
- Description
- Toggle on/off

7. Agents panel

Add an agents modal/panel.

Mock agents:
- Product Architect
- UI Designer
- Backend Engineer
- Mobile App Engineer
- Database Planner
- QA Tester
- App Store Strategist
- Growth Strategist
- Security Reviewer
- Deployment Manager

Each agent should show:
- Name
- Role description
- Toggle on/off

8. Functions panel

Add a functions modal/panel.

This is where users can add capabilities like Roark-style app features and device abilities.

Mock function categories:

Device Capabilities:
- Bluetooth
- Camera
- Microphone
- Push Notifications
- Location Services
- Contacts
- Calendar Access
- File System Access
- Offline Mode

App Capabilities:
- User Authentication
- Payments
- Subscriptions
- Chat
- Image Upload
- Video Upload
- Admin Dashboard
- Analytics
- Search
- Notifications
- Export Data

AI Capabilities:
- Text Generation
- Image Generation
- Audio Transcription
- Voice Generation
- Code Generation
- Document Analysis
- Workflow Automation

Each function should show:
- Name
- Category
- Short description
- Add button or toggle

When a function is added, show it in an “Active Capabilities” section.

9. Remove top Layers tab

At the top left where the tabs currently show:
Chat
Layers
Code

Remove the Layers tab from this top area.

Keep:
Chat

Move:
Code

Do not leave unused space or broken tab logic.

10. Move Code into the preview/action area

In the preview header area where the user sees preview controls, add a Code button/tab next to Preview.

The preview/action section should have:
- Preview
- Code
- Deployed
- View App

The Code area should open a code panel/view.

Inside Code, include:
- File tree mockup
- Code preview area
- Download Code button
- Copy Code button
- Export ZIP button

This can use mock file data for now.

Mock files:
- src/App.tsx
- src/components/Home.tsx
- src/components/Dashboard.tsx
- src/lib/supabase.ts
- package.json
- README.md

11. Replace Publish with Deployed

Wherever the UI currently says “Publish”, rename it to “Deployed” or “Deploy” depending on context.

Use:
- Button label: Deploy
- Status/tab label: Deployed

Do not use “Publish”.

12. Remove Share button

Remove the Share button from the top/right builder actions.

Replace it with:
View App

13. View App menu

Clicking View App should open a clean dropdown or modal with:

- Web App
- Apple App Store
- Google Play Store

Inside this View App area, include app distribution settings:

Web App:
- App URL
- Open Web App button
- Copy Link button

Apple App Store:
- Upload App Icon
- Apple Bundle ID
- Apple Team ID
- App Store Category
- Version
- Build Number
- App Store Prep Checklist

Google Play Store:
- Upload App Icon
- Android Package Name
- Version Name
- Version Code
- Play Store Category
- Play Store Prep Checklist

These can be placeholder fields for now. Make the UI look real and ready for backend wiring.

14. Movable phone preview

The phone preview in the canvas should not be stuck in one position.

Make the phone preview draggable inside the preview canvas.

Requirements:
- User can click and drag the phone mockup around the preview area.
- Keep the phone inside the canvas bounds if possible.
- Add a small grab handle or subtle “Move” affordance.
- Preserve the existing phone preview look.
- Do not break the mobile/tablet/desktop preview controls.
- Add Reset Position button near preview controls.

15. Preview device controls

Keep the existing device controls:
- Mobile
- Tablet
- Desktop

Improve them slightly if needed, but do not redesign heavily.

When switching device modes:
- Preview should resize visually.
- Movable position should still work.
- Reset Position should center it again.

16. Active build context bar

Add a small “Active Build Context” strip near the bottom composer or preview header that summarizes what is active:

- Selected model
- Active connectors count
- Active skills count
- Active agents count
- Active capabilities count
- Uploaded files count

Keep this very compact.

Example:
Enigma Auto · 2 Connectors · 3 Skills · 2 Agents · 4 Capabilities · 1 File

17. Add tasteful upgrades I may not be thinking of

Add small, useful builder upgrades only if they fit the current product:

Good additions:
- Undo / Redo buttons
- Build status indicator
- Autosaved indicator
- Version selector
- Command history
- Keyboard shortcut hint
- “Generate Plan” quick action
- “Fix Bugs” quick action
- “Improve UI” quick action
- “Prepare Store Build” quick action

Bad additions:
- Huge dashboards
- Random analytics pages
- Complex billing
- Real auth
- Real deployment
- Overdesigned sidebars
- Anything that makes the demo unstable

18. State management

Use simple local state for now.

Track:
- selectedModel
- uploadedFiles
- activeConnectors
- activeSkills
- activeAgents
- activeCapabilities
- currentView: preview/code/deployed
- deviceMode: mobile/tablet/desktop
- phonePosition
- buildStatus
- autosaved status

Do not connect backend yet unless the project already has one cleanly working.

19. Component structure

Create or refactor into clean components if helpful:

- BuilderShell
- BuilderTopBar
- BuilderTabs
- ChatPanel
- ChatComposer
- AttachmentChips
- ModelSelector
- PlusActionMenu
- ConnectorPanel
- SkillsPanel
- AgentsPanel
- FunctionsPanel
- PreviewCanvas
- DraggableDevicePreview
- CodePanel
- ViewAppMenu
- DeployPanel
- ActiveBuildContextBar

Keep the structure simple. Do not over-engineer.

20. Quality control

After changes:
- Run install if needed
- Run lint if available
- Run typecheck if available
- Run build
- Fix all errors
- Do not leave broken imports
- Do not leave dead tabs
- Do not leave unused state causing TypeScript failures
- Make sure mobile responsiveness still works
- Make sure the app opens cleanly

Final result:
The interface should feel like Enigma/Lotus is becoming a real AI app builder:
- Chat-first
- File/image aware
- Model selectable
- Skills/agents/capabilities ready
- Connector-ready
- Preview/code/deploy organized
- Phone preview movable
- App store and Play Store prep visible
- Same style, upgraded to the next level