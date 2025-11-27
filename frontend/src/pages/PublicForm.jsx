import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function PublicForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});

  useEffect(() => {
    fetch(`${BACKEND_URL}/forms?userId=${localStorage.getItem("userId")}`)
      .then(r => r.json())
      .then(list => setForm(list.find(f => f._id === formId)));
  }, []);

  if (!form) return <Layout><p>Loading...</p></Layout>;

  const submit = async () => {
    await fetch(`${BACKEND_URL}/submit/${formId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    toast.success("Submitted!");
    setTimeout(() => navigate("/submitted"), 600);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">{form.title}</h1>

      {form.fields.map(f => (
        <div key={f.airtableFieldId} className="mb-6">
          <label className="text-gray-300">{f.label}{f.required && " *"}</label>
          <input
            className="mt-2 w-full bg-[#222] p-3 rounded"
            required={f.required}
            onChange={e => setValues(prev => ({ ...prev, [f.airtableFieldId]: e.target.value }))}
          />
        </div>
      ))}

      <button onClick={submit} className="bg-brand px-6 py-3 rounded hover:bg-blue-600">
        Submit
      </button>
    </Layout>
  );
}
