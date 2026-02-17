'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Activity,
    RefreshCw,
    ChevronRight,
    CircleDashed
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function EnrollmentStatusPage({ params: paramsPromise }: any) {
    const params: any = use(paramsPromise);
    const { id } = params;
    const router = useRouter();

    const [state, setState] = useState({
        status: 'RUNNING',
        currentStepIndex: 0,
        stepsVersion: 1,
    });

    // Dummy workflow progress simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setState((prev) => {
                if (prev.currentStepIndex >= 3) {
                    return { ...prev, status: 'COMPLETED' };
                }

                return {
                    ...prev,
                    currentStepIndex: prev.currentStepIndex + 1,
                };
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const updateCadence = () => {
        setState((prev) => ({
            ...prev,
            stepsVersion: prev.stepsVersion + 1,
        }));
        toast.info('Sync signal triggered successfully');
    };

    const steps = [
        { title: 'Initial Contact', description: 'First email dispatched' },
        { title: 'Follow-up A', description: 'Wait for 2 days' },
        { title: 'Value Prop', description: 'Case study shared' },
        { title: 'Closing', description: 'Final call to action' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Navigation */}
                <button
                    onClick={() => router.push('/enrollments')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium text-sm transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Enrollments
                </button>

                {/* Main Status Card */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
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
                                {steps.map((step, index) => {
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
                                                    {step.title}
                                                </h3>
                                                <p className="text-sm text-slate-400 mt-1 font-medium">{step.description}</p>
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
                                    v{state.stepsVersion}.0.2
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
                                <div className="flex items-center gap-2 text-slate-700 font-bold">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    Just now
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={updateCadence}
                            className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 font-semibold text-sm transition-all py-4 rounded-2xl border-2 border-dashed border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 active:scale-[0.99]"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Trigger Sync Signal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}