'use client';

import { AlertCircle, CheckCircle2, Database, Mail, Play, Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CadencesPage() {
  const dummyCadence = {
    "id": "cad_123",
    "name": "Welcome Flow",
    "steps": [
      { "id": "1", "type": "SEND_EMAIL", "subject": "Welcome", "body": "Hello there" },
      { "id": "2", "type": "WAIT", "seconds": 10 }
    ]

  }

  type Cadence = {
    id: string;
    name: string;
    steps: {
      id: string;
      type: string;
      subject?: string;
      body?: string;
      seconds?: number;
    }[];
  };

  const router = useRouter()
  const [cadenceId, setCadenceId] = useState('');
  const [json, setJson] = useState<Cadence | string | null>(null);
  const [action, setAction] = useState<'create' | 'load' | 'update' | null>(null);

  const handleCreate = async () => {
    try {
      if (!json || typeof json === 'string') {
        throw new Error('Please provide valid JSON configuration');
      }
      const res = await fetch('http://localhost:4000/cadences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (res.ok) {
        setJson(data?.data);
        toast.success('Cadence created successfully!');
      } else {
        toast.error(data?.message || 'Failed to create cadence');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error: Invalid JSON format.');
    }
  };

  const handleLoad = async () => {
    try {
      const res = await fetch(`http://localhost:4000/cadences/${cadenceId}`);
      const data = await res.json();
      if (res.ok) {
        setJson(data?.data);
        toast.success('Cadence loaded successfully!');
      } else {
        toast.error(data?.message || 'Cadence not found');
      }
    } catch (error: any) {
      toast.error('Failed to load cadence');
    }
  };

  const handleUpdate = async () => {
    try {
      if (typeof json === 'string') {
        throw new Error('Cannot update with invalid JSON');
      }
      const res = await fetch(`http://localhost:4000/cadences/${cadenceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Cadence updated successfully!');
      } else {
        toast.error(data?.message || 'Failed to update cadence');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error: Invalid JSON format.');
    }
  };

  console.log(json)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 flex justify-between p-6 text-white flex items-center gap-4">
          <div>
            <div className=" p-2 rounded-lg">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Cadence Editor</h1>
              <p className="text-indigo-100 text-sm">Demo Interface</p>
            </div>
          </div>
          <button className="
    bg-white/10
    hover:bg-white/20
    cursor-pointer
    text-white
    px-4 py-2
    rounded-lg
    text-sm font-medium
    transition-all
    backdrop-blur-sm
    border border-white/20
    active:scale-[0.98]
  " onClick={() => router.push('/enrollments')}>Enrollments</button>
        </div>

        <div className="p-8 space-y-6">
          {/* ID Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Cadence ID</label>
            <div className="flex gap-2">
              <input
                placeholder="Enter Cadence ID (e.g. cad_123)"
                value={cadenceId}
                onChange={(e) => setCadenceId(e.target.value)}
                className="flex-1 px-4 py-2 border border-black text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                onClick={handleLoad}
                disabled={!cadenceId}
                className=" disabled:bg-gray-300
    disabled:text-gray-500
    disabled:shadow-none
    disabled:cursor-not-allowed
    disabled:hover:bg-gray-300
    disabled:active:scale-100 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
              >
                <Database className="w-4 h-4" />
                Load
              </button>
              <button
                disabled={!cadenceId}
                onClick={() => { setAction('create'); setJson({ ...dummyCadence, id: cadenceId }) }}
                className=" disabled:bg-gray-300
    disabled:text-gray-500
    disabled:shadow-none
    disabled:cursor-not-allowed
    disabled:hover:bg-gray-300
    disabled:active:scale-100 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
            </div>
          </div>

          {/* JSON Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Cadence Configuration (JSON)</label>
            <p className="text-xs text-gray-500 mt-1">
              Edit the JSON to define your cadence workflow steps (SEND_EMAIL, WAIT, etc.).
            </p>
            <div className="relative">
              <textarea
                rows={12}
                value={(typeof json === 'object' && json !== null) ? JSON.stringify(json, null, 2) : (json || '')}
                onChange={(e) => {
                  const value = e.target.value;
                  try {
                    const parsed = JSON.parse(value);
                    setJson(parsed);
                  } catch {
                    setJson(value);
                  }
                }}
                className="w-full p-4 bg-gray-900 text-indigo-300 font-mono text-sm rounded-xl border-none focus:ring-2 focus:ring-indigo-500/20 resize-none shadow-inner"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-[10px] text-gray-400 rounded uppercase font-bold tracking-widest">
                Raw JSON
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCreate}
              disabled={action !== 'create'}
              className="
    flex-1 flex items-center justify-center gap-2
    bg-indigo-600 hover:bg-indigo-700
    text-white px-6 py-2.5 rounded-lg font-semibold
    transition-all shadow-md shadow-indigo-100
    active:scale-[0.98]

    disabled:bg-gray-300
    disabled:text-gray-500
    disabled:shadow-none
    disabled:cursor-not-allowed
    disabled:hover:bg-gray-300
    disabled:active:scale-100
  "
            >
              <Play className="w-4 h-4" />
              Generate Workflow
            </button>
            <button
              // disabled={!action}
              onClick={handleUpdate}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-600 px-6 py-2.5 rounded-lg font-semibold transition-all active:scale-[0.98] 
    disabled:bg-gray-300
    disabled:text-gray-500
    disabled:shadow-none
    disabled:cursor-not-allowed
    disabled:hover:bg-gray-300
    disabled:active:scale-100"
            >
              <RefreshCw className="w-4 h-4" />
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}