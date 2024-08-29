'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
import { Message } from "@/model/User"
import { useToast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { ApiError } from "next/dist/server/api-utils"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { answerSchema } from "@/schemas/answerSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FiEye, FiTrash2, FiEyeOff } from "react-icons/fi"
import { IoIosShareAlt } from "react-icons/io";

type MessageCardProps = {
    username: String,
    message: Message;
    onMessageDelete: (messageId: string) => void
}

function MessageCard({ username, message, onMessageDelete }: MessageCardProps) {
    const { content, _id, answer, visibility } = message
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof answerSchema>>({
        resolver: zodResolver(answerSchema),
        defaultValues: {
            content: answer || ''
        }
    })
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            if (response.status !== 200) {
                toast({
                    title: "Failed to delete the message"
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

    const onSubmit = async (data: z.infer<typeof answerSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/save-answer', {
                username,
                id: _id,
                answer: data.content
            })
            if (response.status !== 200) {
                throw new Error("Not able to save the answer")
            }
            toast({
                title: "Success",
                description: "Answer saved successfully"
            })
            form.reset()
            location.reload()

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to save message',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false)
        }

    }

    const changeMessageVisibility = async (messageId: String) => {
        try {
            const response = await axios.post('/api/message-visibility', {
                id: messageId
            })
            if (response.status !== 200) {
                throw new Error("Not able to update the visibility")
            }
            toast({
                title: "Update successful",
                description: "Visibility updated successfully"
            })
            location.reload()

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to save message',
                variant: 'destructive',
            });
        }
    }

    return (
        <div className="border border-gray-200 p-4 rounded-lg flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className='flex justify-between flex-col'>
                <div className='flex justify-end gap-2 items-center'>
                    {visibility ? <button
                        onClick={() => changeMessageVisibility(_id)}
                        className='text-lg text-blue-500 hover:text-blue-700'
                    >
                        <FiEye />
                    </button> :
                        <button
                            onClick={() => changeMessageVisibility(_id)}
                            className='text-lg text-gray-500 hover:text-gray-700'
                        >
                            <FiEyeOff />
                        </button>}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <FiTrash2 className='text-red-500 cursor-pointer' />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this message from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className='bg-red-500' onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <p className="break-words font-bold text-lg mb-4">{content}</p>
            </div>
            <div className="w-full mt-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center space-x-2">
                        <FormField
                            name="content"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <input
                                            type='text'
                                            className='p-2 w-full border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                                            placeholder={answer ? answer : "Add your answer here"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className='bg-black hover:bg-black/80 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 whitespace-nowrap'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Wait
                                </>
                            ) : "Save"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default MessageCard