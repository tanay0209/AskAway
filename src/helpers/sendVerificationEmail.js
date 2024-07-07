import nodemailer from 'nodemailer';
import VerificationEmail from '../../emails/VerificationEmail';


export async function sendVerificationEmail(
    email,
    username,
    verifycode
) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: 'askaway.contact.info@gmail.com',
            to: email,
            subject: 'AskAway | Verification Code',
            html: VerificationEmail({ username, otp: verifycode }),
        });

        console.log('Message sent: %s', info);

        return {
            success: true,
            message: 'Sent verification email successfully.',
        };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            success: false,
            message: 'Failed to send verification email',
        };
    }
}
