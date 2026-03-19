import { ConsentBanner } from "./components/ConsentBanner";
import { Footer } from "./components/sections/Footer";
import { Header } from "./components/sections/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { LeaderboardSection } from "./components/sections/LeaderboardSection";
import { WorkspaceSection } from "./components/sections/WorkspaceSection";

function App() {
  return (
    <div className="page-shell">
      <div className="page-backdrop" aria-hidden="true" />
      <Header />
      <main>
        <HeroSection />
        <WorkspaceSection />
        <LeaderboardSection />
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
}

export default App;
