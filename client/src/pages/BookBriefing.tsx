// BookBriefing — Captain's Charter Weather
// Restored from original bundle: web3forms submission, briefing type selector, pricing cards, who-this-is-for, about James
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const WEB3FORMS_KEY = "51c4f3bf-d871-44ee-8d51-388f783c998a";

const TIME_SLOTS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 15, 30, 45]) {
    const hr = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? "AM" : "PM";
    const min = m === 0 ? "00" : String(m);
    TIME_SLOTS.push(`${hr}:${min} ${ampm} EST`);
  }
}

const BRIEFING_TYPES = [
  { id: "day-charter", label: "Day Charters", icon: "⛵", subtitle: "Sightseeing, Snorkel, Dive & Sunset Cruises", intro: { price: "$50", tag: "FIRST SESSION", tagColor: "#39FF14", tagBg: "rgba(57,255,20,0.08)", tagBorder: "rgba(57,255,20,0.3)", note: "LIMITED OFFER" }, standard: { price: "$100", tag: "STANDARD SESSION", tagColor: "#00D4FF", tagBg: "rgba(0,212,255,0.06)", tagBorder: "rgba(0,212,255,0.2)", note: "PER SESSION" }, duration: "20 Minutes", description: "Day charters and rental guests deserve the best experience. Know which direction to run for the calmest water, the clearest skies, and the best conditions for your guests -- whether that is snorkeling, diving, or just a comfortable ride.", bullets: ["Best direction to run for calm, comfortable water", "Guest comfort sea state and swell forecasts", "Afternoon thunderstorm timing and avoidance", "Alternate destination planning", "Inlet and channel condition windows"], accentColor: "#39FF14" },
  { id: "day-fishing", label: "Day Fishing Charters", icon: "🎣", subtitle: "Inshore, Nearshore & Offshore Fishing", intro: { price: "$50", tag: "FIRST SESSION", tagColor: "#39FF14", tagBg: "rgba(57,255,20,0.08)", tagBorder: "rgba(57,255,20,0.3)", note: "LIMITED OFFER" }, standard: { price: "$100", tag: "STANDARD SESSION", tagColor: "#00D4FF", tagBg: "rgba(0,212,255,0.06)", tagBorder: "rgba(0,212,255,0.2)", note: "PER SESSION" }, duration: "20 Minutes", description: "Know where the fish are holding and where the weather will let you run. Get a decision briefing before you leave the dock -- wind, seas, current, and the best window to get out and get back safely.", bullets: ["Offshore trolling windows by fishing grounds", "Sea state and swell direction by target area", "Return window timing and squall tracking", "Gulf Stream edge and temperature break location", "Best departure time for the tides and wind"], accentColor: "#00D4FF" },
  { id: "yacht", label: "Yacht Owners & Captains", icon: "🛥️", subtitle: "Passages, Repositioning & Crossings", intro: { price: "$50", tag: "FIRST SESSION", tagColor: "#39FF14", tagBg: "rgba(57,255,20,0.08)", tagBorder: "rgba(57,255,20,0.3)", note: "LIMITED OFFER" }, standard: { price: "$150", tag: "STANDARD SESSION", tagColor: "#FF8C00", tagBg: "rgba(255,140,0,0.06)", tagBorder: "rgba(255,140,0,0.2)", note: "PER SESSION" }, duration: "20 Minutes", description: "Longer passages, repositioning voyages, Bahamas crossings, and multi-port itineraries require serious weather intelligence. Get a full briefing covering routing, passage windows, anchorage conditions, and tropical weather threats.", bullets: ["Passage routing and multi-day timing", "Bahamas crossing and Gulf Stream windows", "Tropical storm and hurricane vessel decisions", "Stay tied up or move -- when and where", "Anchorage and safe harbor recommendations"], accentColor: "#FF8C00" },
];

