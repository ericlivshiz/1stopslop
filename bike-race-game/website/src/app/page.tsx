import { RaceGame } from "../components/RaceGame";

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <div>
          <span className="brand-mark" aria-hidden="true">SR</span>
          <span className="brand-name">Sunset Ridge</span>
        </div>
        <div className="desktop-legend"><kbd>A</kbd><kbd>D</kbd> Ride <span>·</span> <kbd>W</kbd><kbd>S</kbd> Rotate</div>
      </header>
      <div className="intro-copy">
        <p>Prototype course</p>
        <h1>Outrun the sunset.</h1>
      </div>
      <RaceGame />
      <footer>One bike. Four gates. No brakes on the horizon.</footer>
    </main>
  );
}
