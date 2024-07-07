// Assuming this is in VerificationEmail.tsx or a similar file

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps): string {
    return `
        <html lang="en">
        <head>
            <title>Verification Code</title>
            <style>
                /* Add any necessary styles here */
                body {
                    font-family: 'Roboto', Verdana, sans-serif;
                    line-height: 1.6;
                }
            </style>
        </head>
        <body>
            <h2>Hello ${username},</h2>
            <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
            <p>${otp}</p>
            <p>If you did not request this code, please ignore this email.</p>
        </body>
        </html>
    `;
}
