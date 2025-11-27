import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div style={{ padding: "16px", maxWidth: 800, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1>Airtable Form Builder</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Login</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