const WHO_FOR = [
  { id: "fishing", icon: "🎣", title: "Fishing Captains", subtitle: "Florida & Bahamas Offshore", description: "Know where the fish are holding and where the weather will let you run. Get a decision briefing before you leave the dock -- wind, seas, current, and the best window to get out and get back safely.", bullets: ["Offshore trolling windows by fishing grounds", "Sea state and swell direction by target area", "Return window timing and squall tracking", "Gulf Stream edge and temperature break location", "Best departure time for the tides and wind"], color: "#00D4FF" },
  { id: "charter", icon: "⛵", title: "Day Charter Captains", subtitle: "Guest Experience Forecasts", description: "Day charters and rental guests deserve the best experience. Know which direction to run for the calmest water, the clearest skies, and the best conditions for your guests -- whether that is snorkeling, diving, or just a comfortable ride.", bullets: ["Best direction to run for calm water", "Guest comfort sea state forecasts", "Afternoon thunderstorm timing", "Alternate destination planning", "Inlet and channel condition windows"], color: "#39FF14" },
  { id: "yacht", icon: "🛥️", title: "Yacht Owners & Captains", subtitle: "Passage Routing & Repositioning", description: "Longer passages, repositioning voyages, and multi-port itineraries require serious weather intelligence. Get a full briefing covering routing, passage windows, anchorage conditions, and tropical weather threats.", bullets: ["Passage routing and timing", "Tropical storm and hurricane decisions", "Stay tied up or move the vessel?", "When and where to relocate for safety", "Bahamas crossing and Gulf Stream windows"], color: "#FF8C00" },
  { id: "tropical", icon: "🌀", title: "Tropical Weather & Hurricane Decisions", subtitle: "When the Stakes Are Highest", description: "When a tropical system is developing or a hurricane is threatening, the decisions get serious fast. Do you stay tied up or move the vessel? If you move, when do you need to leave, and where should you go? James provides clear, direct answers based on the actual forecast data -- not the headlines.", bullets: ["Track analysis and landfall timing", "Stay tied up or move the vessel?", "Departure window before conditions deteriorate", "Safe harbor and anchorage recommendations", "Same decision support provided to Royal Caribbean's fleet"], color: "#FF3C3C" },
];

function FormField({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-data text-xs mb-1.5" style={{ color: "#7B9BB5", letterSpacing: "0.1em" }}>
        {icon && <span className="mr-1">{icon}</span>}{label}
      </label>
      {children}
    </div>
  );
}

