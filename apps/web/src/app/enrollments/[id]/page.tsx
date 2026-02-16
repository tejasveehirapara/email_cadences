'use client';

import { useEffect, useState } from 'react';

export default function EnrollmentStatusPage({ params }: any) {
    const { id } = params;

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
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Enrollment Status</h1>

            <p><b>ID:</b> {id}</p>
            <p><b>Status:</b> {state.status}</p>
            <p><b>Current Step:</b> {state.currentStepIndex}</p>
            <p><b>Steps Version:</b> {state.stepsVersion}</p>

            <br />

            <button onClick={updateCadence}>Update Cadence (Dummy Signal)</button>
        </div>
    );
}