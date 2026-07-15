import { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Smartphone, Tablet, Monitor, Sparkles, MoreHorizontal,
  RefreshCw, Code2, Zap, ImageIcon, X, ChevronDown,
  Plus, Upload, FileText, Brain, Bot, Cpu, Undo2, Redo2,
  Globe, Copy, Download, Eye, Check, Settings, RotateCcw,
  Plug, Archive, GripVertical, Play,
  Moon, BookOpen, Heart, Wind, Flame, Star,
  Bell, TrendingUp,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, Area, AreaChart } from "recharts";
import logoLotus from "@/imports/logo_lotus.png";

// ─── Unsplash image URLs ──────────────────────────────────────────────────────
const IMG = {
  // Wellness
  meditation: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop&auto=format",
  avatar:     "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format",
  journal:    "https://images.unsplash.com/photo-1579017308347-e53e0d2fc5e9?w=400&h=260&fit=crop&auto=format",
  night:      "https://images.unsplash.com/photo-1616331027398-43237406dcb4?w=600&h=300&fit=crop&auto=format",
  // Shop
  shopHero:   "https://images.unsplash.com/photo-1539278383962-a7774385fa02?w=600&h=340&fit=crop&auto=format",
  shopBag:    "https://images.unsplash.com/photo-1727407209320-1fa6ae60ee05?w=300&h=300&fit=crop&auto=format",
  // Social
  socialPost1:"https://images.unsplash.com/photo-1724862936518-ae7fcfc052c1?w=400&h=400&fit=crop&auto=format",
  socialPost2:"https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=400&fit=crop&auto=format",
  socialPost3:"https://images.unsplash.com/photo-1683721003111-070bcc053d8b?w=400&h=400&fit=crop&auto=format",
  // Finance
  financeHero:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop&auto=format",
  // Food
  foodHero:   "https://images.unsplash.com/photo-1770334597607-793046ac75d1?w=600&h=340&fit=crop&auto=format",
  foodCity:   "https://images.unsplash.com/photo-1770273502690-8225cfb81790?w=400&h=220&fit=crop&auto=format",
  // Fitness
  fitRun:     "https://images.unsplash.com/photo-1480179087180-d9f0ec044897?w=600&h=340&fit=crop&auto=format",
  fitGym:     "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=400&h=220&fit=crop&auto=format",
  // Music
  musicDark:  "https://images.unsplash.com/photo-1723912628184-dfde150fab82?w=600&h=600&fit=crop&auto=format",
  musicNeon:  "https://images.unsplash.com/photo-1655929947488-862b3b2f6f67?w=400&h=400&fit=crop&auto=format",
  // Travel
  travelMtn:  "https://images.unsplash.com/photo-1512629187662-0c4700e84c33?w=600&h=340&fit=crop&auto=format",
  travelBall: "https://images.unsplash.com/photo-1779361842697-37175264f859?w=400&h=300&fit=crop&auto=format",
  // Real Estate
  homeRoom:   "https://images.unsplash.com/photo-1638885930125-85350348d266?w=600&h=340&fit=crop&auto=format",
  homeSofa:   "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=280&fit=crop&auto=format",
};

// ─── Types ───────────────────────────────────────────────────────────────────
type DeviceMode = "phone" | "tablet" | "desktop";
type BuildView  = "preview" | "code" | "deployed";

interface ChatMessage { id: string; role: "user" | "assistant"; content: string; ts: Date; }
interface UploadedFile { id: string; name: string; type: "file" | "image"; mime: string; }
interface ToggleItem   { id: string; name: string; desc: string; on: boolean; }
interface Connector    { id: string; name: string; desc: string; connected: boolean; }
interface Capability   { id: string; name: string; desc: string; category: string; active: boolean; }

// ─── Mock data ────────────────────────────────────────────────────────────────
const MODELS = ["Enigma Auto", "GPT-4.1", "Claude Sonnet", "Claude Opus", "Gemini Pro", "DeepSeek Coder", "Local Model"];

const INIT_CONNECTORS: Connector[] = [
  { id:"sup", name:"Supabase",        desc:"Postgres database & auth",       connected:false },
  { id:"fir", name:"Firebase",        desc:"Realtime DB & hosting",          connected:false },
  { id:"git", name:"GitHub",          desc:"Source control & CI",            connected:false },
  { id:"ver", name:"Vercel",          desc:"Deploy & edge functions",        connected:false },
  { id:"str", name:"Stripe",          desc:"Payments & subscriptions",       connected:false },
  { id:"oar", name:"OpenRouter",      desc:"Multi-model API gateway",        connected:false },
  { id:"oai", name:"OpenAI",          desc:"GPT models & DALL-E",            connected:false },
  { id:"ant", name:"Anthropic",       desc:"Claude models",                  connected:false },
  { id:"gdr", name:"Google Drive",    desc:"File storage & docs",            connected:false },
  { id:"gml", name:"Gmail",           desc:"Email send & receive",           connected:false },
  { id:"gcl", name:"Google Calendar", desc:"Events & scheduling",            connected:false },
  { id:"apl", name:"Apple Developer", desc:"App Store & push certs",         connected:false },
  { id:"gpc", name:"Play Console",    desc:"Google Play distribution",       connected:false },
  { id:"ble", name:"Bluetooth",       desc:"BLE device connectivity",        connected:false },
  { id:"cam", name:"Camera",          desc:"Device camera access",           connected:false },
  { id:"mic", name:"Microphone",      desc:"Audio capture",                  connected:false },
  { id:"psh", name:"Push Notifications", desc:"Cross-platform push",         connected:false },
  { id:"map", name:"Maps / Location", desc:"GPS & map rendering",            connected:false },
];

const INIT_SKILLS: ToggleItem[] = [
  { id:"uip", name:"UI Polish",           desc:"Refine spacing, type, color", on:false },
  { id:"lpb", name:"Landing Page Builder",desc:"Generate marketing pages",    on:false },
  { id:"aus", name:"Auth Setup",          desc:"Adds auth flows",             on:true  },
  { id:"ssc", name:"Supabase Schema",     desc:"Design DB tables",            on:false },
  { id:"asp", name:"App Store Prep",      desc:"Checklist & assets",          on:false },
  { id:"psp", name:"Play Store Prep",     desc:"Checklist & assets",          on:false },
  { id:"seo", name:"SEO Setup",           desc:"Meta tags & sitemaps",        on:false },
  { id:"cpw", name:"Copywriter",          desc:"AI-written UI copy",          on:true  },
  { id:"bug", name:"Bug Fixer",           desc:"Detect & fix issues",         on:false },
  { id:"pay", name:"Payment Flow",        desc:"Stripe checkout setup",       on:false },
  { id:"img", name:"Image Generator",     desc:"AI images inline",            on:false },
  { id:"dim", name:"Data Importer",       desc:"CSV/JSON ingestion",          on:false },
];

const INIT_AGENTS: ToggleItem[] = [
  { id:"pa",  name:"Product Architect",    desc:"Shapes features & flows",    on:true  },
  { id:"uid", name:"UI Designer",          desc:"Visual polish & layout",     on:true  },
  { id:"be",  name:"Backend Engineer",     desc:"API & server logic",         on:false },
  { id:"mob", name:"Mobile App Engineer",  desc:"React Native & Expo",        on:false },
  { id:"db",  name:"Database Planner",     desc:"Schema & indexing",          on:false },
  { id:"qa",  name:"QA Tester",            desc:"Test cases & coverage",      on:false },
  { id:"as",  name:"App Store Strategist", desc:"ASO & store copy",           on:false },
  { id:"gs",  name:"Growth Strategist",    desc:"Retention & funnels",        on:false },
  { id:"sec", name:"Security Reviewer",    desc:"Audits & vulnerabilities",   on:false },
  { id:"dep", name:"Deployment Manager",   desc:"CI/CD & infra",              on:false },
];

const INIT_CAPS: Capability[] = [
  // Device
  { id:"d1", name:"Bluetooth",         category:"Device",  desc:"BLE scanning & pairing",       active:false },
  { id:"d2", name:"Camera",            category:"Device",  desc:"Photo & video capture",         active:false },
  { id:"d3", name:"Microphone",        category:"Device",  desc:"Audio input",                   active:false },
  { id:"d4", name:"Push Notifications",category:"Device",  desc:"OS-level alerts",               active:false },
  { id:"d5", name:"Location Services", category:"Device",  desc:"GPS & geofencing",              active:false },
  { id:"d6", name:"Contacts",          category:"Device",  desc:"Address book access",           active:false },
  { id:"d7", name:"Calendar Access",   category:"Device",  desc:"Read/write calendar events",    active:false },
  { id:"d8", name:"File System Access",category:"Device",  desc:"Local file read/write",         active:false },
  { id:"d9", name:"Offline Mode",      category:"Device",  desc:"Service worker & cache",        active:false },
  // App
  { id:"a1", name:"User Authentication",category:"App",    desc:"Login, signup, OAuth",          active:true  },
  { id:"a2", name:"Payments",          category:"App",     desc:"One-time charges",              active:false },
  { id:"a3", name:"Subscriptions",     category:"App",     desc:"Recurring billing",             active:false },
  { id:"a4", name:"Chat",              category:"App",     desc:"Real-time messaging",           active:false },
  { id:"a5", name:"Image Upload",      category:"App",     desc:"S3/Supabase storage",           active:false },
  { id:"a6", name:"Video Upload",      category:"App",     desc:"Video storage & streaming",     active:false },
  { id:"a7", name:"Admin Dashboard",   category:"App",     desc:"Internal management UI",        active:false },
  { id:"a8", name:"Analytics",         category:"App",     desc:"Event tracking & funnels",      active:false },
  { id:"a9", name:"Search",            category:"App",     desc:"Full-text search",              active:false },
  { id:"a10",name:"Notifications",     category:"App",     desc:"In-app alert system",           active:false },
  { id:"a11",name:"Export Data",       category:"App",     desc:"CSV/JSON data export",          active:false },
  // AI
  { id:"ai1",name:"Text Generation",   category:"AI",      desc:"LLM-powered content",           active:true  },
  { id:"ai2",name:"Image Generation",  category:"AI",      desc:"DALL-E / Stable Diffusion",     active:false },
  { id:"ai3",name:"Audio Transcription",category:"AI",     desc:"Whisper-style STT",             active:false },
  { id:"ai4",name:"Voice Generation",  category:"AI",      desc:"TTS synthesis",                 active:false },
  { id:"ai5",name:"Code Generation",   category:"AI",      desc:"AI-assisted coding",            active:true  },
  { id:"ai6",name:"Document Analysis", category:"AI",      desc:"PDF / doc parsing",             active:false },
  { id:"ai7",name:"Workflow Automation",category:"AI",     desc:"Multi-step agent pipelines",    active:false },
];

const MOCK_FILES = [
  { name:"src/App.tsx",                   lang:"tsx", code:`export default function App() {\n  return <div className="app">Hello Lotus</div>;\n}` },
  { name:"src/components/Home.tsx",       lang:"tsx", code:`export default function Home() {\n  return <main>Home screen</main>;\n}` },
  { name:"src/components/Dashboard.tsx",  lang:"tsx", code:`export default function Dashboard() {\n  return <section>Dashboard</section>;\n}` },
  { name:"src/lib/supabase.ts",           lang:"ts",  code:`import { createClient } from "@supabase/supabase-js";\nexport const supabase = createClient(URL, KEY);` },
  { name:"package.json",                  lang:"json",code:`{\n  "name": "lotus-app",\n  "version": "1.0.0"\n}` },
  { name:"README.md",                     lang:"md",  code:`# Lotus App\n\nBuilt with Lotus AI builder.` },
];

const PLUS_ITEMS = [
  { icon:<Upload size={12}/>,   label:"Upload File"         },
  { icon:<ImageIcon size={12}/>,label:"Upload Image"        },
  { icon:<Plug size={12}/>,     label:"Add Connector"       },
  { icon:<Sparkles size={12}/>, label:"Add Skill"           },
  { icon:<Bot size={12}/>,      label:"Add Agent"           },
  { icon:<Cpu size={12}/>,      label:"Add Function"        },
  { icon:<FileText size={12}/>, label:"Import Design"       },
  { icon:<Code2 size={12}/>,    label:"Import GitHub Repo"  },
  { icon:<Settings size={12}/>, label:"Add API Key"         },
  { icon:<Smartphone size={12}/>,label:"Add Device Capability"},
];

