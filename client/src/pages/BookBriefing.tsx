// BookBriefing — Captain's Charter Weather
// Contact form to book a personal weather briefing with James Van Fleet
import { useState } from "react";
import { Link } from "wouter";

export default function BookBriefing() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", vessel: "", area: "", notes: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ paddingTop: "3.5rem" }}>
      <div className="py-12" style={{ background: "linear-gradient(180deg, #0D1520 0%, #0A0E14 100%)", borderBottom: "1px solid #1A2D42" }}>
        <div className="container">
          <div className="font-data mb-2" style={{ fontSize: "0.6rem", color: "#FF8C00", letterSpacing: "0.25em" }}>PERSONAL WEATHER SERVICE</div>
          <h1 className="font-tactical text-white mb-3" style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "0.05em" }}>BOOK A BRIEFING</h1>
          <p className="font-data" style={{ fontSize: "0.75rem", color: "#7B9BB5", maxWidth: "480px", lineHeight: 1.7 }}>
            Schedule a one-on-one weather briefing with James Van Fleet before your offshore trip or Bahamas crossing.
          </p>
        </div>
      </div>

      <div className="py-16" style={{ background: "#0A0E14" }}>
        <div className="container max-w-2xl">
          {submitted ? (
            <div className="text-center py-16">
              <div className="font-data mb-4" style={{ fontSize: "0.65rem", color: "#39FF14", letterSpacing: "0.2em" }}>REQUEST RECEIVED</div>
              <div className="font-tactical text-white mb-4" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Thank You</div>
              <div className="font-data mb-8" style={{ fontSize: "0.75rem", color: "#7B9BB5", lineHeight: 1.7 }}>
                James will contact you within 24 hours to confirm your briefing.
              </div>
              <Link href="/">
                <span className="font-data cursor-pointer" style={{ fontSize: "0.65rem", color: "#00D4FF", letterSpacing: "0.1em" }}>&larr; RETURN HOME</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { key: "name", label: "FULL NAME", type: "text", required: true },
                { key: "email", label: "EMAIL", type: "email", required: true },
                { key: "phone", label: "PHONE", type: "tel", required: false },
                { key: "date", label: "DESIRED BRIEFING DATE", type: "date", required: true },
                { key: "vessel", label: "VESSEL NAME / TYPE", type: "text", required: false },
                { key: "area", label: "OPERATING AREA (e.g. Bahamas Crossing, Keys Offshore)", type: "text", required: true },
              ].map(field => (
                <div key={field.key}>
                  <label className="data-label block mb-1">{field.label}{field.required && " *"}</label>
                  <input
                    type={field.type}
                    required={field.required}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2 font-data"
                    style={{ background: "rgba(13,21,32,0.8)", border: "1px solid #1A2D42", color: "#E8F4FF", fontSize: "0.8rem", outline: "none" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#1A2D42"; }}
                  />
                </div>
              ))}
              <div>
                <label className="data-label block mb-1">ADDITIONAL NOTES</label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 font-data resize-none"
                  style={{ background: "rgba(13,21,32,0.8)", border: "1px solid #1A2D42", color: "#E8F4FF", fontSize: "0.8rem", outline: "none" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#1A2D42"; }}
                />
              </div>
              <button
                type="submit"
                className="font-tactical font-bold uppercase tracking-widest px-6 py-3 cursor-pointer transition-all duration-200 mt-2"
                style={{ background: "#00D4FF", color: "#0A0E14", fontSize: "0.8rem", letterSpacing: "0.12em", border: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#33DDFF"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#00D4FF"; }}
              >
                Submit Request
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="py-8" style={{ background: "#0A0E14", borderTop: "1px solid #1A2D42" }}>
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5", letterSpacing: "0.1em" }}>
            CAPTAIN'S CHARTER WEATHER &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
