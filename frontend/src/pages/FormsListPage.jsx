import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function FormListPage() {
  const userId = localStorage.getItem("userId");
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/forms?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setForms(d));
  }, []);

  return (
    <Layout>
      <div className="container">
        <h1>My Forms</h1>

        {forms.length === 0 && <p style={{ marginTop: 20 }}>No forms created yet.</p>}

        {forms.map((form) => (
          <div className="card" key={form._id}>
            <h2>{form.title}</h2>
            <div style={{ display: "flex", gap: 20 }}>
              <Link to={`/forms/${form._id}`}>
                <button className="btn-primary">Open Form</button>
              </Link>
              <button
                className="btn-outline"
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/form/${form._id}`)}>
                Copy Share Link
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
