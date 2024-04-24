import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()


    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "User does not exists"
            }, { status: 500 })
        }

        const isValidCode = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isValidCode && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "User verified"
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code Expired please sign up again"
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect Verification Code"
            }, { status: 400 })
        }
    } catch (error) {
        console.error("Unable to verify user ", error);
        return Response.json({
            success: false,
            message: "Unable to verify user"
        }, { status: 500 })
    }
}