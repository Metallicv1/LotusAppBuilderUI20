import { Check, GripVertical, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import {
  DEVICE_PREVIEW_META,
  STYLE_PACK_COUNT,
  type BuildStatus,
  type DeviceMode,
  type GeneratedAppSpec,
  type StylePack,
} from "../lib/generator";

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ position:"relative", width:"clamp(180px, min(24vw, calc((100vh - 230px) * 0.49)), 234px)", aspectRatio:"234 / 480", flexShrink:0 }}>
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
      <div style={{ position:"absolute", right:-1.5, top:"30%", width:3, height:48, borderRadius:"0 2px 2px 0", background:"linear-gradient(180deg,#383838,#1E1E1E)" }}/>
      <div style={{ position:"absolute", left:-1.5, top:"26%", width:3, height:26, borderRadius:"2px 0 0 2px", background:"linear-gradient(180deg,#383838,#1E1E1E)" }}/>
      <div style={{ position:"absolute", left:-1.5, top:"36%", width:3, height:26, borderRadius:"2px 0 0 2px", background:"linear-gradient(180deg,#383838,#1E1E1E)" }}/>
    </div>
  );
}

function TabletFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ position:"relative", width:"clamp(340px, min(46vw, calc((100vh - 230px) * 1.39)), 500px)", aspectRatio:"500 / 360", flexShrink:0 }}>
      <div style={{ position:"absolute", inset:0, borderRadius:"1.75rem", background:"linear-gradient(145deg,#F0E8D0,#D4C49A)", boxShadow:"0 0 0 1.5px rgba(180,140,60,0.22),0 24px 56px rgba(0,0,0,0.16),inset 0 1px 0 rgba(255,255,255,0.5)" }}/>
      <div style={{ position:"absolute", inset:8, borderRadius:"1.4rem", overflow:"hidden", background:"#0A0A0A" }}>{children}</div>
      <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", width:16, height:16, borderRadius:"50%", background:"linear-gradient(145deg,#D4C49A,#B8A070)" }}/>
    </div>
  );
}

function DesktopFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", width:"clamp(430px, min(56vw, calc((100vh - 260px) * 1.61)), 580px)" }}>
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

function DeviceFrame({ device, children }: { device:DeviceMode; children:ReactNode }) {
  if (device==="phone") return <PhoneFrame>{children}</PhoneFrame>;
  if (device==="tablet") return <TabletFrame>{children}</TabletFrame>;
  return <DesktopFrame>{children}</DesktopFrame>;
}

