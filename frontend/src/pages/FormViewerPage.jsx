import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function FormViewer() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});

  useEffect(() => {
    fetch(`${BACKEND_URL}/forms/single/${formId}`)
      .then((r) => r.json())
      .then((d) => setForm(d));
  }, []);

  const submit = async () => {
    await fetch(`${BACKEND_URL}/submit/${formId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    toast.success("Submitted!");
    setTimeout(() => navigate("/submitted"), 500);
  };

  if (!form) return <Layout><div className="container">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="container">
        <h1>{form.title}</h1>

        {form.fields.map((f) => (
          <div key={f.airtableFieldId} className="section">
            <label>{f.label} {f.required && "*"}</label>
            <input
              className="input"
              required={f.required}
              onChange={(e) => setValues(prev => ({ ...prev, [f.airtableFieldId]: e.target.value }))}
            />
          </div>
        ))}

        <button className="btn btn-primary" onClick={submit} style={{ width: "100%", padding: "15px" }}>
          Submit
        </button>
      </div>
    </Layout>
  );
}
