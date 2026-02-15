export async function sendEmailActivity(input: {
    to: string,
    subject: string,
    body: string
}) {
    return {
           success: true,
    messageId: Math.random(),
    timestamp: Date.now(),

    }
}