'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Activity,
    RefreshCw,
    CircleDashed,
    Save,
    Settings2
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Step {
    id: string;
    type: string;
    subject?: string;
    body?: string;
    seconds?: number;
}

interface EnrollmentData {
    id: string;
    cadenceId: string;
    contactEmail: string;
    status: string;
    currentStepIndex: number;
    stepsVersion: number;
    steps: Step[];
}

export default function EnrollmentStatusPage({ params: paramsPromise }: any) {
    const params: any = use(paramsPromise);
    const { id } = params;
    const router = useRouter();

    const [state, setState] = useState<EnrollmentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [stepsJson, setStepsJson] = useState('');
    const [updating, setUpdating] = useState(false);

    const handleGetEnrollmentStatus = async () => {
        try {
            const res = await fetch(`http://localhost:4000/enrollments/${id}`);
            const data = await res.json();
            if (res.ok) {
                setState((prev) => {
                    if (!prev) {
                        setStepsJson(JSON.stringify(data.steps, null, 2));
                    }
                    return data;
                });
            } else {
                toast.error('Failed to load enrollment status');
            }
        } catch (error) {
            console.error('Error fetching enrollment:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!id) return;

        handleGetEnrollmentStatus();

        if (state?.status === 'COMPLETED') return;

        const interval = setInterval(handleGetEnrollmentStatus, 3000);

        return () => clearInterval(interval);
    }, [id, state?.status]);

    const handleUpdateCadence = async () => {
        setUpdating(true);
        try {
            const steps = JSON.parse(stepsJson);
            const res = await fetch(`http://localhost:4000/enrollments/${id}/update-cadence`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ steps }),
            });

            if (res.ok) {
                toast.success('Cadence steps updated successfully');
                handleGetEnrollmentStatus();
            } else {
                const error = await res.json();
                toast.error(error.message || 'Failed to update cadence');
            }
        } catch (error) {
            toast.error('Invalid JSON format for steps');
            console.error('Error updating cadence:', error);
        } finally {
            setUpdating(false);
        }
    };

    const forceRefresh = () => {
        handleGetEnrollmentStatus();
        toast.info('Status updated');
    };

    const getStepTitle = (step: Step) => {
        switch (step.type) {
            case 'SEND_EMAIL': return 'Send Email';
            case 'WAIT': return 'Delay';
            default: return step.type;
        }
    }

    const getStepDescription = (step: Step) => {
        switch (step.type) {
            case 'SEND_EMAIL': return step.subject || 'New Message';
            case 'WAIT': return `Wait for ${step.seconds || 0} seconds`;
            default: return '';
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-slate-500 font-medium">Loading your journey...</p>
                </div>
            </div>
        );
    }

    if (!state) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans p-8">
                <div className="text-center space-y-4">
                    <div className="p-4 bg-red-50 text-red-500 rounded-full inline-block">
                        <ArrowLeft className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Enrollment Not Found</h2>
                    <button onClick={() => router.push('/enrollments')} className="text-indigo-600 font-medium hover:underline">
                        Return to Enrollments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Navigation */}
                <button
                    onClick={() => router.push('/enrollments')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium text-sm transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Enrollments
                </button>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Main Status Card */}
                    <div className="flex-1 w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl shadow-sm ${state.status === 'COMPLETED' ? 'bg-emerald-500 shadow-emerald-100' : 'bg-indigo-600 shadow-indigo-100'
                                    }`}>
                                    {state.status === 'COMPLETED' ? (
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    ) : (
                                        <Activity className="w-6 h-6 text-white animate-pulse" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">Enrollment Journey</h1>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">ID: {id}</p>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border tracking-wide ${state.status === 'COMPLETED'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                                }`}>
                                {state.status}
                            </div>
                        </div>

                        <div className="p-8 space-y-10">
                            {/* Stepper */}
                            <div className="relative">
                                <div className="absolute left-[19px] top-0 bottom-4 w-0.5 bg-slate-100"></div>
                                <div className="space-y-8 relative">
                                    {state.steps?.map((step: Step, index: number) => {
                                        const isCompleted = index < state.currentStepIndex || state.status === 'COMPLETED';
                                        const isCurrent = index === state.currentStepIndex && state.status !== 'COMPLETED';

                                        return (
                                            <div key={index} className="flex gap-6 items-start group">
                                                <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-sm transition-all duration-500 ${isCompleted ? 'bg-emerald-500 text-white' :
                                                    isCurrent ? 'bg-indigo-600 text-white' :
                                                        'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    ) : isCurrent ? (
                                                        <Clock className="w-5 h-5 animate-spin-slow" />
                                                    ) : (
                                                        <span className="text-sm font-bold">{index + 1}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 pt-1.5">
                                                    <h3 className={`font-bold transition-colors ${isCompleted ? 'text-slate-800' :
                                                        isCurrent ? 'text-indigo-600' :
                                                            'text-slate-400'
                                                        }`}>
                                                        {getStepTitle(step)}
                                                    </h3>
                                                    <p className="text-sm text-slate-400 mt-1 font-medium">{getStepDescription(step)}</p>
                                                </div>
                                                {isCurrent && (
                                                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Extra Metadata */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Configuration</p>
                                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                                        <CircleDashed className="w-4 h-4 text-indigo-500" />
                                        step version: {state.stepsVersion}
                                    </div>
                                </div>

                            </div>

                            <button
                                onClick={forceRefresh}
                                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 font-semibold text-sm transition-all py-4 rounded-2xl border-2 border-dashed border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 active:scale-[0.99]"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Force Refresh Status
                            </button>
                        </div>
                    </div>

                    {/* Editor Card */}
                    <div className="flex-1 w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-xl">
                                    <Settings2 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Cadence Steps (JSON)</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="relative group">
                                <textarea
                                    value={stepsJson}
                                    onChange={(e) => setStepsJson(e.target.value)}
                                    className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-slate-300 rounded-2xl border-2 border-slate-100 focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all resize-none shadow-inner"
                                    spellCheck={false}
                                />
                                <div className="absolute top-4 right-4 px-2 py-1 bg-slate-800 text-[10px] font-bold text-slate-500 rounded uppercase tracking-widest border border-slate-700">
                                    JSON
                                </div>
                            </div>

                            <button
                                onClick={handleUpdateCadence}
                                disabled={updating || state.status === 'COMPLETED'}
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-slate-200 hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
                            >
                                {updating ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                )}
                                {updating ? 'Updating Cadence...' : 'Update Cadence Steps'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}