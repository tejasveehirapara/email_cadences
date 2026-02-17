'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, List, Plus, Eye, Send, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

export default function EnrollmentsPage() {
    const router = useRouter();

    const [cadenceId, setCadenceId] = useState('');
    const [cadences, setCadences] = useState([]);
    const [email, setEmail] = useState('');
    const [enrollments, setEnrollments] = useState([
    ]);

    useEffect(() => {
        handleGetCadences();
        handleGetEnrollments()
    }, []);

    const handleGetCadences = async () => {
        try {
            const response = await fetch('http://localhost:4000/cadences', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setCadences(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch cadences');
            }
        } catch (error) {
            toast.error('Network error while fetching cadences');
        }
    };

    const handleGetEnrollments = async () => {
        try {
            const response = await fetch('http://localhost:4000/enrollments', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setEnrollments(data);
            } else {
                toast.error('Failed to fetch enrollments');
            }
        } catch (error) {
            toast.error('Network error while fetching enrollments');
        }
    };

    const startEnrollment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cadenceId || !email) {
            toast.warning('Please select a cadence and enter an email');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cadenceId: cadenceId,
                    contactEmail: email
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Enrollment started successfully!');
                setEmail('');
                handleGetEnrollments();
            } else {
                toast.error(data.message || 'Failed to start enrollment');
            }

        } catch (error) {
            console.error('Failed to start enrollment:', error);
            toast.error('Network error while starting enrollment');
        }
    };


    console.log(cadences, "cadences")

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans transition-colors duration-500">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium text-sm transition-all mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Editor
                        </button>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Enroll <span className="text-indigo-600">Portal</span>
                        </h1>
                        <p className="text-slate-500 text-lg">Deploy contacts into your automated email cadences.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Creation Form Card */}
                    <div className="lg:col-span-5 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden transform transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">New Enrollment</h2>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-0.5">Contact Registration</p>
                            </div>
                        </div>
                        <form onSubmit={startEnrollment} className="p-8 space-y-6">
                            <div className="space-y-2.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Cadence Identity
                                </label>
                                <div className="relative group">
                                    <List className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <select
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 appearance-none cursor-pointer"
                                        value={cadenceId}
                                        onChange={(e) => setCadenceId(e.target.value)}
                                    >
                                        <option value="">Select a cadence...</option>
                                        {cadences.map((cad: any) => (
                                            <option key={cad.id} value={cad.id}>
                                                {cad.id}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Target Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        placeholder="user@example.com"
                                        type="email"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]"
                            >
                                <Send className="w-4 h-4" />
                                Activate Enrollment
                            </button>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="lg:col-span-7 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-100 rounded-xl">
                                    <List className="w-5 h-5 text-slate-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Active Enrollments</h2>
                            </div>
                            <span className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-full border border-slate-100">
                                {enrollments?.length} TOTAL
                            </span>
                        </div>
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
                                    <tr className="border-b border-slate-50">
                                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cadence</th>
                                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Recipient</th>
                                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {enrollments?.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-20">
                                                <div className="flex flex-col items-center justify-center text-slate-400 space-y-4">
                                                    <div className="p-4 bg-slate-50 rounded-full">
                                                        <Mail className="w-8 h-8 opacity-20" />
                                                    </div>
                                                    <p className="text-sm font-medium">No one enrolled yet. Start your first journey!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        enrollments.map((enr) => (
                                            <tr key={enr.id} className="hover:bg-indigo-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                        <span className="text-slate-700 font-bold text-sm bg-indigo-50/50 px-2.5 py-1 rounded-lg border border-indigo-100/50">
                                                            {enr.cadenceId}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-slate-600 text-sm font-medium">{enr.contactEmail}</span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => router.push(`/enrollments/${enr.cadenceId}`)}
                                                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-white font-bold text-xs transition-all px-5 py-2.5 rounded-xl hover:bg-indigo-600 border border-indigo-100 hover:border-transparent group-hover:shadow-lg group-hover:shadow-indigo-100"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        VIEW STATUS
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}