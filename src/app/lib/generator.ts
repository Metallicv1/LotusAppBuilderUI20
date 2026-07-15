export type DeviceMode = "phone" | "tablet" | "desktop";
export type BuildStatus = "Ready" | "Generating" | "Preview updated" | "Deploy queued" | "Saved" | "Autosaved" | "Project renamed" | "Project moved";

export interface StylePack {
  id: number;
  name: string;
  palette: { bg:string; surface:string; text:string; muted:string; accent:string; accent2:string; border:string };
  archetype: string;
  layout: string;
  texture: string;
  radius: number;
  density: "Airy" | "Balanced" | "Dense";
}

export interface GeneratedAppSpec {
  title: string;
  appType: string;
  hero: string;
  screens: string[];
  entities: string[];
  actions: string[];
  modules: { name:string; status:string }[];
  metrics: { label:string; value:string }[];
}

export interface GeneratedCodeFile {
  name: string;
  lang: string;
  code: string;
}

const STYLE_PALETTES = [
  { name:"Obsidian Gold", bg:"#17120A", surface:"#241A0E", text:"#FFF7E6", muted:"#BBAE91", accent:"#D9A441", accent2:"#7DD3C7", border:"rgba(255,247,230,0.14)" },
  { name:"Cloud Studio", bg:"#F7F8F4", surface:"#FFFFFF", text:"#17201B", muted:"#66736A", accent:"#2E7D62", accent2:"#B98E2E", border:"rgba(23,32,27,0.12)" },
  { name:"Signal Blue", bg:"#EEF6FF", surface:"#FFFFFF", text:"#0D2238", muted:"#5C7288", accent:"#2563EB", accent2:"#12B981", border:"rgba(13,34,56,0.12)" },
  { name:"Rose Graphite", bg:"#FBF3F4", surface:"#FFFFFF", text:"#2A171B", muted:"#876B72", accent:"#D94672", accent2:"#6D5BD0", border:"rgba(42,23,27,0.12)" },
  { name:"Moss Ledger", bg:"#EEF4EA", surface:"#FAFCF7", text:"#172417", muted:"#65745F", accent:"#3F7D34", accent2:"#C28A2C", border:"rgba(23,36,23,0.13)" },
  { name:"Slate Mint", bg:"#111820", surface:"#1A2530", text:"#EAF7F1", muted:"#9CB3AA", accent:"#5EEAD4", accent2:"#A78BFA", border:"rgba(234,247,241,0.13)" },
  { name:"Paper Ink", bg:"#F4EFE6", surface:"#FFFDF8", text:"#211A12", muted:"#736759", accent:"#111827", accent2:"#C58B34", border:"rgba(33,26,18,0.13)" },
  { name:"Violet Lab", bg:"#F6F2FF", surface:"#FFFFFF", text:"#201336", muted:"#75648C", accent:"#7C3AED", accent2:"#06B6D4", border:"rgba(32,19,54,0.12)" },
  { name:"Copper Night", bg:"#160F0C", surface:"#241611", text:"#FFF3E8", muted:"#BA9D8B", accent:"#F97316", accent2:"#EAB308", border:"rgba(255,243,232,0.14)" },
  { name:"Aloe Mono", bg:"#F1F7F0", surface:"#FCFFFB", text:"#102016", muted:"#6D7E70", accent:"#0F766E", accent2:"#84CC16", border:"rgba(16,32,22,0.12)" },
] as const;

const STYLE_ARCHETYPES = [
  "Booking OS", "Creator Studio", "Commerce Flow", "Local Service Hub", "Learning Coach",
  "Health Companion", "Finance Desk", "Social Network", "Internal Ops", "AI Workspace",
] as const;

const STYLE_LAYOUTS = [
  "Command Center", "Editorial Feed", "Card Stack", "Split Workspace", "Timeline Rail",
  "Map + Detail", "Media First", "Dense Table", "Wizard Flow", "Dashboard Tiles",
] as const;

const STYLE_TEXTURES = [
  "Soft glass", "Fine grid", "Paper grain", "Sharp mono", "Liquid panels", "Studio cards",
  "Native sheets", "Floating toolbar", "Calm bands", "High-contrast rails", "Inset canvas", "Storefront chrome",
] as const;

export const STYLE_PACK_COUNT = STYLE_PALETTES.length * STYLE_ARCHETYPES.length * STYLE_LAYOUTS.length * STYLE_TEXTURES.length;
export const DEFAULT_PROMPT = "Build me a client-ready mobile app with real screens, reusable UI, and a polished preview.";

export const DEVICE_PREVIEW_META: Record<DeviceMode, { label:string; size:string; note:string }> = {
  phone:   { label:"Mobile preview",  size:"375 x 720",  note:"Primary touch layout" },
  tablet:  { label:"Tablet preview",  size:"768 x 600",  note:"Split-screen readiness" },
  desktop: { label:"Desktop preview", size:"1100 x 620", note:"Wide responsive pass" },
};

