import dbConnect from '@/lib/dbConnection';
import UserModel from '@/model/User';
import { User, getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import mongoose from 'mongoose';

export async function GET() {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const _user: User = session?.user as User


    if (!session || !session.user) {
        console.log(session);
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(_user._id)

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
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