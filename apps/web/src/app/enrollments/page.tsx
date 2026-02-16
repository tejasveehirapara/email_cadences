'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EnrollmentsPage() {
    const router = useRouter();

    const [cadenceId, setCadenceId] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const startEnrollment = () => {
        if (!cadenceId || !email) {
            setMessage('❌ Fill all fields');
            return;
        }

        const dummyEnrollmentId = 'enr_' + Math.floor(Math.random() * 10000);

        setMessage(`✅ Enrollment Started: ${dummyEnrollmentId}`);

        // Navigate to status page
        router.push(`/enrollments/${dummyEnrollmentId}`);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Start Enrollment</h1>

            <input
                placeholder="Cadence ID"
                value={cadenceId}
                onChange={(e) => setCadenceId(e.target.value)}
            />

            <br /><br />

            <input
                placeholder="Contact Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <button onClick={startEnrollment}>Start Enrollment</button>

            <p>{message}</p>
        </div>
    );
}