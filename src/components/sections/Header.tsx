import { Button } from "../Button";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a className="brand" href="#top" aria-label="Reaction Run home">
          <span className="brand-mark">R</span>
          <span className="brand-copy">
            <strong>Reaction Run</strong>
            <span>Reaction time, refined</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          <a href="#demo">Reaction Test</a>
          <a href="#stats">Stats</a>
          <a href="#leaderboard">Leaderboard</a>
        </nav>

        <Button href="#demo" className="header-cta">
          Start reaction test
        </Button>
      </div>
    </header>
  );
}