const INIT_MESSAGES: ChatMessage[] = [
  { id:"1", role:"assistant", content:"Welcome to Lotus. Describe the app you want to build — I'll bring it to life.", ts: new Date(Date.now()-120000) },
  { id:"2", role:"user",      content:"Build me a wellness tracking app — mood check-ins, sleep logs, gratitude journal. Calm, minimal.", ts: new Date(Date.now()-90000) },
  { id:"3", role:"assistant", content:"Crafting a three-tab layout — Mood, Sleep, Journal — with sage-and-ivory palette. Generating preview…", ts: new Date(Date.now()-60000) },
];

// ─── Preset types ─────────────────────────────────────────────────────────────
type PresetId = "wellness"|"shop"|"social"|"finance"|"food"|"fitness"|"music"|"travel"|"realestate";

interface Preset { id: PresetId; label: string; emoji: string; keywords: string[]; accent: string; bg: string; }

const PRESETS: Preset[] = [
  { id:"wellness",   label:"Wellness",    emoji:"🌿", keywords:["wellness","mood","sleep","journal","meditat","calm","breath","gratitud"],       accent:"#2D4A3E", bg:"#F0F4EE" },
  { id:"shop",       label:"Shop",        emoji:"🛍️", keywords:["shop","store","buy","product","commerce","cart","fashion","retail","checkout"],  accent:"#1A1A2E", bg:"#F8F8F5" },
  { id:"social",     label:"Social",      emoji:"📱", keywords:["social","feed","post","instagram","follow","like","story","profile","photo"],    accent:"#5B5BD6", bg:"#F5F4FF" },
  { id:"finance",    label:"Finance",     emoji:"💹", keywords:["finance","money","bank","invest","crypto","wallet","stock","portfolio","trade"],  accent:"#0A2540", bg:"#F0F4F8" },
  { id:"food",       label:"Food",        emoji:"🍕", keywords:["food","eat","restaurant","delivery","pizza","burger","meal","order","hungry"],   accent:"#C1440E", bg:"#FFF8F3" },
  { id:"fitness",    label:"Fitness",     emoji:"🏃", keywords:["fitness","gym","workout","run","exercise","training","steps","calories","sport"],accent:"#1B4332", bg:"#F0FAF4" },
  { id:"music",      label:"Music",       emoji:"🎵", keywords:["music","song","playlist","album","spotify","artist","beat","listen","audio"],    accent:"#6D28D9", bg:"#0D0D1A" },
  { id:"travel",     label:"Travel",      emoji:"✈️", keywords:["travel","trip","hotel","flight","vacation","destination","book","tour","explore"],accent:"#164E63", bg:"#F0F9FF" },
  { id:"realestate", label:"Real Estate", emoji:"🏠", keywords:["house","real estate","property","home","rent","apartment","listing","buy house"],accent:"#78350F", bg:"#FFFBF0" },
];

function detectPreset(text: string): PresetId | null {
  const lower = text.toLowerCase();
  for (const p of PRESETS) {
    if (p.keywords.some(k => lower.includes(k))) return p.id;
  }
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d: Date) { return d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }); }

function fileIcon(mime: string) {
  if (mime.startsWith("image/")) return <ImageIcon size={10}/>;
  if (mime.includes("json") || mime.includes("javascript") || mime.includes("typescript")) return <Code2 size={10}/>;
  return <FileText size={10}/>;
}

// ─── Shared chart data ────────────────────────────────────────────────────────
const SLEEP_DATA    = [{ day:"Mon",hours:6.5},{ day:"Tue",hours:7.2},{ day:"Wed",hours:8.0},{ day:"Thu",hours:5.8},{ day:"Fri",hours:7.5},{ day:"Sat",hours:8.5},{ day:"Sun",hours:7.1}];
const MOOD_TREND    = [{ time:"8am",score:3},{ time:"10am",score:4},{ time:"12pm",score:3.5},{ time:"2pm",score:4.2},{ time:"4pm",score:3.8},{ time:"6pm",score:4.5},{ time:"8pm",score:4.8}];
const FINANCE_DATA  = [{ m:"Jan",v:9800},{ m:"Feb",v:10200},{ m:"Mar",v:9600},{ m:"Apr",v:11400},{ m:"May",v:12800},{ m:"Jun",v:13100},{ m:"Jul",v:14650}];
const STEPS_DATA    = [{ d:"M",s:7400},{ d:"T",s:9100},{ d:"W",s:6800},{ d:"T",s:11200},{ d:"F",s:8300},{ d:"S",s:12500},{ d:"S",s:5900}];
const MOODS = [{ emoji:"😔",label:"Low",color:"#94A3B8"},{ emoji:"😐",label:"Okay",color:"#A3B18A"},{ emoji:"🙂",label:"Good",color:"#84C07D"},{ emoji:"😊",label:"Great",color:"#52B788"},{ emoji:"🌟",label:"Bliss",color:"#2D6A4F"}];

