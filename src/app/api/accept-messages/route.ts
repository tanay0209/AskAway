import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }
    const userId = user._id
    const { acceptMessage } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessage }, { new: true })

        if (!updatedUser) {
            return Response.json({ success: false, message: "Failed to update accepting message settings" }, { status: 401 })
        }
        return Response.json({ success: true, message: "Updated accepting message settings" }, { status: 200 })
    } catch (error) {
        console.log("Failed to update accepting message settings");
        return Response.json({ success: false, message: "Failed to update accepting message settings" }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }

    const userId = user._id

    try {

        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 40 })
        }

        return Response.json({ success: true, isAcceptingMessage: foundUser.isAcceptingMessage }, { status: 200 })

    } catch (error) {
        console.log("Failed to find accepting message settings");
        return Response.json({ success: false, message: "Failed to find accepting message settings" }, { status: 500 })
    }
}