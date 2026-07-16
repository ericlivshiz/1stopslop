import Link from "next/link";
import { TestingLab } from "../../components/TestingLab";

export default function TestingPage() {
  return (
    <main className="testing-shell">
      <nav className="testing-nav"><Link href="/">← Back to race</Link><span>Developer playground</span></nav>
      <TestingLab />
    </main>
  );
}