// ─── Shared preview shell helper ─────────────────────────────────────────────
function PreviewShell({ bg, children }: { bg:string; children:React.ReactNode }) {
  return <div className="w-full h-full flex flex-col overflow-hidden" style={{ background:bg, fontFamily:"Outfit,sans-serif" }}>{children}</div>;
}
function Card({ p=14, r=16, children }: { p?:number; r?:number; children:React.ReactNode }) {
  return <div style={{ background:"#fff", borderRadius:r, padding:p, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>{children}</div>;
}
function Label({ children, color="#9EB8AE" }: { children:React.ReactNode; color?:string }) {
  return <p style={{ fontSize:9, color, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" as const, marginBottom:8 }}>{children}</p>;
}

// ─── 1. Wellness ──────────────────────────────────────────────────────────────
function WellnessPreview({ device }: { device: DeviceMode }) {
  const [tab, setTab] = useState<"mood"|"sleep"|"journal">("mood");
  const [selectedMood, setSelectedMood] = useState(3);
  const uid = useId();
  const gradId = `moodGrad-${uid.replace(/:/g, "")}`;
  const isPhone = device === "phone";
  const navTabs = [
    { key:"mood",    label:"Mood",    Icon:Heart   },
    { key:"sleep",   label:"Sleep",   Icon:Moon    },
    { key:"journal", label:"Journal", Icon:BookOpen },
  ] as const;
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background:"#F7F9F6", fontFamily:"Outfit,sans-serif" }}>

      {/* ── Status / Header ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid rgba(0,0,0,0.06)", flexShrink:0 }}>
        {/* Top row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:`${isPhone?8:10}px ${isPhone?14:20}px` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <img src={IMG.avatar} alt="Avatar" style={{ width:isPhone?28:34, height:isPhone?28:34, borderRadius:"50%", objectFit:"cover", border:"2px solid #C8E6C9" }}/>
            <div>
              <p style={{ fontSize:isPhone?9:10, color:"#9EB8AE", fontWeight:500, lineHeight:1.2 }}>Good morning</p>
              <p style={{ fontSize:isPhone?12:14, fontWeight:600, color:"#1A3C32", lineHeight:1.2 }}>Sophia</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:isPhone?6:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 8px", borderRadius:999, background:"rgba(45,74,62,0.08)" }}>
              <Flame size={isPhone?9:11} color="#E07A5F"/>
              <span style={{ fontSize:isPhone?9:11, fontWeight:600, color:"#E07A5F" }}>7</span>
            </div>
            <div style={{ width:isPhone?24:28, height:isPhone?24:28, borderRadius:"50%", background:"#F0F4EE", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Bell size={isPhone?11:13} color="#6B8C7E"/>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        {!isPhone ? (
          <div style={{ display:"flex", padding:"0 20px", gap:2 }}>
            {navTabs.map(({ key, label, Icon }) => (
              <button key={key} onClick={()=>setTab(key)}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:"8px 8px 0 0", fontSize:12, fontWeight:500,
                  background:tab===key?"#F7F9F6":"transparent",
                  color:tab===key?"#2D4A3E":"#9EB8AE",
                  borderBottom:tab===key?"2px solid #2D4A3E":"2px solid transparent" }}>
                <Icon size={12}/>{label}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display:"flex", padding:"0 14px 0", gap:4 }}>
            {navTabs.map(({ key, label, Icon }) => (
              <button key={key} onClick={()=>setTab(key)}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"6px 0",
                  color:tab===key?"#2D4A3E":"#B0CAC0",
                  borderBottom:tab===key?"2px solid #2D4A3E":"2px solid transparent",
                  background:"transparent", fontSize:9, fontWeight:500 }}>
                <Icon size={11}/>{label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>

        {/* MOOD TAB */}
        {tab==="mood" && (
          <div style={{ padding:isPhone?12:20, display:"flex", flexDirection:"column", gap:isPhone?12:16 }}>

            {/* Hero image card */}
            <div style={{ position:"relative", borderRadius:isPhone?16:20, overflow:"hidden", height:isPhone?120:160, flexShrink:0 }}>
              <img src={IMG.meditation} alt="Meditation" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(45,74,62,0.1), rgba(45,74,62,0.55))" }}/>
              <div style={{ position:"absolute", bottom:0, left:0, padding:isPhone?12:16 }}>
                <p style={{ fontSize:isPhone?9:10, color:"rgba(255,255,255,0.8)", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" }}>Daily intention</p>
                <p style={{ fontSize:isPhone?12:15, color:"#fff", fontWeight:600, lineHeight:1.4, maxWidth:200 }}>Find stillness in every breath</p>
              </div>
              <div style={{ position:"absolute", top:10, right:10, background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", borderRadius:999, padding:"3px 8px", display:"flex", alignItems:"center", gap:4 }}>
                <Wind size={isPhone?9:10} color="#fff"/>
                <span style={{ fontSize:isPhone?9:10, color:"#fff", fontWeight:500 }}>Breathe</span>
              </div>
            </div>

            {/* Mood picker */}
            <div style={{ background:"#fff", borderRadius:isPhone?14:18, padding:isPhone?12:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize:isPhone?9:10, color:"#9EB8AE", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:isPhone?8:12 }}>How are you feeling?</p>
              <div style={{ display:"flex", justifyContent:"space-between", gap:4 }}>
                {MOODS.map((m,i)=>(
                  <button key={i} onClick={()=>setSelectedMood(i)}
                    style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:`${isPhone?6:8}px 4px`, borderRadius:12,
                      background:selectedMood===i?m.color+"18":"transparent",
                      border:selectedMood===i?`1.5px solid ${m.color}40`:"1.5px solid transparent",
                      transition:"all 0.2s" }}>
                    <span style={{ fontSize:isPhone?18:22, filter:selectedMood===i?"none":"grayscale(0.5)", opacity:selectedMood===i?1:0.55 }}>{m.emoji}</span>
                    <span style={{ fontSize:isPhone?8:9, color:selectedMood===i?m.color:"#9EB8AE", fontWeight:600 }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mood trend chart */}
            <div style={{ background:"#fff", borderRadius:isPhone?14:18, padding:isPhone?12:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:isPhone?8:12 }}>
                <p style={{ fontSize:isPhone?9:10, color:"#9EB8AE", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>Today's trend</p>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <TrendingUp size={isPhone?10:12} color="#52B788"/>
                  <span style={{ fontSize:isPhone?9:11, color:"#52B788", fontWeight:600 }}>+0.8</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={isPhone?52:70}>
                <AreaChart data={MOOD_TREND} margin={{ top:4, right:0, left:-24, bottom:0 }}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#52B788" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#52B788" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize:8, fill:"#9EB8AE" }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ fontSize:10, borderRadius:8, border:"none", boxShadow:"0 4px 16px rgba(0,0,0,0.1)", fontFamily:"Outfit,sans-serif" }} itemStyle={{ color:"#2D4A3E" }}/>
                  <Area type="monotone" dataKey="score" stroke="#52B788" strokeWidth={2} fill={`url(#${gradId})`} dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* SLEEP TAB */}
        {tab==="sleep" && (
          <div style={{ padding:isPhone?12:20, display:"flex", flexDirection:"column", gap:isPhone?12:16 }}>

            {/* Night image */}
            <div style={{ position:"relative", borderRadius:isPhone?16:20, overflow:"hidden", height:isPhone?110:140, flexShrink:0 }}>
              <img src={IMG.night} alt="Night sky" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(10,20,40,0.2), rgba(10,20,40,0.7))" }}/>
              <div style={{ position:"absolute", bottom:0, left:0, padding:isPhone?12:16, display:"flex", gap:isPhone?16:24 }}>
                {[{ label:"Avg", val:"7h 22m" }, { label:"Best", val:"8h 32m" }, { label:"Score", val:"84" }].map(s=>(
                  <div key={s.label}>
                    <p style={{ fontSize:isPhone?8:9, color:"rgba(255,255,255,0.6)", fontWeight:500 }}>{s.label}</p>
                    <p style={{ fontSize:isPhone?13:16, color:"#fff", fontWeight:700 }}>{s.val}</p>
                  </div>
                ))}
              </div>
              <div style={{ position:"absolute", top:10, right:10 }}>
                <Moon size={isPhone?16:20} color="rgba(255,255,255,0.8)"/>
              </div>
            </div>

            {/* Sleep bar chart */}
            <div style={{ background:"#fff", borderRadius:isPhone?14:18, padding:isPhone?12:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize:isPhone?9:10, color:"#9EB8AE", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:isPhone?8:12 }}>Weekly sleep hours</p>
              <ResponsiveContainer width="100%" height={isPhone?80:110}>
                <BarChart data={SLEEP_DATA} margin={{ top:4, right:0, left:-28, bottom:0 }} barSize={isPhone?14:20}>
                  <XAxis dataKey="day" tick={{ fontSize:9, fill:"#9EB8AE" }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[4,10]} tick={{ fontSize:8, fill:"#9EB8AE" }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ fontSize:10, borderRadius:8, border:"none", boxShadow:"0 4px 16px rgba(0,0,0,0.1)", fontFamily:"Outfit,sans-serif" }} itemStyle={{ color:"#1A3C32" }}/>
                  <Bar dataKey="hours" radius={[4,4,0,0]}
                    fill="#2D4A3E"
                    label={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sleep quality */}
            <div style={{ background:"#fff", borderRadius:isPhone?14:18, padding:isPhone?12:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize:isPhone?9:10, color:"#9EB8AE", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:isPhone?8:12 }}>Sleep stages — last night</p>
              {[{ label:"Deep", pct:22, color:"#1A3C32" }, { label:"REM", pct:28, color:"#2D4A3E" }, { label:"Light", pct:38, color:"#52B788" }, { label:"Awake", pct:12, color:"#C8E6C9" }].map(s=>(
                <div key={s.label} style={{ marginBottom:isPhone?6:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:isPhone?9:11, color:"#3D6B5A", fontWeight:500 }}>{s.label}</span>
                    <span style={{ fontSize:isPhone?9:11, color:"#9EB8AE", fontWeight:500 }}>{s.pct}%</span>
                  </div>
                  <div style={{ height:isPhone?5:6, borderRadius:999, background:"#F0F4EE", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${s.pct}%`, borderRadius:999, background:s.color, transition:"width 0.8s ease" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOURNAL TAB */}
        {tab==="journal" && (
          <div style={{ padding:isPhone?12:20, display:"flex", flexDirection:"column", gap:isPhone?12:16 }}>

            {/* Journal hero */}
            <div style={{ position:"relative", borderRadius:isPhone?16:20, overflow:"hidden", height:isPhone?120:150, flexShrink:0 }}>
              <img src={IMG.journal} alt="Journal" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(255,255,255,0.85), rgba(255,255,255,0.2))" }}/>
              <div style={{ position:"absolute", top:0, left:0, padding:isPhone?14:20 }}>
                <p style={{ fontSize:isPhone?9:10, color:"#9EB8AE", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:4 }}>Today · July 15</p>
                <p style={{ fontSize:isPhone?14:18, fontFamily:"Fraunces,serif", color:"#1A3C32", fontWeight:500, lineHeight:1.35, maxWidth:180 }}>Grateful for quiet moments</p>
              </div>
            </div>

            {/* Entry */}
            <div style={{ background:"#fff", borderRadius:isPhone?14:18, padding:isPhone?14:18, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:isPhone?8:12 }}>
                <Star size={isPhone?12:14} color="#D4A030" fill="#D4A030"/>
                <p style={{ fontSize:isPhone?9:10, color:"#9EB8AE", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>Three things I'm grateful for</p>
              </div>
              {["The quiet morning light filtering through the window", "A strong cup of coffee and the smell of rain", "My team's support during a challenging sprint"].map((entry,i)=>(
                <div key={i} style={{ display:"flex", gap:10, marginBottom:isPhone?8:10, alignItems:"flex-start" }}>
                  <div style={{ width:isPhone?18:20, height:isPhone?18:20, borderRadius:"50%", background:"rgba(200,146,42,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    <span style={{ fontSize:isPhone?9:10, color:"#C8922A", fontWeight:700 }}>{i+1}</span>
                  </div>
                  <p style={{ fontSize:isPhone?11:12.5, color:"#3D6B5A", lineHeight:1.55 }}>{entry}</p>
                </div>
              ))}
              <div style={{ marginTop:isPhone?10:14, display:"flex", flexWrap:"wrap", gap:6 }}>
                {["#morning","#grateful","#team","#calm"].map(tag=>(
                  <span key={tag} style={{ fontSize:isPhone?9:10, background:"#EAF3EE", color:"#52B788", fontWeight:600, padding:"2px 8px", borderRadius:999 }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Past entries preview */}
            <div style={{ background:"#fff", borderRadius:isPhone?14:18, padding:isPhone?12:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize:isPhone?9:10, color:"#9EB8AE", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:isPhone?8:10 }}>Recent entries</p>
              {[{ date:"Jul 14", preview:"Appreciated the rain and the silence it brought…", mood:"😊" }, { date:"Jul 13", preview:"Proud of shipping the new feature on time…", mood:"🌟" }, { date:"Jul 12", preview:"Finding it hard to focus, but pushed through…", mood:"😐" }].map(e=>(
                <div key={e.date} style={{ display:"flex", alignItems:"center", gap:10, padding:`${isPhone?7:9}px 0`, borderBottom:"1px solid #F0F4EE" }}>
                  <span style={{ fontSize:isPhone?14:16 }}>{e.mood}</span>
                  <div style={{ flex:1, overflow:"hidden" }}>
                    <p style={{ fontSize:isPhone?9:10, color:"#9EB8AE", fontWeight:500 }}>{e.date}</p>
                    <p style={{ fontSize:isPhone?10:11, color:"#3D6B5A", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.preview}</p>
                  </div>
                  <ChevronDown size={isPhone?10:12} color="#C8E6C9" style={{ transform:"rotate(-90deg)" }}/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 2. Shop ─────────────────────────────────────────────────────────────────
function ShopPreview({ device }: { device: DeviceMode }) {
  const ph = device==="phone";
  const products = [
    { name:"Linen Blazer", price:"$148", tag:"New", img:IMG.shopHero },
    { name:"Canvas Tote",  price:"$64",  tag:"",    img:IMG.shopBag  },
  ];
  return (
    <PreviewShell bg="#F8F8F5">
      <div style={{ background:"#fff", padding:`${ph?10:14}px ${ph?14:20}px`, borderBottom:"1px solid #F0EEE8", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"Fraunces,serif", fontSize:ph?16:18, fontWeight:600, color:"#1A1A2E" }}>Maison</span>
        <div style={{ display:"flex", gap:10 }}>
          {["Search","Cart"].map(l=><button key={l} style={{ fontSize:ph?9:11, color:"#9998A9", fontWeight:500 }}>{l}</button>)}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" as const, padding:ph?12:20 }}>
        <div style={{ position:"relative", borderRadius:ph?16:20, overflow:"hidden", height:ph?140:190, marginBottom:ph?12:16 }}>
          <img src={IMG.shopHero} alt="Hero" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(26,26,46,0.65),transparent)" }}/>
          <div style={{ position:"absolute", top:0, left:0, padding:ph?16:24 }}>
            <p style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.7)", letterSpacing:"0.1em", textTransform:"uppercase" as const }}>New Season</p>
            <p style={{ fontSize:ph?18:24, fontFamily:"Fraunces,serif", color:"#fff", fontWeight:500, lineHeight:1.3, marginTop:4 }}>Summer<br/>Essentials</p>
            <button style={{ marginTop:10, background:"#fff", color:"#1A1A2E", fontSize:ph?9:11, fontWeight:600, padding:`${ph?5:6}px ${ph?12:16}px`, borderRadius:999 }}>Shop Now</button>
          </div>
        </div>
        <p style={{ fontSize:ph?9:10, color:"#9998A9", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" as const, marginBottom:10 }}>Featured</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:ph?10:14 }}>
          {products.map(p=>(
            <div key={p.name} style={{ borderRadius:ph?12:16, overflow:"hidden", background:"#fff", boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ height:ph?100:130, overflow:"hidden", position:"relative" }}>
                <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                {p.tag && <span style={{ position:"absolute", top:8, left:8, background:"#1A1A2E", color:"#fff", fontSize:8, fontWeight:700, padding:"2px 7px", borderRadius:999 }}>{p.tag}</span>}
              </div>
              <div style={{ padding:ph?8:10 }}>
                <p style={{ fontSize:ph?10:12, fontWeight:600, color:"#1A1A2E" }}>{p.name}</p>
                <p style={{ fontSize:ph?9:11, color:"#9998A9", marginTop:2 }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:ph?12:16 }}>
          <p style={{ fontSize:ph?9:10, color:"#9998A9", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" as const, marginBottom:10 }}>Categories</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const }}>
            {["Tops","Bottoms","Outerwear","Accessories","Shoes"].map(c=>(
              <button key={c} style={{ padding:`${ph?4:5}px ${ph?10:14}px`, borderRadius:999, background:"#F0EEE8", color:"#1A1A2E", fontSize:ph?9:11, fontWeight:500 }}>{c}</button>
            ))}
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

// ─── 3. Social ────────────────────────────────────────────────────────────────
function SocialPreview({ device }: { device: DeviceMode }) {
  const ph = device==="phone";
  const [liked, setLiked] = useState<Record<number,boolean>>({});
  const posts = [
    { user:"@luna.visual",  img:IMG.socialPost1, likes:2847, caption:"Golden hour never gets old ✨", time:"2m" },
    { user:"@raf.creates",  img:IMG.socialPost2, likes:1203, caption:"New studio setup is 🔥",        time:"18m" },
    { user:"@mia.wanders",  img:IMG.socialPost3, likes:4510, caption:"Social media in 2025",         time:"1h" },
  ];
  return (
    <PreviewShell bg="#FAFAFA">
      <div style={{ background:"#fff", padding:`${ph?10:12}px ${ph?14:20}px`, borderBottom:"1px solid #F0F0F0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"Fraunces,serif", fontSize:ph?17:20, fontWeight:600, color:"#1A1A1A" }}>Aura</span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <Bell size={ph?14:16} color="#5B5BD6"/>
          <div style={{ width:ph?26:30, height:ph?26:30, borderRadius:"50%", overflow:"hidden" }}>
            <img src={IMG.avatar} alt="me" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
        </div>
      </div>
      {/* Stories */}
      <div style={{ background:"#fff", padding:`${ph?10:12}px 0`, borderBottom:"1px solid #F0F0F0", display:"flex", gap:ph?10:14, overflowX:"auto", scrollbarWidth:"none" as const, paddingLeft:ph?14:20, paddingRight:ph?14:20 }}>
        {[IMG.socialPost1, IMG.socialPost2, IMG.socialPost3, IMG.avatar].map((src,i)=>(
          <div key={i} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ width:ph?42:52, height:ph?42:52, borderRadius:"50%", padding:2, background:"linear-gradient(135deg,#5B5BD6,#E07A5F)", flexShrink:0 }}>
              <div style={{ width:"100%", height:"100%", borderRadius:"50%", overflow:"hidden", border:"2px solid #fff" }}>
                <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              </div>
            </div>
            <span style={{ fontSize:8, color:"#888", fontWeight:500 }}>{["Luna","Raf","Mia","You"][i]}</span>
          </div>
        ))}
      </div>
      {/* Feed */}
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" as const }}>
        {posts.map((post,i)=>(
          <div key={i} style={{ borderBottom:"8px solid #F5F5F5" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:`${ph?8:10}px ${ph?14:20}px` }}>
              <div style={{ width:ph?28:34, height:ph?28:34, borderRadius:"50%", overflow:"hidden", border:"2px solid #5B5BD6" }}>
                <img src={Object.values(IMG)[i%4]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              </div>
              <span style={{ fontSize:ph?11:13, fontWeight:600, color:"#1A1A1A", flex:1 }}>{post.user}</span>
              <span style={{ fontSize:ph?9:10, color:"#AAA" }}>{post.time}</span>
            </div>
            <div style={{ height:ph?220:280, overflow:"hidden" }}>
              <img src={post.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
            <div style={{ padding:`${ph?8:10}px ${ph?14:20}px` }}>
              <div style={{ display:"flex", gap:16, marginBottom:6 }}>
                <button onClick={()=>setLiked(l=>({...l,[i]:!l[i]}))} style={{ display:"flex", alignItems:"center", gap:4, background:"none" }}>
                  <Heart size={ph?14:16} color={liked[i]?"#E07A5F":"#888"} fill={liked[i]?"#E07A5F":"none"}/>
                  <span style={{ fontSize:ph?11:13, color:"#888", fontWeight:500 }}>{post.likes+(liked[i]?1:0)}</span>
                </button>
              </div>
              <p style={{ fontSize:ph?11:13, color:"#1A1A1A", lineHeight:1.5 }}>{post.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

// ─── 4. Finance ───────────────────────────────────────────────────────────────
function FinancePreview({ device }: { device: DeviceMode }) {
  const ph = device==="phone";
  const uid = useId();
  const gid = `finGrad-${uid.replace(/:/g,"")}`;
  return (
    <PreviewShell bg="#F0F4F8">
      <div style={{ background:"linear-gradient(135deg,#0A2540,#1A3A5C)", padding:`${ph?14:20}px ${ph?16:24}px`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:ph?16:22 }}>
          <span style={{ fontFamily:"Fraunces,serif", fontSize:ph?16:18, color:"rgba(255,255,255,0.9)", fontWeight:500 }}>Portfolio</span>
          <div style={{ width:ph?26:30, height:ph?26:30, borderRadius:"50%", overflow:"hidden", border:"2px solid rgba(255,255,255,0.3)" }}>
            <img src={IMG.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
        </div>
        <p style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.5)", letterSpacing:"0.06em", textTransform:"uppercase" as const }}>Total balance</p>
        <p style={{ fontSize:ph?28:36, fontWeight:700, color:"#fff", lineHeight:1.2, margin:"4px 0" }}>$14,650<span style={{ fontSize:ph?14:18, fontWeight:400, opacity:0.7 }}>.28</span></p>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <TrendingUp size={ph?11:13} color="#4ADE80"/>
          <span style={{ fontSize:ph?10:12, color:"#4ADE80", fontWeight:600 }}>+$1,824 (14.2%) this month</span>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" as const, padding:ph?12:20, display:"flex", flexDirection:"column", gap:ph?12:16 }}>
        <Card p={ph?12:16} r={ph?14:18}>
          <Label>7-month performance</Label>
          <ResponsiveContainer width="100%" height={ph?80:110}>
            <AreaChart data={FINANCE_DATA} margin={{ top:4,right:0,left:-28,bottom:0 }}>
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0A2540" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#0A2540" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fontSize:8, fill:"#9EB8AE" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ fontSize:10, borderRadius:8, border:"none", boxShadow:"0 4px 16px rgba(0,0,0,0.1)", fontFamily:"Outfit,sans-serif" }}/>
              <Area type="monotone" dataKey="v" stroke="#0A2540" strokeWidth={2} fill={`url(#${gid})`} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card p={ph?12:16} r={ph?14:18}>
          <Label>Holdings</Label>
          {[{ name:"AAPL",  pct:38, gain:"+12.4%", color:"#0A2540" },{ name:"BTC",   pct:25, gain:"+34.1%", color:"#4A90D9" },{ name:"NVDA",  pct:22, gain:"+8.7%",  color:"#52B788" },{ name:"Cash",  pct:15, gain:"",       color:"#C8D8E4" }].map(h=>(
            <div key={h.name} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:ph?8:10 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:h.color, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:ph?11:13, fontWeight:600, color:"#0A2540" }}>{h.name}</span>
                  <span style={{ fontSize:ph?10:12, color:"#52B788", fontWeight:600 }}>{h.gain}</span>
                </div>
                <div style={{ height:3, borderRadius:999, background:"#EEF2F6", marginTop:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${h.pct}%`, background:h.color, borderRadius:999 }}/>
                </div>
              </div>
              <span style={{ fontSize:ph?10:11, color:"#9EB8AE", fontWeight:500, flexShrink:0 }}>{h.pct}%</span>
            </div>
          ))}
        </Card>
        <Card p={ph?12:16} r={ph?14:18}>
          <Label>Recent transactions</Label>
          {[{ name:"Apple Inc.",icon:"🍎",amt:"-$245.00",sub:"Bought 1.2 AAPL" },{ name:"Dividend",icon:"💰",amt:"+$18.40",sub:"MSFT quarterly" },{ name:"Withdrawal",icon:"🏦",amt:"-$500.00",sub:"To savings" }].map(t=>(
            <div key={t.name} style={{ display:"flex", alignItems:"center", gap:10, padding:`${ph?6:8}px 0`, borderBottom:"1px solid #F5F7FA" }}>
              <div style={{ width:ph?28:32, height:ph?28:32, borderRadius:10, background:"#EEF2F6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:ph?14:16 }}>{t.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:ph?11:13, fontWeight:500, color:"#0A2540" }}>{t.name}</p>
                <p style={{ fontSize:ph?9:10, color:"#9EB8AE" }}>{t.sub}</p>
              </div>
              <span style={{ fontSize:ph?11:13, fontWeight:600, color:t.amt.startsWith("+")?"#52B788":"#0A2540" }}>{t.amt}</span>
            </div>
          ))}
        </Card>
      </div>
    </PreviewShell>
  );
}

// ─── 5. Food Delivery ─────────────────────────────────────────────────────────
function FoodPreview({ device }: { device: DeviceMode }) {
  const ph = device==="phone";
  return (
    <PreviewShell bg="#FFF8F3">
      <div style={{ position:"relative", height:ph?140:180, flexShrink:0 }}>
        <img src={IMG.foodHero} alt="Food" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(193,68,14,0.05),rgba(20,10,0,0.7))" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, padding:ph?14:20 }}>
          <p style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.7)", letterSpacing:"0.08em", textTransform:"uppercase" as const }}>Order in 25 min</p>
          <p style={{ fontSize:ph?20:26, fontFamily:"Fraunces,serif", color:"#fff", fontWeight:600, lineHeight:1.2 }}>What are you craving?</p>
        </div>
        <div style={{ position:"absolute", top:12, right:12, background:"rgba(255,255,255,0.95)", borderRadius:999, padding:`${ph?4:5}px ${ph?10:14}px`, display:"flex", alignItems:"center", gap:5 }}>
          <Flame size={ph?10:12} color="#C1440E"/>
          <span style={{ fontSize:ph?10:12, color:"#C1440E", fontWeight:700 }}>🔥 Hot deals</span>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" as const, padding:ph?12:20, display:"flex", flexDirection:"column", gap:ph?12:16 }}>
        <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" as const }}>
          {["🍕 Pizza","🍔 Burger","🍜 Noodles","🌮 Tacos","🍣 Sushi"].map(c=>(
            <button key={c} style={{ flexShrink:0, padding:`${ph?5:6}px ${ph?12:16}px`, borderRadius:999, background:c.startsWith("🍕")?"#C1440E":"#F0E8E0", color:c.startsWith("🍕")?"#fff":"#5A3020", fontSize:ph?10:12, fontWeight:600 }}>{c}</button>
          ))}
        </div>
        {[{ name:"Rocco's Pizzeria", rating:"4.8", time:"22 min", img:IMG.foodHero, tag:"Popular" },{ name:"Street City Bowls", rating:"4.6", time:"35 min", img:IMG.foodCity, tag:"" }].map(r=>(
          <div key={r.name} style={{ borderRadius:ph?14:18, overflow:"hidden", background:"#fff", boxShadow:"0 2px 12px rgba(0,0,0,0.07)" }}>
            <div style={{ height:ph?100:130, overflow:"hidden", position:"relative" }}>
              <img src={r.img} alt={r.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              {r.tag && <span style={{ position:"absolute", top:8, left:8, background:"#C1440E", color:"#fff", fontSize:8, fontWeight:700, padding:"2px 8px", borderRadius:999 }}>{r.tag}</span>}
            </div>
            <div style={{ padding:ph?10:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <p style={{ fontSize:ph?12:14, fontWeight:600, color:"#2C1004" }}>{r.name}</p>
                <p style={{ fontSize:ph?9:11, color:"#C1440E", fontWeight:500, marginTop:2 }}>⏱ {r.time} · ⭐ {r.rating}</p>
              </div>
              <button style={{ background:"#C1440E", color:"#fff", border:"none", borderRadius:999, padding:`${ph?5:6}px ${ph?12:14}px`, fontSize:ph?10:12, fontWeight:600 }}>Order</button>
            </div>
          </div>
        ))}
        <Card p={ph?12:14} r={ph?12:16}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:ph?8:10 }}>
            <Label>Your order</Label>
            <span style={{ fontSize:ph?9:10, color:"#C1440E", fontWeight:600 }}>Tracking…</span>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {["Order placed","Preparing","On the way","Delivered"].map((step,i)=>(
              <div key={step} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:ph?18:22, height:ph?18:22, borderRadius:"50%", background:i<=2?"#C1440E":"#F0E8E0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {i<=2 && <Check size={ph?8:10} color="#fff"/>}
                </div>
                {i<3 && <div style={{ position:"absolute" }}/>}
                <span style={{ fontSize:7, color:i<=2?"#C1440E":"#C0A898", fontWeight:500, textAlign:"center" as const }}>{step}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PreviewShell>
  );
}

// ─── 6. Fitness ───────────────────────────────────────────────────────────────
function FitnessPreview({ device }: { device: DeviceMode }) {
  const ph = device==="phone";
  return (
    <PreviewShell bg="#F0FAF4">
      <div style={{ background:"#1B4332", padding:`${ph?12:16}px ${ph?16:22}px`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:ph?12:18 }}>
          <div>
            <p style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.5)", textTransform:"uppercase" as const, letterSpacing:"0.06em" }}>Today</p>
            <p style={{ fontSize:ph?16:20, fontFamily:"Fraunces,serif", color:"#fff", fontWeight:500 }}>Active Day</p>
          </div>
          <div style={{ width:ph?26:30, height:ph?26:30, borderRadius:"50%", overflow:"hidden", border:"2px solid rgba(255,255,255,0.3)" }}>
            <img src={IMG.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[{ icon:"🏃", label:"Steps", val:"9,241", goal:"10k" },{ icon:"🔥", label:"Calories", val:"487", goal:"600" },{ icon:"⏱", label:"Active", val:"54m", goal:"60m" }].map(s=>(
            <div key={s.label} style={{ background:"rgba(255,255,255,0.1)", borderRadius:ph?10:14, padding:ph?8:10, textAlign:"center" as const }}>
              <span style={{ fontSize:ph?14:18 }}>{s.icon}</span>
              <p style={{ fontSize:ph?14:18, color:"#fff", fontWeight:700, lineHeight:1.2, marginTop:2 }}>{s.val}</p>
              <p style={{ fontSize:ph?8:9, color:"rgba(255,255,255,0.5)" }}>{s.label} / {s.goal}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" as const, padding:ph?12:20, display:"flex", flexDirection:"column", gap:ph?12:16 }}>
        <div style={{ position:"relative", borderRadius:ph?14:18, overflow:"hidden", height:ph?100:130 }}>
          <img src={IMG.fitRun} alt="Run" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          <div style={{ position:"absolute", inset:0, background:"rgba(27,67,50,0.5)" }}/>
          <div style={{ position:"absolute", bottom:0, left:0, padding:ph?10:14, display:"flex", gap:ph?16:24 }}>
            {[{ l:"Distance",v:"5.2 km"},{ l:"Pace",v:"5:48/km"},{ l:"HR",v:"142 bpm"}].map(s=>(
              <div key={s.l}>
                <p style={{ fontSize:ph?8:9, color:"rgba(255,255,255,0.6)" }}>{s.l}</p>
                <p style={{ fontSize:ph?12:14, color:"#fff", fontWeight:700 }}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>
        <Card p={ph?12:16} r={ph?14:18}>
          <Label>Weekly steps</Label>
          <ResponsiveContainer width="100%" height={ph?70:95}>
            <BarChart data={STEPS_DATA} margin={{ top:2,right:0,left:-28,bottom:0 }} barSize={ph?14:20}>
              <XAxis dataKey="d" tick={{ fontSize:9, fill:"#9EB8AE" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ fontSize:10, borderRadius:8, border:"none", boxShadow:"0 4px 16px rgba(0,0,0,0.1)", fontFamily:"Outfit,sans-serif" }}/>
              <Bar dataKey="s" radius={[4,4,0,0]} fill="#1B4332"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card p={ph?12:16} r={ph?14:18}>
          <Label>Today's workouts</Label>
          {[{ name:"Morning Run",dur:"32 min",cal:"287 kcal",icon:"🏃"},{ name:"Yoga Flow",dur:"22 min",cal:"145 kcal",icon:"🧘"},{ name:"Core Strength",dur:"18 min",cal:"120 kcal",icon:"💪"}].map(w=>(
            <div key={w.name} style={{ display:"flex", alignItems:"center", gap:10, padding:`${ph?6:8}px 0`, borderBottom:"1px solid #EBF5EF" }}>
              <div style={{ width:ph?30:36, height:ph?30:36, borderRadius:10, background:"#EBF5EF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:ph?14:16 }}>{w.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:ph?11:13, fontWeight:600, color:"#1B4332" }}>{w.name}</p>
                <p style={{ fontSize:ph?9:10, color:"#6B8C7E" }}>{w.dur} · {w.cal}</p>
              </div>
              <Check size={ph?12:14} color="#52B788"/>
            </div>
          ))}
        </Card>
      </div>
    </PreviewShell>
  );
}

// ─── 7. Music ─────────────────────────────────────────────────────────────────
function MusicPreview({ device }: { device: DeviceMode }) {
  const ph = device==="phone";
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(42);
  return (
    <PreviewShell bg="#0D0D1A">
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" as const }}>
        {/* Now playing hero */}
        <div style={{ position:"relative", height:ph?260:320 }}>
          <img src={IMG.musicDark} alt="Album art" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(13,13,26,0.3),rgba(13,13,26,0.95))" }}/>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:ph?20:28 }}>
            <p style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase" as const }}>Now Playing</p>
            <p style={{ fontSize:ph?20:26, fontFamily:"Fraunces,serif", color:"#fff", fontWeight:500, lineHeight:1.2, marginTop:4 }}>Neon Gravity</p>
            <p style={{ fontSize:ph?11:13, color:"rgba(255,255,255,0.55)", marginTop:2 }}>Erwi · Synthwave Dreams</p>
          </div>
          <div style={{ position:"absolute", top:14, right:14 }}>
            <Heart size={ph?18:22} color="rgba(255,255,255,0.5)" fill="rgba(255,255,255,0.5)"/>
          </div>
        </div>
        <div style={{ padding:ph?16:24, display:"flex", flexDirection:"column", gap:ph?16:20 }}>
          {/* Progress */}
          <div>
            <div style={{ height:3, borderRadius:999, background:"rgba(255,255,255,0.1)", overflow:"hidden", cursor:"pointer" }} onClick={e=>{ const r=e.currentTarget.getBoundingClientRect(); setProgress(Math.round(((e.clientX-r.left)/r.width)*100)); }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#6D28D9,#A78BFA)", borderRadius:999, transition:"width 0.1s" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
              <span style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.4)" }}>1:54</span>
              <span style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.4)" }}>4:32</span>
            </div>
          </div>
          {/* Controls */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:ph?24:32 }}>
            {[{ label:"⏮", size:ph?20:24 },{ label:playing?"⏸":"▶", size:ph?36:44, accent:true },{ label:"⏭", size:ph?20:24 }].map(c=>(
              <button key={c.label} onClick={()=>c.label===playing?"⏸":"▶"?setPlaying(p=>!p):null}
                style={{ fontSize:c.size, lineHeight:1, background:c.accent?"linear-gradient(135deg,#6D28D9,#A78BFA)":undefined, width:c.accent?ph?52:62:undefined, height:c.accent?ph?52:62:undefined, borderRadius:c.accent?"50%":undefined, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {c.label}
              </button>
            ))}
          </div>
          {/* Playlist */}
          <div>
            <p style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.4)", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" as const, marginBottom:ph?10:14 }}>Up next</p>
            {[{ title:"Pulse Signal",artist:"Erwi",dur:"3:47",img:IMG.musicNeon },{ title:"Midnight Drive",artist:"Synthwave Dreams",dur:"5:12",img:IMG.musicDark },{ title:"Crystal Void",artist:"Neon Collective",dur:"4:08",img:IMG.musicNeon }].map((t,i)=>(
              <div key={t.title} style={{ display:"flex", alignItems:"center", gap:10, padding:`${ph?8:10}px 0`, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width:ph?36:42, height:ph?36:42, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                  <img src={t.img} alt={t.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:ph?11:13, fontWeight:500, color:i===0?"#A78BFA":"rgba(255,255,255,0.8)" }}>{t.title}</p>
                  <p style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.4)" }}>{t.artist}</p>
                </div>
                <span style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.3)" }}>{t.dur}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

// ─── 8. Travel ────────────────────────────────────────────────────────────────
function TravelPreview({ device }: { device: DeviceMode }) {
  const ph = device==="phone";
  return (
    <PreviewShell bg="#F0F9FF">
      <div style={{ position:"relative", height:ph?170:210, flexShrink:0 }}>
        <img src={IMG.travelMtn} alt="Mountain" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(22,78,99,0.15),rgba(22,78,99,0.75))" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, padding:ph?14:20 }}>
          <p style={{ fontSize:ph?9:10, color:"rgba(255,255,255,0.7)", textTransform:"uppercase" as const, letterSpacing:"0.08em" }}>Featured destination</p>
          <p style={{ fontSize:ph?20:26, fontFamily:"Fraunces,serif", color:"#fff", fontWeight:600, lineHeight:1.25, marginTop:2 }}>Swiss Alps,<br/>Switzerland</p>
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            {[{ l:"Flights from",v:"$620"},{ l:"Best time",v:"Jun–Sep"}].map(s=>(
              <div key={s.l} style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", borderRadius:8, padding:`${ph?4:5}px ${ph?8:10}px` }}>
                <p style={{ fontSize:ph?8:9, color:"rgba(255,255,255,0.7)" }}>{s.l}</p>
                <p style={{ fontSize:ph?11:13, color:"#fff", fontWeight:700 }}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" as const, padding:ph?12:20, display:"flex", flexDirection:"column", gap:ph?12:16 }}>
        <div style={{ display:"flex", gap:8 }}>
          {["Flights","Hotels","Tours","Car hire"].map((c,i)=>(
            <button key={c} style={{ flexShrink:0, padding:`${ph?5:6}px ${ph?10:14}px`, borderRadius:999, background:i===0?"#164E63":"#E0F2FE", color:i===0?"#fff":"#164E63", fontSize:ph?10:12, fontWeight:600 }}>{c}</button>
          ))}
        </div>
        <Card p={ph?12:16} r={ph?14:18}>
          <Label>Your itinerary · 5 nights</Label>
          {[{ day:"Day 1", plan:"Arrive Zurich · Hotel check-in · Old Town walk",icon:"✈️" },{ day:"Day 2", plan:"Jungfraujoch cable car · Snow hike",icon:"🏔" },{ day:"Day 3", plan:"Grindelwald village · Paragliding",icon:"🪂" },{ day:"Day 4", plan:"Lucerne day trip · Chapel Bridge",icon:"🌉" },{ day:"Day 5", plan:"Depart · Souvenir shopping",icon:"🛍️" }].map(d=>(
            <div key={d.day} style={{ display:"flex", gap:10, padding:`${ph?7:9}px 0`, borderBottom:"1px solid #E0F2FE" }}>
              <span style={{ fontSize:ph?14:16, flexShrink:0 }}>{d.icon}</span>
              <div>
                <p style={{ fontSize:ph?9:10, color:"#164E63", fontWeight:700 }}>{d.day}</p>
                <p style={{ fontSize:ph?10:12, color:"#4E8BA0", lineHeight:1.4 }}>{d.plan}</p>
              </div>
            </div>
          ))}
        </Card>
        <div style={{ borderRadius:ph?14:18, overflow:"hidden", height:ph?120:150 }}>
          <img src={IMG.travelBall} alt="Balloon" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
        </div>
      </div>
    </PreviewShell>
  );
}

// ─── 9. Real Estate ───────────────────────────────────────────────────────────
function RealEstatePreview({ device }: { device: DeviceMode }) {
  const ph = device==="phone";
  return (
    <PreviewShell bg="#FFFBF0">
      <div style={{ background:"#fff", padding:`${ph?10:14}px ${ph?14:20}px`, borderBottom:"1px solid #F5EFE0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"Fraunces,serif", fontSize:ph?16:20, fontWeight:600, color:"#78350F" }}>Hearth</span>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <Bell size={ph?14:16} color="#78350F"/>
          <div style={{ width:ph?26:30, height:ph?26:30, borderRadius:"50%", overflow:"hidden" }}>
            <img src={IMG.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" as const, padding:ph?12:20, display:"flex", flexDirection:"column", gap:ph?12:16 }}>
        <div style={{ background:"#F5EFE0", borderRadius:ph?12:16, padding:ph?10:14, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:ph?14:16 }}>🔍</span>
          <span style={{ fontSize:ph?11:13, color:"#B8935A" }}>Search London, Paris, NYC…</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["Buy","Rent","New builds"].map((f,i)=>(
            <button key={f} style={{ padding:`${ph?4:5}px ${ph?10:14}px`, borderRadius:999, background:i===0?"#78350F":"#F5EFE0", color:i===0?"#fff":"#78350F", fontSize:ph?10:12, fontWeight:600 }}>{f}</button>
          ))}
        </div>
        {[{ name:"Garden Terrace, Notting Hill", price:"£1,850,000", beds:4, baths:3, img:IMG.homeRoom, tag:"New" },{ name:"White Sofa Apartment, Chelsea", price:"£980,000", beds:2, baths:2, img:IMG.homeSofa, tag:"" }].map(l=>(
          <div key={l.name} style={{ borderRadius:ph?14:18, overflow:"hidden", background:"#fff", boxShadow:"0 2px 12px rgba(0,0,0,0.07)" }}>
            <div style={{ height:ph?120:160, overflow:"hidden", position:"relative" }}>
              <img src={l.img} alt={l.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              {l.tag && <span style={{ position:"absolute", top:8, left:8, background:"#78350F", color:"#fff", fontSize:8, fontWeight:700, padding:"2px 8px", borderRadius:999 }}>{l.tag}</span>}
              <button style={{ position:"absolute", top:8, right:8, background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:ph?24:28, height:ph?24:28, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Heart size={ph?10:12} color="#78350F"/>
              </button>
            </div>
            <div style={{ padding:ph?10:14 }}>
              <p style={{ fontSize:ph?12:14, fontWeight:700, color:"#78350F" }}>{l.price}</p>
              <p style={{ fontSize:ph?10:12, color:"#7C5A3A", marginTop:2, lineHeight:1.35 }}>{l.name}</p>
              <div style={{ display:"flex", gap:12, marginTop:6 }}>
                {[{ icon:"🛏", v:`${l.beds} bed`},{ icon:"🚿", v:`${l.baths} bath`}].map(f=>(
                  <span key={f.icon} style={{ fontSize:ph?9:11, color:"#B8935A" }}>{f.icon} {f.v}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

// ─── Preview dispatcher ───────────────────────────────────────────────────────
function MockPreview({ device, preset }: { device: DeviceMode; preset: PresetId }) {
  switch (preset) {
    case "shop":       return <ShopPreview device={device}/>;
    case "social":     return <SocialPreview device={device}/>;
    case "finance":    return <FinancePreview device={device}/>;
    case "food":       return <FoodPreview device={device}/>;
    case "fitness":    return <FitnessPreview device={device}/>;
    case "music":      return <MusicPreview device={device}/>;
    case "travel":     return <TravelPreview device={device}/>;
    case "realestate": return <RealEstatePreview device={device}/>;
    default:           return <WellnessPreview device={device}/>;
  }
}

// ─── Device frames ────────────────────────────────────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position:"relative", width:234, height:480, flexShrink:0 }}>
      <div style={{ position:"absolute", inset:0, borderRadius:"2.6rem", background:"linear-gradient(160deg,#282828 0%,#0E0E0E 60%,#1A1A1A 100%)", boxShadow:"0 0 0 1px rgba(255,255,255,0.06),0 0 0 2px rgba(0,0,0,0.95),0 32px 80px rgba(0,0,0,0.6)" }}/>
      <div style={{ position:"absolute", inset:0, borderRadius:"2.6rem", background:"linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 45%,rgba(255,255,255,0.02) 100%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:6, borderRadius:"2.2rem", overflow:"hidden", background:"#050505" }}>
        <div style={{ position:"absolute", top:9, left:"50%", transform:"translateX(-50%)", width:84, height:24, borderRadius:12, background:"#000", zIndex:10 }}/>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px 4px", background:"#F0F4EE" }}>
          <span style={{ fontSize:9, fontWeight:700, color:"#2D4A3E" }}>9:41</span>
          <div style={{ width:10 }}/>
          <div style={{ width:12, height:7, borderRadius:2, background:"#2D4A3E", opacity:0.7 }}/>
        </div>
        <div style={{ height:"calc(100% - 33px)" }}>{children}</div>
      </div>
      {/* Buttons */}
      <div style={{ position:"absolute", right:-1.5, top:"30%", width:3, height:48, borderRadius:"0 2px 2px 0", background:"linear-gradient(180deg,#383838,#1E1E1E)" }}/>
      <div style={{ position:"absolute", left:-1.5, top:"26%", width:3, height:26, borderRadius:"2px 0 0 2px", background:"linear-gradient(180deg,#383838,#1E1E1E)" }}/>
      <div style={{ position:"absolute", left:-1.5, top:"36%", width:3, height:26, borderRadius:"2px 0 0 2px", background:"linear-gradient(180deg,#383838,#1E1E1E)" }}/>
    </div>
  );
}

function TabletFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position:"relative", width:500, height:360, flexShrink:0 }}>
      <div style={{ position:"absolute", inset:0, borderRadius:"1.75rem", background:"linear-gradient(145deg,#F0E8D0,#D4C49A)", boxShadow:"0 0 0 1.5px rgba(180,140,60,0.22),0 24px 56px rgba(0,0,0,0.16),inset 0 1px 0 rgba(255,255,255,0.5)" }}/>
      <div style={{ position:"absolute", inset:8, borderRadius:"1.4rem", overflow:"hidden", background:"#0A0A0A" }}>{children}</div>
      <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", width:16, height:16, borderRadius:"50%", background:"linear-gradient(145deg,#D4C49A,#B8A070)" }}/>
    </div>
  );
}

function DesktopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", width:580 }}>
      <div style={{ position:"relative", width:"100%", borderRadius:"0.75rem 0.75rem 0 0", background:"linear-gradient(145deg,#EEE4C8,#D0BA8A)", padding:"8px 8px 0", boxShadow:"0 0 0 1.5px rgba(180,140,60,0.2),0 24px 64px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.5)" }}>
        <div style={{ display:"flex", justifyContent:"center", paddingBottom:6 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#1A1208" }}/>
        </div>
        <div style={{ borderRadius:"0.375rem 0.375rem 0 0", overflow:"hidden", aspectRatio:"16/9" }}>{children}</div>
      </div>
      <div style={{ width:"56%", height:10, background:"linear-gradient(180deg,#C4B07A,#A89060)" }}/>
      <div style={{ width:"70%", height:6, borderRadius:"0 0 0.5rem 0.5rem", background:"linear-gradient(180deg,#B8A070,#9A8055)", boxShadow:"0 2px 10px rgba(0,0,0,0.15)" }}/>
    </div>
  );
}

function DeviceFrame({ device, children }: { device:DeviceMode; children:React.ReactNode }) {
  if (device==="phone")  return <PhoneFrame>{children}</PhoneFrame>;
  if (device==="tablet") return <TabletFrame>{children}</TabletFrame>;
  return <DesktopFrame>{children}</DesktopFrame>;
}

// ─── Code panel ───────────────────────────────────────────────────────────────
function CodePanel() {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const file = MOCK_FILES[activeFile];

  function handleCopy() {
    navigator.clipboard.writeText(file.code).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 1800);
  }

  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      {/* File tree */}
      <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{ width:188, borderRight:"1px solid var(--border)", background:"var(--card)" }}>
        <div className="px-3 py-2.5 text-xs font-semibold" style={{ color:"var(--muted-foreground)", letterSpacing:"0.06em", borderBottom:"1px solid var(--border)" }}>FILES</div>
        {MOCK_FILES.map((f,i)=>(
          <button key={i} onClick={()=>setActiveFile(i)}
            className="flex items-center gap-2 px-3 py-2 text-left transition-colors"
            style={{ background:i===activeFile?"var(--muted)":"transparent", color:i===activeFile?"var(--foreground)":"var(--muted-foreground)", fontSize:11, fontFamily:"DM Mono,monospace", borderLeft: i===activeFile?"2px solid var(--accent)":"2px solid transparent" }}>
            <FileText size={11}/> {f.name.split("/").pop()}
          </button>
        ))}
      </div>

      {/* Code area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2" style={{ borderBottom:"1px solid var(--border)", background:"var(--card)" }}>
          <span style={{ fontSize:11, fontFamily:"DM Mono,monospace", color:"var(--muted-foreground)" }}>{file.name}</span>
          <div className="flex gap-1">
            {[
              { icon:copied?<Check size={11}/>:<Copy size={11}/>, label:copied?"Copied":"Copy", fn:handleCopy },
              { icon:<Download size={11}/>,  label:"Download", fn:()=>{} },
              { icon:<Archive size={11}/>,   label:"Export ZIP", fn:()=>{} },
            ].map(a=>(
              <button key={a.label} onClick={a.fn}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
                style={{ background:"var(--muted)", color:"var(--muted-foreground)" }}>
                {a.icon}{a.label}
              </button>
            ))}
          </div>
        </div>
        {/* Code */}
        <div className="flex-1 overflow-auto p-5" style={{ background:"var(--background)", scrollbarWidth:"none" }}>
          <pre style={{ margin:0, fontFamily:"DM Mono,monospace", fontSize:12, lineHeight:1.7, color:"var(--foreground)", whiteSpace:"pre-wrap" }}>
            {file.code}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Deployed panel ───────────────────────────────────────────────────────────
function DeployedPanel() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:"rgba(200,146,42,0.12)", border:"1px solid rgba(200,146,42,0.2)" }}>
        <Zap size={20} className="text-accent"/>
      </div>
      <div className="text-center">
        <h3 style={{ fontFamily:"Fraunces,serif", fontSize:18, fontWeight:500, color:"var(--foreground)", marginBottom:6 }}>Ready to deploy</h3>
        <p style={{ fontSize:12, color:"var(--muted-foreground)", maxWidth:280, lineHeight:1.6 }}>Your app will be live at a custom subdomain. Connect a domain or deploy to a store.</p>
      </div>
      <div className="flex gap-2 mt-2">
        {["Web App","App Store","Play Store"].map(d=>(
          <button key={d} className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{ background:"var(--primary)", color:"var(--primary-foreground)" }}>{d}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Overlay modal shell ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <div className="absolute inset-0" style={{ background:"rgba(30,18,6,0.5)", backdropFilter:"blur(4px)" }} onClick={onClose}/>
      <motion.div className="relative w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{ background:"var(--card)", border:"1px solid var(--border)", maxHeight:"80vh", boxShadow:"0 32px 80px rgba(0,0,0,0.25)" }}
        initial={{ y:24, scale:0.97 }} animate={{ y:0, scale:1 }} exit={{ y:24, scale:0.97 }}
        transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}>
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4" style={{ borderBottom:"1px solid var(--border)" }}>
          <span style={{ fontFamily:"Fraunces,serif", fontSize:16, fontWeight:500, color:"var(--foreground)" }}>{title}</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70" style={{ background:"var(--muted)", color:"var(--muted-foreground)" }}><X size={13}/></button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ─── Connector panel ──────────────────────────────────────────────────────────
function ConnectorPanel({ connectors, onToggle, onClose }:{ connectors:Connector[]; onToggle:(id:string)=>void; onClose:()=>void }) {
  return (
    <Modal title="Connectors" onClose={onClose}>
      <div className="p-4 flex flex-col gap-2">
        {connectors.map(c=>(
          <div key={c.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"var(--background)" }}>
            <div>
              <p style={{ fontSize:13, fontWeight:500, color:"var(--foreground)" }}>{c.name}</p>
              <p style={{ fontSize:11, color:"var(--muted-foreground)", marginTop:1 }}>{c.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize:9, fontWeight:600, letterSpacing:"0.05em", padding:"2px 8px", borderRadius:999, background:c.connected?"rgba(107,203,119,0.15)":"var(--muted)", color:c.connected?"#3A8A44":"var(--muted-foreground)" }}>
                {c.connected?"Connected":"Not Connected"}
              </span>
              <button onClick={()=>onToggle(c.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{ background:c.connected?"var(--muted)":"var(--accent)", color:c.connected?"var(--muted-foreground)":"var(--accent-foreground)" }}>
                {c.connected?"Disconnect":"Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── Skills panel ─────────────────────────────────────────────────────────────
function SkillsPanel({ skills, onToggle, onClose }:{ skills:ToggleItem[]; onToggle:(id:string)=>void; onClose:()=>void }) {
  return (
    <Modal title="Skills" onClose={onClose}>
      <div className="p-4 flex flex-col gap-2">
        {skills.map(s=>(
          <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"var(--background)" }}>
            <div>
              <p style={{ fontSize:13, fontWeight:500, color:"var(--foreground)" }}>{s.name}</p>
              <p style={{ fontSize:11, color:"var(--muted-foreground)", marginTop:1 }}>{s.desc}</p>
            </div>
            <button onClick={()=>onToggle(s.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background:s.on?"var(--accent)":"var(--muted)", color:s.on?"var(--accent-foreground)":"var(--muted-foreground)" }}>
              {s.on?"On":"Off"}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── Agents panel ─────────────────────────────────────────────────────────────
function AgentsPanel({ agents, onToggle, onClose }:{ agents:ToggleItem[]; onToggle:(id:string)=>void; onClose:()=>void }) {
  return (
    <Modal title="Agents" onClose={onClose}>
      <div className="p-4 flex flex-col gap-2">
        {agents.map(a=>(
          <div key={a.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"var(--background)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:"rgba(200,146,42,0.1)" }}>
                <Bot size={14} className="text-accent"/>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:500, color:"var(--foreground)" }}>{a.name}</p>
                <p style={{ fontSize:11, color:"var(--muted-foreground)", marginTop:1 }}>{a.desc}</p>
              </div>
            </div>
            <button onClick={()=>onToggle(a.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background:a.on?"var(--accent)":"var(--muted)", color:a.on?"var(--accent-foreground)":"var(--muted-foreground)" }}>
              {a.on?"Active":"Off"}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── Functions panel ──────────────────────────────────────────────────────────
function FunctionsPanel({ caps, onToggle, onClose }:{ caps:Capability[]; onToggle:(id:string)=>void; onClose:()=>void }) {
  const active = caps.filter(c=>c.active);
  const cats = Array.from(new Set(caps.map(c=>c.category)));

  return (
    <Modal title="Functions & Capabilities" onClose={onClose}>
      <div className="p-4 flex flex-col gap-4">
        {active.length>0 && (
          <div>
            <p style={{ fontSize:10, fontWeight:600, letterSpacing:"0.06em", color:"var(--accent)", textTransform:"uppercase", marginBottom:8 }}>Active · {active.length}</p>
            <div className="flex flex-wrap gap-1.5">
              {active.map(c=>(
                <div key={c.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background:"rgba(200,146,42,0.12)", border:"1px solid rgba(200,146,42,0.2)" }}>
                  <span style={{ fontSize:11, color:"var(--accent)", fontWeight:500 }}>{c.name}</span>
                  <button onClick={()=>onToggle(c.id)}><X size={9} className="text-accent"/></button>
                </div>
              ))}
            </div>
          </div>
        )}
        {cats.map(cat=>(
          <div key={cat}>
            <p style={{ fontSize:10, fontWeight:600, letterSpacing:"0.06em", color:"var(--muted-foreground)", textTransform:"uppercase", marginBottom:6 }}>{cat}</p>
            <div className="flex flex-col gap-1.5">
              {caps.filter(c=>c.category===cat).map(c=>(
                <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background:"var(--background)" }}>
                  <div>
                    <p style={{ fontSize:12, fontWeight:500, color:"var(--foreground)" }}>{c.name}</p>
                    <p style={{ fontSize:10, color:"var(--muted-foreground)" }}>{c.desc}</p>
                  </div>
                  <button onClick={()=>onToggle(c.id)} className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                    style={{ background:c.active?"var(--accent)":"var(--muted)", color:c.active?"var(--accent-foreground)":"var(--muted-foreground)" }}>
                    {c.active?"Added":"Add"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── View App modal ───────────────────────────────────────────────────────────
function ViewAppMenu({ onClose }:{ onClose:()=>void }) {
  const [tab, setTab] = useState<"web"|"apple"|"google">("web");
  const tabs:[typeof tab, React.ReactNode, string][] = [
    ["web",    <Globe size={12}/>,    "Web App"],
    ["apple",  <Play size={12}/>,     "App Store"],
    ["google", <Smartphone size={12}/>,"Play Store"],
  ];

  const field = (label:string, placeholder:string) => (
    <div key={label}>
      <label style={{ fontSize:10, fontWeight:600, color:"var(--muted-foreground)", letterSpacing:"0.05em", textTransform:"uppercase", display:"block", marginBottom:4 }}>{label}</label>
      <input placeholder={placeholder} className="w-full rounded-lg px-3 py-2 outline-none text-xs" style={{ background:"var(--background)", border:"1px solid var(--border)", color:"var(--foreground)", fontFamily:"Outfit,sans-serif" }}/>
    </div>
  );

  return (
    <Modal title="View App" onClose={onClose}>
      <div className="p-4">
        <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background:"var(--muted)" }}>
          {tabs.map(([key,icon,label])=>(
            <button key={key} onClick={()=>setTab(key)}
              className="flex items-center gap-1.5 flex-1 justify-center py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background:tab===key?"var(--card)":"transparent", color:tab===key?"var(--foreground)":"var(--muted-foreground)", boxShadow:tab===key?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
              {icon}{label}
            </button>
          ))}
        </div>

        {tab==="web" && <div className="flex flex-col gap-3">
          {field("App URL","https://myapp.lotus.app")}
          <div className="flex gap-2 mt-1">
            <button className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{ background:"var(--primary)", color:"var(--primary-foreground)" }}>Open Web App</button>
            <button className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{ background:"var(--muted)", color:"var(--muted-foreground)" }}>Copy Link</button>
          </div>
        </div>}

        {tab==="apple" && <div className="flex flex-col gap-3">
          {field("Apple Bundle ID","com.yourcompany.app")}
          {field("Apple Team ID","XXXXXXXXXX")}
          {field("App Store Category","Health & Fitness")}
          {field("Version","1.0.0")}
          {field("Build Number","1")}
          <div className="rounded-xl p-3 mt-1" style={{ background:"var(--background)", border:"1px solid var(--border)" }}>
            <p style={{ fontSize:11, fontWeight:600, color:"var(--foreground)", marginBottom:6 }}>App Store Prep Checklist</p>
            {["App icon (1024×1024)","Screenshots (all sizes)","Privacy policy URL","Support URL","App description"].map(item=>(
              <div key={item} className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background:"var(--muted)", border:"1px solid var(--border)" }}/>
                <span style={{ fontSize:11, color:"var(--muted-foreground)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>}

        {tab==="google" && <div className="flex flex-col gap-3">
          {field("Package Name","com.yourcompany.app")}
          {field("Version Name","1.0.0")}
          {field("Version Code","1")}
          {field("Play Store Category","Health & Fitness")}
          <div className="rounded-xl p-3 mt-1" style={{ background:"var(--background)", border:"1px solid var(--border)" }}>
            <p style={{ fontSize:11, fontWeight:600, color:"var(--foreground)", marginBottom:6 }}>Play Store Prep Checklist</p>
            {["Feature graphic (1024×500)","Screenshots (phone & tablet)","Content rating questionnaire","Privacy policy URL","Short description (80 chars)"].map(item=>(
              <div key={item} className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background:"var(--muted)", border:"1px solid var(--border)" }}/>
                <span style={{ fontSize:11, color:"var(--muted-foreground)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </Modal>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mb-3" style={{ background:"rgba(200,146,42,0.15)" }}>
        <Sparkles size={9} className="text-accent"/>
      </div>
      <div className="px-3 py-2.5 rounded-2xl rounded-bl-sm" style={{ background:"var(--card)" }}>
        <div className="flex gap-1 items-center h-3">
          {[0,1,2].map(i=>(
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--muted-foreground)" }}
              animate={{ opacity:[0.3,1,0.3], y:[0,-3,0] }}
              transition={{ duration:1, repeat:Infinity, delay:i*0.18, ease:"easeInOut" }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  // Core
  const [messages,  setMessages]  = useState<ChatMessage[]>(INIT_MESSAGES);
  const [input,     setInput]     = useState("");
  const [isTyping,  setIsTyping]  = useState(false);
  const [device,    setDevice]    = useState<DeviceMode>("phone");
  const [view,      setView]      = useState<BuildView>("preview");
  const [preset,    setPreset]    = useState<PresetId>("wellness");
  const [liveFlash, setLiveFlash] = useState(false);

  // Data
  const [selectedModel,  setSelectedModel]  = useState("Enigma Auto");
  const [uploadedFiles,  setUploadedFiles]  = useState<UploadedFile[]>([]);
  const [connectors,     setConnectors]     = useState<Connector[]>(INIT_CONNECTORS);
  const [skills,         setSkills]         = useState<ToggleItem[]>(INIT_SKILLS);
  const [agents,         setAgents]         = useState<ToggleItem[]>(INIT_AGENTS);
  const [capabilities,   setCapabilities]   = useState<Capability[]>(INIT_CAPS);

  // UI open/close
  const [showPlus,      setShowPlus]      = useState(false);
  const [showModel,     setShowModel]     = useState(false);
  const [showConnector, setShowConnector] = useState(false);
  const [showSkills,    setShowSkills]    = useState(false);
  const [showAgents,    setShowAgents]    = useState(false);
  const [showFunctions, setShowFunctions] = useState(false);
  const [showViewApp,   setShowViewApp]   = useState(false);

  // Build state
  const [autosaved,    setAutosaved]    = useState(true);
  const [dragKey,      setDragKey]      = useState(0); // reset phone position
  const [history,      setHistory]      = useState<string[]>(["Initial build"]);
  const [historyIdx,   setHistoryIdx]   = useState(0);

  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const fileInputRef    = useRef<HTMLInputElement>(null);
  const imageInputRef   = useRef<HTMLInputElement>(null);
  const canvasRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, isTyping]);

  // Instant live preview — detect preset from typed input
  useEffect(() => {
    if (!input.trim()) return;
    const timer = setTimeout(() => {
      const detected = detectPreset(input);
      if (detected && detected !== preset) {
        setPreset(detected);
        setLiveFlash(true);
        setTimeout(() => setLiveFlash(false), 800);
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [input, preset]);

  // Counts for context bar
  const activeConnectors  = connectors.filter(c=>c.connected).length;
  const activeSkills      = skills.filter(s=>s.on).length;
  const activeAgents      = agents.filter(a=>a.on).length;
  const activeCaps        = capabilities.filter(c=>c.active).length;

  function handleSend(text = input.trim()) {
    if (!text) return;
    const id = Date.now().toString();
    setMessages(p=>[...p,{ id, role:"user", content:text, ts:new Date() }]);
    setInput("");
    setIsTyping(true);
    setAutosaved(false);
    setTimeout(()=>{
      setIsTyping(false);
      setMessages(p=>[...p,{ id:(Date.now()+1).toString(), role:"assistant", content:"Got it — applying your changes to the preview.", ts:new Date() }]);
      setHistory(h=>[...h.slice(0,historyIdx+1), text]);
      const detected = detectPreset(text);
      if (detected) { setPreset(detected); setLiveFlash(true); setTimeout(()=>setLiveFlash(false), 800); }
      setHistoryIdx(i=>i+1);
      setTimeout(()=>setAutosaved(true), 800);
    }, 2000);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type:"file"|"image") {
    const files = Array.from(e.target.files||[]);
    const items: UploadedFile[] = files.map(f=>({ id:Math.random().toString(36).slice(2), name:f.name, type, mime:f.type }));
    setUploadedFiles(p=>[...p,...items]);
    e.target.value = "";
  }

  function removeFile(id: string) { setUploadedFiles(p=>p.filter(f=>f.id!==id)); }

  function toggleConnector(id:string) { setConnectors(p=>p.map(c=>c.id===id?{...c,connected:!c.connected}:c)); }
  function toggleSkill(id:string)     { setSkills(p=>p.map(s=>s.id===id?{...s,on:!s.on}:s)); }
  function toggleAgent(id:string)     { setAgents(p=>p.map(a=>a.id===id?{...a,on:!a.on}:a)); }
  function toggleCap(id:string)       { setCapabilities(p=>p.map(c=>c.id===id?{...c,active:!c.active}:c)); }

  const quickActions = [
    { label:"Generate Plan",       text:"Generate a full product plan for this app." },
    { label:"Fix Bugs",            text:"Review the current code and fix any bugs." },
    { label:"Improve UI",          text:"Improve the visual design and polish the UI." },
    { label:"Prepare Store Build", text:"Prepare everything needed for an App Store submission." },
  ];

  const toolbarBtns: { icon:React.ReactNode; label:string; onClick:()=>void; active?:boolean }[] = [
    { icon:<Plus size={12}/>,      label:"Plus",      onClick:()=>{ setShowPlus(p=>!p); setShowModel(false); } },
    { icon:<Upload size={12}/>,    label:"File",      onClick:()=>fileInputRef.current?.click() },
    { icon:<ImageIcon size={12}/>, label:"Image",     onClick:()=>imageInputRef.current?.click() },
    { icon:<Plug size={12}/>,      label:"Connect",   onClick:()=>setShowConnector(true), active:activeConnectors>0 },
    { icon:<Sparkles size={12}/>,  label:"Skills",    onClick:()=>setShowSkills(true),    active:activeSkills>0 },
    { icon:<Bot size={12}/>,       label:"Agents",    onClick:()=>setShowAgents(true),    active:activeAgents>0 },
    { icon:<Cpu size={12}/>,       label:"Functions", onClick:()=>setShowFunctions(true), active:activeCaps>0 },
  ];

  return (
    <div className="size-full flex flex-col overflow-hidden" style={{ fontFamily:"Outfit,sans-serif", background:"var(--background)" }}>

      {/* ── Top bar ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-5" style={{ height:60, borderBottom:"1px solid var(--border)", background:"var(--card)" }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src={logoLotus} alt="Lotus" style={{ width:50, height:50, objectFit:"contain" }}/>
          <span style={{ fontFamily:"Fraunces,serif", fontWeight:500, fontSize:21, color:"var(--foreground)", letterSpacing:"-0.02em" }}>Lotus</span>
        </div>

        {/* Device switcher */}
        <div className="flex items-center gap-1 px-1.5 py-1.5 rounded-xl" style={{ background:"var(--muted)", border:"1px solid var(--border)" }}>
          {(["phone","tablet","desktop"] as DeviceMode[]).map(d=>{
            const icons = { phone:<Smartphone size={12}/>, tablet:<Tablet size={12}/>, desktop:<Monitor size={12}/> };
            const labels = { phone:"Mobile", tablet:"Tablet", desktop:"Desktop" };
            const active = device===d;
            return (
              <motion.button key={d} onClick={()=>setDevice(d)} whileTap={{ scale:0.96 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background:active?"var(--card)":"transparent", color:active?"var(--foreground)":"var(--muted-foreground)", boxShadow:active?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
                {icons[d]}<span className="hidden sm:inline">{labels[d]}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5">
            <button onClick={()=>setHistoryIdx(i=>Math.max(0,i-1))} disabled={historyIdx===0}
              className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ color:historyIdx===0?"var(--muted-foreground)":"var(--foreground)", opacity:historyIdx===0?0.4:1 }}>
              <Undo2 size={13}/>
            </button>
            <button onClick={()=>setHistoryIdx(i=>Math.min(history.length-1,i+1))} disabled={historyIdx===history.length-1}
              className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ color:historyIdx===history.length-1?"var(--muted-foreground)":"var(--foreground)", opacity:historyIdx===history.length-1?0.4:1 }}>
              <Redo2 size={13}/>
            </button>
          </div>
          <div className="h-4 w-px mx-1" style={{ background:"var(--border)" }}/>
          <button onClick={()=>setShowViewApp(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{ background:"var(--secondary)", color:"var(--secondary-foreground)", border:"1px solid var(--border)" }}>
            <Eye size={11}/> View App
          </button>
          <motion.button whileTap={{ scale:0.97 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold"
            style={{ background:"linear-gradient(135deg,#D4A030,#B87820)", color:"#FFF8E8", boxShadow:"0 2px 12px rgba(200,146,42,0.35)" }}>
            <Zap size={11}/> Deploy
          </motion.button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ── Chat panel ── */}
        <aside className="flex flex-col flex-shrink-0 overflow-hidden" style={{ width:256, borderRight:"1px solid var(--border)", background:"var(--card)" }}>

          {/* Tab: Chat only */}
          <div className="flex-shrink-0 flex items-center px-3 pt-3 pb-0" style={{ borderBottom:"1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5 px-3 py-2 relative" style={{ color:"var(--foreground)" }}>
              <Sparkles size={11}/><span style={{ fontSize:12, fontWeight:500 }}>Chat</span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background:"var(--accent)" }}/>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col" style={{ scrollbarWidth:"none" }}>
            <AnimatePresence initial={false}>
              {messages.map(msg=>(
                <motion.div key={msg.id}
                  initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.2 }}
                  className={`flex mb-2.5 ${msg.role==="user"?"justify-end":"items-end gap-1.5"}`}>
                  {msg.role==="assistant" && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mb-4" style={{ background:"rgba(200,146,42,0.15)" }}>
                      <Sparkles size={8} className="text-accent"/>
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 max-w-[88%]">
                    <div className="px-3 py-2 leading-relaxed" style={{
                      fontSize:11.5,
                      borderRadius:msg.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",
                      background:msg.role==="user"?"var(--primary)":"var(--background)",
                      color:msg.role==="user"?"var(--primary-foreground)":"var(--foreground)",
                      boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
                    }}>{msg.content}</div>
                    <span className={`px-1 ${msg.role==="user"?"text-right":""}`} style={{ fontSize:9, color:"var(--muted-foreground)" }}>{fmt(msg.ts)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && <TypingIndicator/>}
            <div ref={messagesEndRef}/>
          </div>

          {/* Quick actions */}
          <div className="flex-shrink-0 px-3 pb-2 flex flex-wrap gap-1" style={{ borderTop:"1px solid var(--border)", paddingTop:8 }}>
            {quickActions.map(a=>(
              <button key={a.label} onClick={()=>handleSend(a.text)}
                className="px-2 py-1 rounded-lg text-left transition-all hover:opacity-80"
                style={{ background:"var(--muted)", color:"var(--muted-foreground)", fontSize:10, fontWeight:500 }}>
                {a.label}
              </button>
            ))}
          </div>

          {/* Attachment chips */}
          {uploadedFiles.length>0 && (
            <div className="flex-shrink-0 flex flex-wrap gap-1.5 px-3 pb-2">
              {uploadedFiles.map(f=>(
                <div key={f.id} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background:"rgba(200,146,42,0.1)", border:"1px solid rgba(200,146,42,0.2)" }}>
                  <span className="text-accent">{fileIcon(f.mime)}</span>
                  <span style={{ fontSize:10, color:"var(--accent)", fontWeight:500, maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</span>
                  <button onClick={()=>removeFile(f.id)}><X size={9} className="text-accent"/></button>
                </div>
              ))}
            </div>
          )}

          {/* Composer */}
          <div className="flex-shrink-0 px-3 pb-3">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 mb-1.5 relative">
              {/* Plus with popover */}
              <div className="relative">
                <button onClick={()=>{ setShowPlus(p=>!p); setShowModel(false); }}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:opacity-80"
                  style={{ background:showPlus?"var(--accent)":"var(--muted)", color:showPlus?"var(--accent-foreground)":"var(--muted-foreground)" }}>
                  <Plus size={12}/>
                </button>
                <AnimatePresence>
                  {showPlus && (
                    <motion.div className="absolute bottom-9 left-0 z-40 rounded-2xl overflow-hidden py-1.5"
                      style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"0 16px 48px rgba(0,0,0,0.18)", width:188, minWidth:"max-content" }}
                      initial={{ opacity:0, y:6, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4, scale:0.97 }}
                      transition={{ duration:0.18 }}>
                      {PLUS_ITEMS.map(item=>(
                        <button key={item.label} onClick={()=>setShowPlus(false)}
                          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left transition-colors hover:opacity-80"
                          style={{ fontSize:12, color:"var(--foreground)", fontWeight:400 }}>
                          <span style={{ color:"var(--accent)" }}>{item.icon}</span>{item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other tool buttons */}
              {toolbarBtns.slice(1).map(btn=>(
                <button key={btn.label} onClick={btn.onClick}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:opacity-80 relative"
                  style={{ background:btn.active?"rgba(200,146,42,0.12)":"var(--muted)", color:btn.active?"var(--accent)":"var(--muted-foreground)" }}>
                  {btn.icon}
                  {btn.active && <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full" style={{ background:"var(--accent)" }}/>}
                </button>
              ))}

              {/* Spacer */}
              <div className="flex-1"/>

              {/* Model selector */}
              <div className="relative">
                <button onClick={()=>{ setShowModel(p=>!p); setShowPlus(false); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all hover:opacity-80"
                  style={{ background:"var(--muted)", color:"var(--muted-foreground)", fontSize:9, fontWeight:600, maxWidth:78, overflow:"hidden" }}>
                  <Brain size={9}/>
                  <span className="truncate">{selectedModel}</span>
                  <ChevronDown size={8}/>
                </button>
                <AnimatePresence>
                  {showModel && (
                    <motion.div className="absolute bottom-9 right-0 z-40 rounded-xl overflow-hidden py-1"
                      style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"0 16px 48px rgba(0,0,0,0.18)", minWidth:148 }}
                      initial={{ opacity:0, y:4, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4, scale:0.97 }}
                      transition={{ duration:0.15 }}>
                      {MODELS.map(m=>(
                        <button key={m} onClick={()=>{ setSelectedModel(m); setShowModel(false); }}
                          className="flex items-center justify-between w-full px-3.5 py-2 transition-colors hover:opacity-80"
                          style={{ fontSize:11, color:"var(--foreground)", background:m===selectedModel?"var(--muted)":"transparent" }}>
                          {m}{m===selectedModel && <Check size={10} className="text-accent"/>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Input */}
            <div className="flex items-end gap-2 rounded-2xl px-3 py-2.5" style={{ background:"var(--background)", border:"1.5px solid var(--border)", boxShadow:"0 2px 16px rgba(0,0,0,0.06)" }}>
              <textarea value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); handleSend(); } }}
                placeholder="Describe a change, feature, screen, or function…"
                rows={2}
                className="flex-1 resize-none bg-transparent outline-none leading-relaxed"
                style={{ fontSize:11.5, color:"var(--foreground)", fontFamily:"Outfit,sans-serif", scrollbarWidth:"none" }}/>
              <motion.button whileTap={{ scale:0.88 }} onClick={()=>handleSend()}
                className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all"
                style={{ background:input.trim()?"linear-gradient(135deg,#D4A030,#B87820)":"var(--muted)", color:input.trim()?"#FFF8E8":"var(--muted-foreground)", boxShadow:input.trim()?"0 2px 8px rgba(200,146,42,0.3)":"none" }}>
                <Send size={11}/>
              </motion.button>
            </div>

            {/* Keyboard hint */}
            <p style={{ fontSize:9, color:"var(--muted-foreground)", textAlign:"center", marginTop:4 }}>⏎ Send · ⇧⏎ New line</p>
          </div>

          {/* Hidden file inputs */}
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.csv,.json,.zip,.js,.ts,.tsx,.css,.html" multiple onChange={e=>handleFileUpload(e,"file")}/>
          <input ref={imageInputRef} type="file" className="hidden" accept=".png,.jpg,.jpeg,.webp,.svg" multiple onChange={e=>handleFileUpload(e,"image")}/>
        </aside>

        {/* ── Preview / Code / Deployed ── */}
        <main className="flex-1 flex flex-col overflow-hidden" style={{ background:"var(--background)" }}>

          {/* Preview toolbar */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-2" style={{ borderBottom:"1px solid var(--border)", background:"var(--card)" }}>
            {/* View tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background:"var(--muted)" }}>
              {([["preview","Preview",<Eye size={11}/>],["code","Code",<Code2 size={11}/>],["deployed","Deployed",<Zap size={11}/>]] as const).map(([k,l,icon])=>(
                <button key={k} onClick={()=>setView(k as BuildView)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background:view===k?"var(--card)":"transparent", color:view===k?"var(--foreground)":"var(--muted-foreground)", boxShadow:view===k?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>
                  {icon}{l}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {view==="preview" && <>
                <button onClick={()=>setDragKey(k=>k+1)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                  style={{ background:"var(--muted)", color:"var(--muted-foreground)" }}>
                  <RotateCcw size={10}/> Reset
                </button>
                <button className="p-1.5 rounded-lg transition-colors hover:opacity-70" style={{ color:"var(--muted-foreground)" }}><RefreshCw size={12}/></button>
              </>}
              <button className="p-1.5 rounded-lg transition-colors hover:opacity-70" style={{ color:"var(--muted-foreground)" }}><MoreHorizontal size={12}/></button>
            </div>
          </div>

          {/* Preset picker — scrollable pill row */}
          {view==="preview" && (
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 overflow-x-auto" style={{ borderBottom:"1px solid var(--border)", scrollbarWidth:"none" }}>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Live flash indicator */}
                <AnimatePresence>
                  {liveFlash && (
                    <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background:"rgba(200,146,42,0.15)", border:"1px solid rgba(200,146,42,0.3)" }}>
                      <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--accent)" }} animate={{ scale:[1,1.4,1] }} transition={{ duration:0.4, repeat:2 }}/>
                      <span style={{ fontSize:9, color:"var(--accent)", fontWeight:700, letterSpacing:"0.05em" }}>LIVE</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {PRESETS.map(p=>(
                <motion.button key={p.id} whileTap={{ scale:0.95 }}
                  onClick={()=>{ setPreset(p.id); setLiveFlash(true); setTimeout(()=>setLiveFlash(false),800); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0 transition-all text-xs font-semibold"
                  style={{ background:preset===p.id?p.accent:"var(--muted)", color:preset===p.id?"#fff":"var(--muted-foreground)", boxShadow:preset===p.id?`0 2px 10px ${p.accent}44`:"none" }}>
                  <span style={{ fontSize:12 }}>{p.emoji}</span>{p.label}
                </motion.button>
              ))}
            </div>
          )}

          {/* View content */}
          {view==="preview" && (
            <div ref={canvasRef} className="flex-1 overflow-hidden relative" style={{
              backgroundImage:`radial-gradient(circle, rgba(44,34,20,0.07) 1px, transparent 1px)`,
              backgroundSize:"22px 22px",
            }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at center, transparent 55%, rgba(245,237,216,0.65) 100%)" }}/>
              <AnimatePresence mode="wait">
                <motion.div key={`${device}-${preset}-${dragKey}`}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.2 }}>
                  <motion.div drag dragMomentum={false} dragElastic={0} dragConstraints={canvasRef}
                    className="cursor-grab active:cursor-grabbing relative"
                    initial={{ scale:0.95, y:12 }} animate={{ scale:1, y:0 }}
                    transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}>
                    {/* Grab affordance */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full pointer-events-none" style={{ background:"rgba(44,34,20,0.08)" }}>
                      <GripVertical size={10} style={{ color:"var(--muted-foreground)" }}/>
                      <span style={{ fontSize:9, color:"var(--muted-foreground)", fontWeight:500 }}>Drag</span>
                    </div>
                    <DeviceFrame device={device}>
                      <MockPreview device={device} preset={preset}/>
                    </DeviceFrame>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {view==="code" && <CodePanel/>}
          {view==="deployed" && <DeployedPanel/>}

          {/* Active build context bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-1.5" style={{ borderTop:"1px solid var(--border)", background:"var(--card)" }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:9, color:"var(--accent)", fontWeight:600 }}>{selectedModel}</span>
              {[
                { count:activeConnectors, label:"Connector" },
                { count:activeSkills,     label:"Skill" },
                { count:activeAgents,     label:"Agent" },
                { count:activeCaps,       label:"Capability" },
                { count:uploadedFiles.length, label:"File" },
              ].map(item=>(
                item.count>0 && <span key={item.label} style={{ fontSize:9, color:"var(--muted-foreground)", fontFamily:"DM Mono,monospace" }}>
                  · {item.count} {item.label}{item.count!==1?"s":""}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {autosaved
                ? <><div className="w-1.5 h-1.5 rounded-full" style={{ background:"#6BCB77" }}/><span style={{ fontSize:9, color:"var(--muted-foreground)" }}>Saved</span></>
                : <><motion.div className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--accent)" }} animate={{ opacity:[1,0.3,1] }} transition={{ duration:1, repeat:Infinity }}/><span style={{ fontSize:9, color:"var(--muted-foreground)" }}>Saving…</span></>
              }
              <span style={{ fontSize:9, color:"var(--muted-foreground)", marginLeft:6, fontFamily:"DM Mono,monospace" }}>
                {DEVICE_CONFIGS_STATUS[device]}
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showConnector && <ConnectorPanel connectors={connectors} onToggle={toggleConnector} onClose={()=>setShowConnector(false)}/>}
        {showSkills    && <SkillsPanel    skills={skills}         onToggle={toggleSkill}     onClose={()=>setShowSkills(false)}/>}
        {showAgents    && <AgentsPanel    agents={agents}          onToggle={toggleAgent}     onClose={()=>setShowAgents(false)}/>}
        {showFunctions && <FunctionsPanel caps={capabilities}     onToggle={toggleCap}       onClose={()=>setShowFunctions(false)}/>}
        {showViewApp   && <ViewAppMenu    onClose={()=>setShowViewApp(false)}/>}
      </AnimatePresence>

      {/* Click-away to close popovers */}
      {(showPlus||showModel) && <div className="fixed inset-0 z-30" onClick={()=>{ setShowPlus(false); setShowModel(false); }}/>}
    </div>
  );
}

// Status line dimensions per device
const DEVICE_CONFIGS_STATUS: Record<DeviceMode,string> = {
  phone:   "375 × 720",
  tablet:  "768 × 600",
  desktop: "1100 × 620",
};
