// App.tsx — Captain's Charter Weather
// Routes: Home, Florida, Bahamas, RegionDetail, Advisories, CrossingPlanner, BookBriefing, About
import { Route, Switch } from "wouter";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import Florida from "@/pages/Florida";
import Bahamas from "@/pages/Bahamas";
import RegionDetail from "@/pages/RegionDetail";
import MarineAdvisories from "@/pages/MarineAdvisories";
import CrossingPlanner from "@/pages/CrossingPlanner";
import BookBriefing from "@/pages/BookBriefing";
import About from "@/pages/About";
import { Toaster } from "@/components/ui/sonner";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#0A0E14" }}>
      <div className="font-data text-xs mb-2" style={{ color: "#FF8C00", letterSpacing: "0.2em" }}>404 — SIGNAL LOST</div>
      <div className="font-tactical text-white text-3xl font-bold mb-4">Page Not Found</div>
      <a href="/" className="font-data text-sm" style={{ color: "#00D4FF" }}>Return to Home Base</a>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ background: "#0A0E14", minHeight: "100vh" }}>
      <Navigation />
      <Toaster />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/florida" component={Florida} />
        <Route path="/bahamas" component={Bahamas} />
        <Route path="/florida/:regionId" component={RegionDetail} />
        <Route path="/bahamas/:regionId" component={RegionDetail} />
        <Route path="/about" component={About} />
        <Route path="/advisories" component={MarineAdvisories} />
        <Route path="/book-briefing" component={BookBriefing} />
        <Route path="/crossing-planner" component={CrossingPlanner} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}
