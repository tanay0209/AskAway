import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import mongoose from "mongoose";


export async function POST(request: Request) {

    await dbConnect()
    const { id, username, answer } = await request.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        const messageIndex = user.messages.findIndex(message => message._id.toString() === id)
        let message = user.messages[messageIndex]
        message.answer = answer
        user.save()
        return Response.json({
            success: true,
            message: "Message sent"
        }, { status: 200 })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Not able to send message"
        }, { status: 500 })
    }
}