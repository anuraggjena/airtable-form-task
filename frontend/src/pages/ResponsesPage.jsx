import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export default function ResponsesPage() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/forms/${formId}/responses`)
      .then(res => res.json())
      .then(setResponses)
      .catch(console.error);
  }, [formId]);

  return (
    <div>
      <h2>Responses</h2>
      {responses.length === 0 && <p>No responses yet.</p>}
      <ul>
        {responses.map(r => (
          <li key={r.id} style={{ marginBottom: 10 }}>
            <strong>{new Date(r.createdAt).toLocaleString()}</strong>
            {r.deletedInAirtable && <span> (deleted in Airtable)</span>}
            <pre style={{ background: "#f5f5f5", padding: 8 }}>
              {JSON.stringify(r.answersPreview, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
