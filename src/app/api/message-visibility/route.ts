import dbConnect from "@/lib/dbConnection";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()
    const { id } = await request.json()
    const session = await getServerSession(authOptions)
    const _user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    const userId = new mongoose.Types.ObjectId(_user._id)
    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }
        const message = user.messages.find(message => message._id.toString() === id)
        if (!message) {
            return Response.json({
                success: false,
                message: "Message not found"
            }, { status: 401 })
        }
        message.visibility = !message.visibility

        await user.save()
        return Response.json({
            success: true,
            message: " Visibility updated successfully"
        }, {
            status: 200
        })

    } catch (error) {
        return Response.json({ success: false, message: "Unable to update visibility" }, { status: 500 })
    }
}