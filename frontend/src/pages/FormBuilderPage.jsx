import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { Reorder } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function FormBuilderPage() {
  const userId = localStorage.getItem("userId");

  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);

  const [selectedBaseId, setSelectedBaseId] = useState("");
  const [selectedTableId, setSelectedTableId] = useState("");

  const [loadingBases, setLoadingBases] = useState(true);
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingFields, setLoadingFields] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);

  // Load bases once
  useEffect(() => {
    if (!userId) {
      toast.error("No userId – please login again.");
      return;
    }

    (async () => {
      try {
        setLoadingBases(true);
        const res = await fetch(`${BACKEND_URL}/airtable/bases?userId=${userId}`);
        const data = await res.json();
        setBases(data.bases || []);
      } catch (err) {
        console.error("Error loading bases", err);
        toast.error("Failed to load bases");
      } finally {
        setLoadingBases(false);
      }
    })();
  }, [userId]);

  const handleBaseChange = async (baseId) => {
    setSelectedBaseId(baseId);
    setSelectedTableId("");
    setTables([]);
    setFields([]);
    setSelectedFields([]);

    if (!baseId) return;

    try {
      setLoadingTables(true);
      const res = await fetch(
        `${BACKEND_URL}/airtable/bases/${baseId}/tables?userId=${userId}`
      );
      const data = await res.json();
      setTables(data.tables || []);
    } catch (err) {
      console.error("Error loading tables", err);
      toast.error("Failed to load tables");
    } finally {
      setLoadingTables(false);
    }
  };

  const handleTableChange = async (tableId) => {
    setSelectedTableId(tableId);
    setFields([]);
    setSelectedFields([]);

    if (!tableId) return;

    try {
      setLoadingFields(true);
      const res = await fetch(
        `${BACKEND_URL}/airtable/bases/${selectedBaseId}/tables/${tableId}?userId=${userId}`
      );
      const data = await res.json();
      setFields(data.fields || []);
    } catch (err) {
      console.error("Error loading fields", err);
      toast.error("Failed to load fields");
    } finally {
      setLoadingFields(false);
    }
  };

  const addField = (field) => {
    if (selectedFields.find((f) => f.airtableFieldId === field.id)) {
      toast.error("Field already added");
      return;
    }

    setSelectedFields((prev) => [
      ...prev,
      {
        airtableFieldId: field.id,
        label: field.name,
        required: false,
        type: field.type,
      },
    ]);
  };

  const updateField = (index, key, value) => {
    setSelectedFields((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const removeField = (index) => {
    setSelectedFields((prev) => prev.filter((_, i) => i !== index));
  };

  const saveForm = async () => {
    if (!formTitle) return toast.error("Form title is required");
    if (!selectedBaseId || !selectedTableId)
      return toast.error("Select base & table");
    if (!selectedFields.length)
      return toast.error("Add at least one field to the form");

    const body = {
      ownerUserId: userId,
      baseId: selectedBaseId,
      tableId: selectedTableId,
      title: formTitle,
      fields: selectedFields,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/forms?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success("Form saved");
        setTimeout(() => (window.location.href = "/forms"), 500);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Failed to save form");
      }
    } catch (err) {
      console.error("Error saving form", err);
      toast.error("Error saving form");
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1>Create New Form</h1>

        {/* Form title */}
        <div className="card">
          <label style={{ display: "block", marginBottom: 8 }}>Form name</label>
          <input
            className="input"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="E.g. Demo Lead Capture"
          />
        </div>

        {/* Base & table */}
        <div className="card">
          <h2>Select Airtable base & table</h2>

          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Base</label>
              {loadingBases ? (
                <div className="skeleton" style={{ height: 44 }} />
              ) : (
                <select
                  className="input"
                  value={selectedBaseId}
                  onChange={(e) => handleBaseChange(e.target.value)}
                >
                  <option value="">-- Select base --</option>
                  {bases.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Table</label>
              {loadingTables ? (
                <div className="skeleton" style={{ height: 44 }} />
              ) : (
                <select
                  className="input"
                  value={selectedTableId}
                  onChange={(e) => handleTableChange(e.target.value)}
                  disabled={!selectedBaseId}
                >
                  <option value="">-- Select table --</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Available fields */}
        <div className="card">
          <h2>Available fields from Airtable</h2>

          {loadingFields ? (
            <p style={{ marginTop: 10 }}>Loading fields...</p>
          ) : fields.length === 0 ? (
            <p style={{ marginTop: 10 }}>No fields loaded. Select a table.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
                marginTop: 12,
              }}
            >
              {fields.map((field) => (
                <button
                  key={field.id}
                  className="btn btn-outline"
                  onClick={() => addField(field)}
                >
                  ➕ {field.name}
                  <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
                    ({field.type})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected fields */}
        <div className="card">
          <h2>Form fields</h2>

          {selectedFields.length === 0 && (
            <p style={{ marginTop: 10, color: "#aaa" }}>No fields added yet.</p>
          )}

          <Reorder.Group axis="y" values={selectedFields} onReorder={setSelectedFields}>
            {selectedFields.map((field, index) => (
              <Reorder.Item key={field.airtableFieldId} value={field}>
                <div className="field-item">
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 4 }}>
                      Label
                    </label>
                    <input
                      className="input"
                      value={field.label}
                      onChange={(e) =>
                        updateField(index, "label", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(index, "required", e.target.checked)
                        }
                      />{" "}
                      Required
                    </label>
                  </div>

                  <button
                    className="btn btn-outline"
                    onClick={() => removeField(index)}
                  >
                    ✕
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px 0", marginTop: 10 }}
          onClick={saveForm}
        >
          Save form
        </button>
      </div>
    </Layout>
  );
}
