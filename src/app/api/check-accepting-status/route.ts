import dbConnect from "@/lib/dbConnection"
import UserModel from "@/model/User"
import { usernameValidation } from "@/schemas/signupSchema"
import * as z from 'zod'

const UsernameQuerySchema = z.object({
    username: usernameValidation
})
export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParam)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid query Parameters"
            },
                { status: 400 })
        }
        const { username } = result.data
        const user = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "Not able to find the user"
            },
                { status: 400 })
        }
        const messageStatus = user.isAcceptingMessage
        return Response.json({
            success: true,
            message: "User is accepting messages",
            isAcceptingMessages: messageStatus
        }, { status: 200 })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Something went wrong while retrieving status"
        }, { status: 500 })
    }
}