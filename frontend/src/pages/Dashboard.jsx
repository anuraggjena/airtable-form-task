import Layout from "../components/Layout";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userIdFromUrl = params.get("userId");

    if (userIdFromUrl) {
      localStorage.setItem("userId", userIdFromUrl);
    }
  }, [location.search]);

  const storedUserId = localStorage.getItem("userId");

  return (
    <Layout>
      <div className="container">
        <h1>Dashboard</h1>
        <p style={{ marginBottom: 20, color: "#aaa" }}>
          Logged in user: <strong>{storedUserId || "Not found"}</strong>
        </p>

        <div style={{ display: "flex", gap: 16 }}>
          <Link to="/forms/new">
            <button className="btn btn-primary">➕ Create New Form</button>
          </Link>
          <Link to="/forms">
            <button className="btn btn-outline">📄 View My Forms</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
