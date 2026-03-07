// NotFound — Captain's Charter Weather
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{ paddingTop: "3.5rem", minHeight: "100vh", background: "#0A0E14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="text-center px-4">
        <div className="font-data mb-2" style={{ fontSize: "0.6rem", color: "#FF3C3C", letterSpacing: "0.25em" }}>NAVIGATION ERROR</div>
        <div className="font-tactical text-white mb-4" style={{ fontSize: "4rem", fontWeight: 800, letterSpacing: "0.05em", lineHeight: 1 }}>404</div>
        <div className="font-data mb-8" style={{ fontSize: "0.8rem", color: "#7B9BB5" }}>Page not found. Check your heading.</div>
        <Link href="/">
          <span
            className="font-tactical font-bold uppercase tracking-widest px-6 py-3 cursor-pointer"
            style={{ background: "#00D4FF", color: "#0A0E14", fontSize: "0.8rem", letterSpacing: "0.12em", display: "inline-block" }}
          >
            Return Home
          </span>
        </Link>
      </div>
    </div>
  );
}