const IS: React.CSSProperties = { width: "100%", background: "rgba(0,212,255,0.04)", border: "1px solid #1A2D42", color: "#E8F4FF", padding: "0.6rem 0.75rem", fontSize: "0.82rem", fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" };

const DEFAULT_FORM = { name: "", title: "", email: "", phone: "", vesselName: "", marina: "", concern: "", preferredDate: "", preferredTime: "", platform: "Zoom" };

export default function BookBriefing() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedWho, setExpandedWho] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("day-charter");

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.concern) { toast.error("Please fill in your name, email, and weather concern."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject: `New Briefing Request -- Captain's Charter Weather -- ${form.name}`, name: form.name, title: form.title, email: form.email, phone: form.phone, vessel_name: form.vesselName, marina: form.marina, weather_concern: form.concern, preferred_date: form.preferredDate, preferred_time: form.preferredTime, platform: form.platform, briefing_type: selectedType, source: "Captain's Charter Weather" }) });
      const data = await res.json();
      if (data.success) { setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else toast.error(data?.message ?? "Submission failed. Please try again.");
    } catch { toast.error("Network error. Please check your connection and try again."); }
    finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#060A0F" }}>
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: "rgba(57,255,20,0.1)", border: "1px solid rgba(57,255,20,0.3)" }}>
          <span style={{ color: "#39FF14", fontSize: "1.5rem" }}>✓</span>
        </div>
        <div className="font-data text-xs mb-3" style={{ color: "#39FF14", letterSpacing: "0.2em" }}>REQUEST RECEIVED</div>
        <h2 className="font-tactical font-black text-white mb-4" style={{ fontSize: "2rem" }}>BRIEFING REQUEST SENT</h2>
        <p className="font-data mb-6" style={{ color: "#B8D4E8", fontSize: "0.88rem", lineHeight: 1.75 }}>James will confirm your booking by email within 24 hours and send a meeting link for your chosen platform. First session $50. Payment details will be provided upon confirmation.</p>
        <Link href="/"><span className="inline-block font-tactical font-bold px-8 py-3 cursor-pointer transition-all duration-200" style={{ background: "#00D4FF", color: "#060A0F", fontSize: "0.75rem", letterSpacing: "0.15em" }}>RETURN TO HOME BASE</span></Link>
      </div>
    </div>
  );

  const activeType = BRIEFING_TYPES.find(t => t.id === selectedType)!;

  return (
    <div style={{ background: "#060A0F", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative pt-24 pb-12" style={{ background: "linear-gradient(180deg, #0D1520 0%, #060A0F 100%)", borderBottom: "1px solid #1A2D42" }}>
        <div className="container max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-6 font-data text-xs" style={{ color: "#7B9BB5", letterSpacing: "0.1em" }}>
            <Link href="/"><span className="hover:text-cyan-400 cursor-pointer transition-colors">HOME</span></Link>
            <span style={{ color: "#1A2D42" }}>/</span>
            <span style={{ color: "#00D4FF" }}>WEATHER DECISION BRIEFING</span>
          </div>
          <div className="flex items-start gap-5 mb-5">
            <div className="flex-shrink-0 flex items-center justify-center rounded-sm font-tactical font-bold text-white" style={{ background: "#003087", width: 44, height: 44, fontSize: "0.5rem", letterSpacing: "0.05em", lineHeight: 1.2, textAlign: "center" }}>NWS<br />30+</div>
            <div>
              <div className="font-data text-xs mb-1" style={{ color: "#00D4FF", letterSpacing: "0.2em" }}>ONE-ON-ONE WITH JAMES VAN FLEET</div>
              <h1 className="font-tactical font-black text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                SCHEDULE A <span style={{ color: "#00D4FF" }}>WEATHER DECISION</span> BRIEFING
              </h1>
            </div>
          </div>
          <p className="font-data max-w-2xl mb-6" style={{ color: "#B8D4E8", fontSize: "0.9rem", lineHeight: 1.75 }}>
            A focused 20-minute one-on-one session with James. You bring the question -- where to go, when to go, whether to stay tied up or move the vessel. James brings 30+ years of professional meteorology and the answers you need before you leave the dock.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Former Chief Meteorologist, Royal Caribbean", "30+ Years Professional Meteorology", "NOAA Hurricane Hunter Veteran", "Tampa CBS · Orlando FOX · Dallas ABC"].map(b => (
              <div key={b} className="font-data text-xs px-3 py-1.5" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", color: "#7B9BB5", letterSpacing: "0.06em" }}>{b}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Briefing type + form */}
      <div className="py-14" style={{ borderBottom: "1px solid #1A2D42" }}>
        <div className="container max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: type selector + pricing */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-col gap-1">
                <div className="font-data text-xs mb-2" style={{ color: "#7B9BB5", letterSpacing: "0.15em" }}>SELECT YOUR BRIEFING TYPE</div>
                {BRIEFING_TYPES.map(type => (
                  <button key={type.id} onClick={() => setSelectedType(type.id)} className="flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                    style={{ background: selectedType === type.id ? `rgba(${type.accentColor === "#39FF14" ? "57,255,20" : type.accentColor === "#00D4FF" ? "0,212,255" : "255,140,0"},0.06)` : "#0D1520", border: `1px solid ${selectedType === type.id ? type.accentColor + "40" : "#1A2D42"}`, cursor: "pointer" }}>
                    <span style={{ fontSize: "1.1rem" }}>{type.icon}</span>
                    <div>
                      <div className="font-tactical font-bold" style={{ color: selectedType === type.id ? type.accentColor : "#E8F4FF", fontSize: "0.85rem" }}>{type.label}</div>
                      <div className="font-data" style={{ color: "#7B9BB5", fontSize: "0.6rem" }}>{type.subtitle}</div>
                    </div>
                    {selectedType === type.id && <span className="ml-auto font-data" style={{ color: type.accentColor, fontSize: "0.65rem" }}>SELECTED</span>}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <p className="font-data" style={{ color: "#B8D4E8", fontSize: "0.8rem", lineHeight: 1.7 }}>{activeType.description}</p>
                <div className="space-y-1.5">
                  {activeType.bullets.map(b => (
                    <div key={b} className="flex items-start gap-2">
                      <span style={{ color: activeType.accentColor, fontSize: "0.65rem", marginTop: 3, flexShrink: 0 }}>+</span>
                      <span className="font-data" style={{ color: "#B8D4E8", fontSize: "0.75rem" }}>{b}</span>
                    </div>
                  ))}
                </div>
                {/* First session card */}
                <div className="rounded-sm overflow-hidden" style={{ background: "linear-gradient(135deg, #0D2035 0%, #0D1520 100%)", border: `1px solid ${activeType.intro.tagBorder}` }}>
                  <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${activeType.intro.tagColor}, transparent)` }} />
                  <div className="p-4">
                    <div className="inline-block font-data text-xs px-2 py-1 mb-2" style={{ background: activeType.intro.tagBg, border: `1px solid ${activeType.intro.tagBorder}`, color: activeType.intro.tagColor, letterSpacing: "0.12em" }}>{activeType.intro.tag}</div>
                    <div className="flex items-end gap-2 mb-0.5">
                      <div className="font-tactical font-black" style={{ color: "#FFF", fontSize: "2.2rem", lineHeight: 1 }}>{activeType.intro.price}</div>
                      <div className="font-data mb-1" style={{ color: "#7B9BB5", fontSize: "0.7rem" }}>/ {activeType.duration}</div>
                    </div>
                    <div className="font-data text-xs" style={{ color: "#7B9BB5", letterSpacing: "0.1em" }}>{activeType.intro.note}</div>
                  </div>
                </div>
                {/* Standard card */}
                <div className="rounded-sm overflow-hidden" style={{ background: "#0D1520", border: `1px solid ${activeType.standard.tagBorder}` }}>
                  <div className="p-4">
                    <div className="inline-block font-data text-xs px-2 py-1 mb-2" style={{ background: activeType.standard.tagBg, border: `1px solid ${activeType.standard.tagBorder}`, color: activeType.standard.tagColor, letterSpacing: "0.12em" }}>{activeType.standard.tag}</div>
                    <div className="flex items-end gap-2 mb-0.5">
                      <div className="font-tactical font-black" style={{ color: "#FFF", fontSize: "2.2rem", lineHeight: 1 }}>{activeType.standard.price}</div>
                      <div className="font-data mb-1" style={{ color: "#7B9BB5", fontSize: "0.7rem" }}>/ {activeType.duration}</div>
                    </div>
                    <div className="font-data text-xs" style={{ color: "#7B9BB5", letterSpacing: "0.1em" }}>{activeType.standard.note}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <div className="font-data text-xs mb-5" style={{ color: "#00D4FF", letterSpacing: "0.2em" }}>YOUR DETAILS</div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="FULL NAME" icon="👤"><input type="text" placeholder="Captain Jane Smith" value={form.name} onChange={handleChange("name")} required style={IS} /></FormField>
                  <FormField label="TITLE / ROLE" icon="🎖️"><input type="text" placeholder="Captain, Owner, First Mate..." value={form.title} onChange={handleChange("title")} style={IS} /></FormField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="EMAIL ADDRESS" icon="✉️"><input type="email" placeholder="you@example.com" value={form.email} onChange={handleChange("email")} required style={IS} /></FormField>
                  <FormField label="PHONE NUMBER" icon="📞"><input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange("phone")} style={IS} /></FormField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="VESSEL NAME" icon="⚓"><input type="text" placeholder="M/V Sea Breeze" value={form.vesselName} onChange={handleChange("vesselName")} style={IS} /></FormField>
                  <FormField label="MARINA / CURRENT LOCATION" icon="📍"><input type="text" placeholder="Miami, FL" value={form.marina} onChange={handleChange("marina")} style={IS} /></FormField>
                </div>
                <FormField label="WEATHER CONCERN OR QUESTION" icon="🌊">
                  <textarea rows={4} placeholder="Describe the weather situation or decision you need help with. For example: planning a passage from Miami to the Bahamas next week, concerned about a developing tropical system..." value={form.concern} onChange={handleChange("concern")} required style={{ ...IS, resize: "vertical" }} />
                </FormField>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="PREFERRED DATE" icon="📅"><input type="date" value={form.preferredDate} onChange={handleChange("preferredDate")} style={{ ...IS, colorScheme: "dark" }} /></FormField>
                  <FormField label="PREFERRED TIME (EST)" icon="🕐">
                    <select value={form.preferredTime} onChange={handleChange("preferredTime")} style={IS}>
                      <option value="">Select a time...</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </FormField>
                  <FormField label="PLATFORM" icon="💻">
                    <select value={form.platform} onChange={handleChange("platform")} style={IS}>
                      <option value="Zoom">Zoom</option>
                      <option value="WebEx">WebEx</option>
                      <option value="Google Meet">Google Meet</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormField>
                </div>
                <p className="font-data text-xs" style={{ color: "#4A6A82", lineHeight: 1.6 }}>By submitting this form you agree to be contacted by James Van Fleet to confirm your briefing. Payment details will be provided upon confirmation.</p>
                <button type="submit" disabled={submitting} className="w-full font-tactical font-bold py-4 transition-all duration-200"
                  style={{ background: submitting ? "rgba(0,212,255,0.3)" : "#00D4FF", color: "#060A0F", fontSize: "0.8rem", letterSpacing: "0.2em", cursor: submitting ? "not-allowed" : "pointer", border: "none" }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#39FF14"; }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#00D4FF"; }}>
                  {submitting ? "SENDING REQUEST..." : "REQUEST MY BRIEFING →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Who this is for */}
      <div className="py-14" style={{ borderBottom: "1px solid #1A2D42" }}>
        <div className="container max-w-5xl mx-auto px-6">
          <div className="font-data text-xs mb-6" style={{ color: "#00D4FF", letterSpacing: "0.2em" }}>WHO THIS IS FOR</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WHO_FOR.map(item => (
              <div key={item.id} className="rounded-sm overflow-hidden cursor-pointer transition-all duration-200"
                style={{ background: expandedWho === item.id ? "#0D2035" : "#0D1520", border: expandedWho === item.id ? `1px solid ${item.color}40` : "1px solid #1A2D42" }}
                onClick={() => setExpandedWho(expandedWho === item.id ? null : item.id)}>
                <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)` }} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-tactical font-bold text-white" style={{ fontSize: "0.9rem", letterSpacing: "0.04em" }}>{item.title}</div>
                      <div className="font-data text-xs" style={{ color: item.color, letterSpacing: "0.08em" }}>{item.subtitle}</div>
                    </div>
                    <div className="font-data text-xs transition-transform duration-200" style={{ color: "#7B9BB5", transform: expandedWho === item.id ? "rotate(180deg)" : "rotate(0deg)" }}>▼</div>
                  </div>
                  <p className="font-data" style={{ color: "#B8D4E8", fontSize: "0.78rem", lineHeight: 1.65 }}>{item.description}</p>
                  {expandedWho === item.id && (
                    <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: `1px solid ${item.color}20` }}>
                      {item.bullets.map(b => (
                        <div key={b} className="flex items-start gap-2">
                          <span style={{ color: item.color, fontSize: "0.65rem", marginTop: 3, flexShrink: 0 }}>+</span>
                          <span className="font-data" style={{ color: "#B8D4E8", fontSize: "0.75rem" }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About James */}
      <div className="py-14">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="font-data text-xs mb-6" style={{ color: "#00D4FF", letterSpacing: "0.2em" }}>ABOUT JAMES VAN FLEET</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <p className="font-data" style={{ color: "#B8D4E8", fontSize: "0.86rem", lineHeight: 1.8 }}>With over 30 years of experience as a broadcast and operational meteorologist, James Van Fleet has built a career on delivering life-saving, data-driven weather intelligence. He is a trusted media spokesperson with regular appearances on The Weather Channel, FOX Weather, and Weather Nation, and a crisis-tested leader credited with protecting lives and multi-billion-dollar assets through precise hurricane routing and real-time decision support.</p>
              <p className="font-data" style={{ color: "#B8D4E8", fontSize: "0.86rem", lineHeight: 1.8 }}>As the first-ever Chief Meteorologist for Royal Caribbean International (2016-2023), James forecasted and routed the entire global fleet, ensuring the safety of millions of passengers and crew. His critical decisions included ordering the evacuation of Perfect Day at CocoCay ahead of Category 5 Hurricane Dorian, and diverting vessels out of the direct paths of Category 5 Hurricanes Maria and Irma.</p>
              <p className="font-data" style={{ color: "#B8D4E8", fontSize: "0.86rem", lineHeight: 1.8 }}>Before his role with Royal Caribbean, James spent decades as a Chief Meteorologist in major television markets including Tampa (WTSP-TV CBS), Orlando (WOFL-TV FOX), and Dallas (WFAA-TV ABC). He was the first on-air to call Hurricane Charley's unexpected turn toward Orlando, and he flew with the NOAA Hurricane Hunters directly into Category 5 Hurricane Isabel to gather live data.</p>
            </div>
            <div className="space-y-2.5">
              {[{ label: "EXPERIENCE", value: "30+ Years" }, { label: "ROYAL CARIBBEAN", value: "Chief Met 2016-2023" }, { label: "TV MARKETS", value: "Tampa · Orlando · Dallas" }, { label: "HURRICANE HUNTERS", value: "Cat 5 Isabel" }, { label: "MEDIA", value: "TWC · FOX Weather · WN" }].map(s => (
                <div key={s.label} className="p-3" style={{ background: "#0D1520", border: "1px solid #1A2D42" }}>
                  <div className="font-data text-xs mb-0.5" style={{ color: "#7B9BB5", letterSpacing: "0.12em" }}>{s.label}</div>
                  <div className="font-tactical font-bold text-white" style={{ fontSize: "0.82rem" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