export function hashText(text: string) {
  let hash = 2166136261;
  for (let i=0; i<text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

export function createStylePack(seed: number): StylePack {
  const id = ((seed % STYLE_PACK_COUNT) + STYLE_PACK_COUNT) % STYLE_PACK_COUNT;
  const palette = STYLE_PALETTES[id % STYLE_PALETTES.length];
  const archetype = STYLE_ARCHETYPES[Math.floor(id / STYLE_PALETTES.length) % STYLE_ARCHETYPES.length];
  const layout = STYLE_LAYOUTS[Math.floor(id / (STYLE_PALETTES.length * STYLE_ARCHETYPES.length)) % STYLE_LAYOUTS.length];
  const texture = STYLE_TEXTURES[Math.floor(id / (STYLE_PALETTES.length * STYLE_ARCHETYPES.length * STYLE_LAYOUTS.length)) % STYLE_TEXTURES.length];
  const density = (["Airy","Balanced","Dense"] as const)[id % 3];
  return {
    id,
    name: `${palette.name} / ${layout}`,
    palette,
    archetype,
    layout,
    texture,
    density,
    radius: [10, 14, 18, 22][id % 4],
  };
}

function titleFromPrompt(prompt: string, archetype: string) {
  const clean = prompt
    .replace(/build|make|create|app|mobile|client-ready|real screens/gi, " ")
    .replace(/[^a-z0-9 ]/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(w=>w.length>2)
    .slice(0, 3)
    .map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase())
    .join(" ");
  return clean ? `${clean} ${archetype.split(" ")[0]}` : archetype;
}

export function generateAppSpec(prompt: string, stylePack: StylePack): GeneratedAppSpec {
  const lower = prompt.toLowerCase();
  const appType =
    lower.match(/book|appointment|schedule/) ? "Booking" :
    lower.match(/shop|store|commerce|checkout|product/) ? "Commerce" :
    lower.match(/coach|course|learn|lesson/) ? "Learning" :
    lower.match(/health|wellness|fitness|mood|sleep/) ? "Wellness" :
    lower.match(/money|finance|invoice|billing/) ? "Finance" :
    lower.match(/restaurant|food|menu/) ? "Food" :
    lower.match(/creator|content|social|community/) ? "Creator" :
    stylePack.archetype.replace(" OS", "").replace(" Hub", "");
  const title = titleFromPrompt(prompt, stylePack.archetype);
  const typeScreens: Record<string, string[]> = {
    Booking: ["Home", "Services", "Book", "Calendar", "Messages", "Payments", "Profile"],
    Commerce: ["Home", "Shop", "Product", "Cart", "Checkout", "Orders", "Profile"],
    Learning: ["Home", "Lessons", "Coach", "Progress", "Library", "Community", "Profile"],
    Wellness: ["Home", "Check In", "Sleep", "Journal", "Insights", "Coach", "Profile"],
    Finance: ["Home", "Accounts", "Budget", "Invoices", "Reports", "Alerts", "Profile"],
    Food: ["Home", "Menu", "Order", "Cart", "Tracking", "Rewards", "Profile"],
    Creator: ["Home", "Studio", "Calendar", "Assets", "Community", "Analytics", "Profile"],
  };
  const baseScreens = typeScreens[appType] ?? ["Home", "Work", "Inbox", "Assets", "Automations", "Reports", "Profile"];
  const requestedScreens = [
    lower.match(/auth|login|signup|onboarding/) ? ["Login", "Onboarding", "Settings"] : [],
    lower.match(/admin|dashboard|reports|activity/) ? ["Admin", "Reports", "Activity"] : [],
    lower.match(/billing|payment|checkout|commerce/) ? ["Billing", "Invoices"] : [],
    lower.match(/notification|push|alert/) ? ["Notifications"] : [],
  ].flat();
  const screens = Array.from(new Set([...baseScreens, ...requestedScreens])).slice(0, 12);
  const actions = [
    "Generate",
    "Save",
    appType === "Commerce" ? "Checkout" : appType === "Booking" ? "Book Now" : "Launch",
    "Invite",
    "Export",
    "Automate",
  ];
  const entities = [
    appType === "Booking" ? "Appointments" : appType === "Commerce" ? "Products" : "Projects",
    "Users",
    "Messages",
    "Assets",
    "Payments",
    "Events",
  ];
  const modules = [
    { name:"Auth flow", status:"Ready" },
    { name:"Data model", status:"Generated" },
    { name:"Push alerts", status:"Mocked" },
    { name:"Store prep", status:"Queued" },
  ];
  return {
    title,
    appType,
    hero: `${appType} app generated from your prompt with ${stylePack.layout.toLowerCase()} structure and ${stylePack.texture.toLowerCase()} assets.`,
    screens,
    entities,
    actions,
    modules,
    metrics: [
      { label:"Screens", value:String(screens.length) },
      { label:"Style Pack", value:`${stylePack.id + 1}` },
      { label:"Actions", value:String(actions.length) },
    ],
  };
}

function stringLiteral(value: string) {
  return JSON.stringify(value);
}

export function generateCodeFiles(spec: GeneratedAppSpec, stylePack: StylePack, prompt: string): GeneratedCodeFile[] {
  const p = stylePack.palette;
  const screenRoutes = spec.screens.map(screen => screen.toLowerCase().replace(/[^a-z0-9]+/g, "-"));

  return [
    {
      name:"package.json",
      lang:"json",
      code: JSON.stringify({
        name: spec.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "lotus-generated-app",
        version: "1.0.0",
        private: true,
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: {
          "@vitejs/plugin-react": "latest",
          vite: "latest",
          typescript: "latest",
          react: "latest",
          "react-dom": "latest",
        },
      }, null, 2),
    },
    {
      name:"src/generated-app.ts",
      lang:"ts",
      code:`export const generatedApp = {
  title: ${stringLiteral(spec.title)},
  appType: ${stringLiteral(spec.appType)},
  prompt: ${stringLiteral(prompt)},
  stylePack: {
    id: ${stylePack.id + 1},
    name: ${stringLiteral(stylePack.name)},
    archetype: ${stringLiteral(stylePack.archetype)},
    layout: ${stringLiteral(stylePack.layout)},
    texture: ${stringLiteral(stylePack.texture)},
    density: ${stringLiteral(stylePack.density)}
  },
  screens: ${JSON.stringify(spec.screens, null, 2)},
  routes: ${JSON.stringify(screenRoutes, null, 2)},
  entities: ${JSON.stringify(spec.entities, null, 2)},
  actions: ${JSON.stringify(spec.actions, null, 2)},
  modules: ${JSON.stringify(spec.modules, null, 2)}
} as const;
`,
    },
    {
      name:"src/theme.ts",
      lang:"ts",
      code:`export const theme = {
  background: ${stringLiteral(p.bg)},
  surface: ${stringLiteral(p.surface)},
  text: ${stringLiteral(p.text)},
  muted: ${stringLiteral(p.muted)},
  accent: ${stringLiteral(p.accent)},
  accent2: ${stringLiteral(p.accent2)},
  border: ${stringLiteral(p.border)},
  radius: ${stylePack.radius}
} as const;
`,
    },
    {
      name:"src/App.tsx",
      lang:"tsx",
      code:`import { generatedApp } from "./generated-app";
import { theme } from "./theme";
import "./styles.css";

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">{generatedApp.appType} / {generatedApp.stylePack.layout}</p>
          <h1>{generatedApp.title}</h1>
          <p>{${stringLiteral(spec.hero)}}</p>
          <div className="actions">
            {generatedApp.actions.map((action, index) => (
              <button key={action} className={index === 0 ? "primary" : "secondary"}>{action}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="screen-grid">
        {generatedApp.screens.map((screen, index) => (
          <article key={screen} className="screen-card">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{screen}</h2>
            <p>Generated route: /{generatedApp.routes[index]}</p>
          </article>
        ))}
      </section>

      <section className="module-grid">
        {generatedApp.modules.map((module) => (
          <article key={module.name} className="screen-card module-card">
            <span>{module.status}</span>
            <h2>{module.name}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
`,
    },
    {
      name:"src/styles.css",
      lang:"css",
      code:`:root {
  color: ${p.text};
  background: ${p.bg};
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: ${p.bg};
}

button {
  border: 0;
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top right, ${p.accent}33, transparent 34%),
    ${p.bg};
}

.hero,
.screen-card {
  border: 1px solid ${p.border};
  border-radius: ${stylePack.radius + 10}px;
  background: ${p.surface};
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.12);
}

.hero {
  padding: 32px;
  max-width: 880px;
}

.eyebrow {
  margin: 0 0 10px;
  color: ${p.muted};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  max-width: 720px;
  font-size: clamp(40px, 8vw, 84px);
  line-height: 0.95;
}

.hero p:not(.eyebrow) {
  max-width: 620px;
  color: ${p.muted};
  font-size: 18px;
  line-height: 1.6;
}

.actions,
.screen-grid,
.module-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button {
  border-radius: 999px;
  padding: 12px 16px;
  font-weight: 800;
}

.primary {
  background: ${p.accent};
  color: ${p.bg};
}

.secondary {
  background: ${p.bg};
  color: ${p.text};
}

.screen-grid,
.module-grid {
  margin-top: 18px;
}

.screen-card {
  flex: 1 1 180px;
  padding: 20px;
}

.screen-card span {
  color: ${p.accent};
  font-weight: 900;
}

.screen-card h2 {
  margin: 10px 0 6px;
}

.screen-card p {
  color: ${p.muted};
}

.module-card {
  flex-basis: 220px;
}
`,
    },
    {
      name:"README.md",
      lang:"md",
      code:`# ${spec.title}

Generated by Lotus from:

> ${prompt}

## App Map

- Type: ${spec.appType}
- Style pack: ${stylePack.id + 1} / ${STYLE_PACK_COUNT}
- Archetype: ${stylePack.archetype}
- Layout: ${stylePack.layout}
- Texture: ${stylePack.texture}
- Density: ${stylePack.density}

## Screens

${spec.screens.map(screen => `- ${screen}`).join("\n")}

## Entities

${spec.entities.map(entity => `- ${entity}`).join("\n")}

## Generated Modules

${spec.modules.map(module => `- ${module.name}: ${module.status}`).join("\n")}
`,
    },
  ];
}
