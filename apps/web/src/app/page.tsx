'use client';

import { useState } from 'react';

export default function CadencePage() {
  const [json, setJson] = useState(`{
  "id": "cad_123",
  "name": "Welcome Flow",
  "steps": [
    {
      "id": "1",
      "type": "SEND_EMAIL",
      "subject": "Welcome",
      "body": "Hello there"
    },
    {
      "id": "2",
      "type": "WAIT",
      "seconds": 10
    }
  ]
}`);

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const createCadence = async () => {
    try {
      setLoading(true);
      setResponse(null);

      const parsed = JSON.parse(json);

      const res = await fetch('http://localhost:4000/cadences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Cadence</h1>

      <textarea
        rows={18}
        cols={80}
        value={json}
        onChange={(e) => setJson(e.target.value)}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />

      <br /><br />

      <button onClick={createCadence} disabled={loading}>
        {loading ? 'Creating...' : 'Create Cadence'}
      </button>

      <br /><br />

      <h2>Response:</h2>
      <pre style={{ background: '#111', color: '#0f0', padding: 10 }}>
        {response ? JSON.stringify(response, null, 2) : 'No response yet'}
      </pre>
    </div>
  );
}