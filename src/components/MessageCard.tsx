'use client'

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { ApiError } from "next/dist/server/api-utils"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const { toast } = useToast()
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            if (response.status !== 208) {
                toast({
                    title: "Failed to delte the message"
                })
                return
            }
            toast({
                title: response.data.message
            })
            onMessageDelete(message._id)
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Not able to delete the message",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><X className="w-5 h-5" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                message and remove the message from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
        </Card>

    )
}

export default MessageCard