function GeneratedAppPreview({ device, spec, stylePack }: { device:DeviceMode; spec:GeneratedAppSpec; stylePack:StylePack }) {
  const p = stylePack.palette;
  const isPhone = device === "phone";
  const compact = device !== "desktop";
  const cardRadius = stylePack.radius;
  const assetTiles = [
    { label:"Hero", value:stylePack.texture },
    { label:"Forms", value:stylePack.density },
    { label:"Nav", value:stylePack.layout },
  ];

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background:p.bg, color:p.text, fontFamily:"Outfit,sans-serif" }}>
      <div className="flex-shrink-0 flex items-center justify-between" style={{ padding:isPhone?"12px 14px 8px":"18px 22px 10px", borderBottom:`1px solid ${p.border}`, background:p.surface }}>
        <div className="min-w-0">
          <p className="truncate" style={{ fontSize:isPhone?10:12, color:p.muted, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" }}>{spec.appType}</p>
          <h1 className="truncate" style={{ fontSize:isPhone?18:24, lineHeight:1.05, color:p.text, fontWeight:750, margin:0 }}>{spec.title}</h1>
        </div>
        <div className="flex items-center justify-center flex-shrink-0" style={{ width:isPhone?34:42, height:isPhone?34:42, borderRadius:cardRadius, background:p.accent, color:p.bg, boxShadow:`0 12px 28px ${p.accent}40` }}>
          <Sparkles size={isPhone?15:18}/>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ padding:isPhone?14:22, scrollbarWidth:"none" }}>
        <section style={{ borderRadius:cardRadius+8, background:`linear-gradient(135deg, ${p.accent}, ${p.accent2})`, color:p.bg, padding:isPhone?16:22, boxShadow:`0 18px 42px ${p.accent}35` }}>
          <p style={{ fontSize:isPhone?10:12, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", opacity:0.75, marginBottom:8 }}>Generated preview</p>
          <h2 style={{ fontSize:isPhone?22:32, lineHeight:1.02, fontWeight:800, marginBottom:10, maxWidth:compact?260:520 }}>{spec.hero}</h2>
          <div className="flex flex-wrap gap-2">
            {spec.actions.slice(0, compact?4:6).map((action, i)=>(
              <button key={action} style={{ border:0, borderRadius:999, padding:isPhone?"7px 10px":"9px 13px", background:i===0?p.bg:"rgba(255,255,255,0.22)", color:i===0?p.text:p.bg, fontSize:isPhone?10:12, fontWeight:750 }}>
                {action}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-2" style={{ gridTemplateColumns:compact?"repeat(3, minmax(0,1fr))":"repeat(3, minmax(0,140px))", marginTop:isPhone?12:16 }}>
          {spec.metrics.map(metric=>(
            <div key={metric.label} style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:cardRadius, padding:isPhone?10:14 }}>
              <p style={{ fontSize:isPhone?9:11, color:p.muted, fontWeight:700 }}>{metric.label}</p>
              <p style={{ fontSize:isPhone?15:20, color:p.text, fontWeight:800 }}>{metric.value}</p>
            </div>
          ))}
        </section>

        <section style={{ marginTop:isPhone?12:16, display:"grid", gridTemplateColumns:compact?"1fr":"1.05fr 0.95fr", gap:isPhone?10:14 }}>
          <div style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:cardRadius+4, padding:isPhone?12:16 }}>
            <p style={{ fontSize:isPhone?10:12, color:p.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Screens</p>
            <div className="space-y-2">
              {spec.screens.map((screen, i)=>(
                <div key={screen} className="flex items-center justify-between" style={{ padding:isPhone?"8px 9px":"10px 11px", borderRadius:cardRadius, background:i===0?`${p.accent}18`:"transparent", border:`1px solid ${i===0?p.accent:p.border}` }}>
                  <span style={{ fontSize:isPhone?11:13, color:p.text, fontWeight:700 }}>{screen}</span>
                  <span style={{ fontSize:10, color:i===0?p.accent:p.muted, fontFamily:"DM Mono,monospace" }}>0{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:p.surface, border:`1px solid ${p.border}`, borderRadius:cardRadius+4, padding:isPhone?12:16 }}>
            <p style={{ fontSize:isPhone?10:12, color:p.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Modules</p>
            <div className="space-y-2">
              {spec.modules.map(module=>(
                <div key={module.name} className="flex items-center justify-between" style={{ borderRadius:cardRadius, background:`linear-gradient(135deg, ${p.bg}, ${p.surface})`, border:`1px solid ${p.border}`, padding:isPhone?"9px 10px":"11px 12px" }}>
                  <p className="truncate" style={{ fontSize:isPhone?11:13, color:p.text, fontWeight:750 }}>{module.name}</p>
                  <span style={{ fontSize:isPhone?8:10, color:p.accent, fontWeight:800 }}>{module.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginTop:isPhone?12:16, background:p.surface, border:`1px solid ${p.border}`, borderRadius:cardRadius+4, padding:isPhone?12:16 }}>
          <p style={{ fontSize:isPhone?10:12, color:p.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Asset pack</p>
          <div className="grid gap-2" style={{ gridTemplateColumns:compact?"1fr":"repeat(3, minmax(0,1fr))" }}>
            {assetTiles.map(tile=>(
              <div key={tile.label} style={{ borderRadius:cardRadius, background:`linear-gradient(135deg, ${p.bg}, ${p.surface})`, border:`1px solid ${p.border}`, padding:isPhone?"9px 10px":"11px 12px" }}>
                <p style={{ fontSize:isPhone?9:10, color:p.muted, fontWeight:700 }}>{tile.label}</p>
                <p className="truncate" style={{ fontSize:isPhone?11:13, color:p.text, fontWeight:750 }}>{tile.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap gap-2" style={{ marginTop:isPhone?12:16 }}>
          {spec.entities.map(entity=>(
            <span key={entity} style={{ borderRadius:999, border:`1px solid ${p.border}`, background:p.surface, color:p.muted, padding:isPhone?"6px 9px":"8px 11px", fontSize:isPhone?10:12, fontWeight:700 }}>
              {entity}
            </span>
          ))}
        </section>
      </div>

      <div className="flex-shrink-0 flex items-center gap-1 overflow-x-auto" style={{ background:p.surface, borderTop:`1px solid ${p.border}`, padding:isPhone?"8px 8px":"10px 12px", scrollbarWidth:"none" }}>
        {spec.screens.map((screen, i)=>(
          <button key={screen} style={{ border:0, flex:"0 0 auto", borderRadius:999, padding:isPhone?"5px 8px":"7px 10px", background:i===0?`${p.accent}22`:"transparent", color:i===0?p.accent:p.muted, fontSize:isPhone?10:12, fontWeight:750 }}>
            {screen}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PreviewBrief({
  spec,
  stylePack,
  device,
  selectedModel,
  buildStatus,
  lastPrompt,
}: {
  spec: GeneratedAppSpec;
  stylePack: StylePack;
  device: DeviceMode;
  selectedModel: string;
  buildStatus: BuildStatus;
  lastPrompt: string;
}) {
  const deviceMeta = DEVICE_PREVIEW_META[device];

  return (
    <div className="hidden xl:flex absolute left-4 top-4 bottom-4 z-10 w-[236px] flex-col rounded-2xl overflow-hidden"
      style={{ background:"rgba(238,229,204,0.88)", border:"1px solid rgba(44,34,20,0.12)", boxShadow:"0 18px 54px rgba(44,34,20,0.12)", backdropFilter:"blur(18px)" }}>
      <div className="p-4" style={{ borderBottom:"1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ width:18, height:18, borderRadius:6, background:stylePack.palette.accent, display:"inline-flex", flexShrink:0 }}/>
            <div className="min-w-0">
              <p className="truncate" style={{ fontSize:12, fontWeight:700, color:"var(--foreground)" }}>{spec.title}</p>
              <p style={{ fontSize:9, color:"var(--muted-foreground)", fontFamily:"DM Mono,monospace" }}>Pack {stylePack.id + 1}/{STYLE_PACK_COUNT}</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded-full" style={{ background:"rgba(200,146,42,0.14)", color:"var(--accent)", fontSize:9, fontWeight:800, letterSpacing:"0.05em" }}>
            {buildStatus}
          </span>
        </div>
        <p style={{ fontSize:11, lineHeight:1.55, color:"var(--muted-foreground)" }}>{spec.hero}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth:"none" }}>
        <div>
          <p style={{ fontSize:9, color:"var(--muted-foreground)", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>Generated screens</p>
          <div className="space-y-1.5">
            {spec.screens.map((screen, index)=>(
              <div key={screen} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background:"rgba(255,255,255,0.42)", border:"1px solid rgba(44,34,20,0.08)" }}>
                <span style={{ fontSize:11, fontWeight:650, color:"var(--foreground)" }}>{screen}</span>
                <span style={{ fontSize:9, color:"var(--muted-foreground)", fontFamily:"DM Mono,monospace" }}>0{index+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize:9, color:"var(--muted-foreground)", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>Preview stack</p>
          <div className="flex flex-wrap gap-1.5">
            {[selectedModel, stylePack.archetype, stylePack.layout, stylePack.texture, stylePack.density].map(item=>(
              <span key={item} className="px-2 py-1 rounded-lg" style={{ background:"var(--muted)", color:"var(--muted-foreground)", fontSize:10, fontWeight:650 }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize:9, color:"var(--muted-foreground)", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>Checks</p>
          <div className="space-y-2">
            {["Prompt parsed", "Style pack generated", "Responsive frame", "Asset tokens ready"].map(check=>(
              <div key={check} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:"rgba(107,203,119,0.18)", color:"#2D6A4F" }}>
                  <Check size={10}/>
                </div>
                <span style={{ fontSize:11, color:"var(--foreground)" }}>{check}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4" style={{ borderTop:"1px solid var(--border)" }}>
        <p style={{ fontSize:9, color:"var(--muted-foreground)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>
          Last command
        </p>
        <p style={{ fontSize:11, lineHeight:1.5, color:"var(--foreground)", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{lastPrompt}</p>
        <p style={{ fontSize:9, color:"var(--muted-foreground)", marginTop:8 }}>{deviceMeta.label} - {deviceMeta.note}</p>
      </div>
    </div>
  );
}

export function DraggableGeneratedPreview({
  device,
  spec,
  stylePack,
}: {
  device: DeviceMode;
  spec: GeneratedAppSpec;
  stylePack: StylePack;
}) {
  return (
    <>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full pointer-events-none" style={{ background:"rgba(44,34,20,0.08)" }}>
        <GripVertical size={10} style={{ color:"var(--muted-foreground)" }}/>
        <span style={{ fontSize:9, color:"var(--muted-foreground)", fontWeight:500 }}>Drag</span>
      </div>
      <DeviceFrame device={device}>
        <GeneratedAppPreview device={device} spec={spec} stylePack={stylePack}/>
      </DeviceFrame>
    </>
  );
}
