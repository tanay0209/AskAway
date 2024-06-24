import dbConnect from '@/lib/dbConnection';
import UserModel from '@/model/User';
import { UsernameQuerySchema } from '../check-accepting-status/route';

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
        const username = result.data.username
        const user = await UserModel.aggregate([
            { $match: { username: username } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]).exec()
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            messages: user[0]?.messages
        }, { status: 200 })
    } catch (error) {
        return Response.json({ success: false, message: "Unable to fetch messages" }, { status: 500 })
    }
}