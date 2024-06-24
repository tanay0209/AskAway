import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<ApiResponse> {
    try {
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'speakout | Verification Code',
            react: VerificationEmail({ username, otp: verifycode })
        });
        return {
            success: true,
            message: "Sent verification email successfully."
        }
    } catch (emailError) {
        console.error("Error sending verification email ", emailError);
        return {
            success: false,
            message: "Failed to send verification email"
        }

    }
}