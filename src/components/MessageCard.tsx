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
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
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
            content: ''
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
        <div className="border border-gray-200 py-2 px-4 rounded-sm flex flex-col justify-between shadow-md">
            <div>
                <div className='flex justify-end gap-2 items-center'>
                    {visibility ? <button
                        onClick={() => changeMessageVisibility(_id)}
                        className='text-lg'
                    >
                        <FiEye />
                    </button> :
                        <button
                            onClick={() => changeMessageVisibility(_id)}
                            className='text-lg'
                        >
                            <FiEyeOff />
                        </button>}
                    {/* <button
                        className='text-lg'
                    >
                        <IoIosShareAlt />
                    </button> */}
                </div>
                <p className="break-words font-bold">{content}</p>
                {answer ? <p className="text-justify text-gray-500 my-2">Ans: {answer}</p> : <p>Ans: You have not answered yet!</p>}
            </div>
            <div className="flex w-full justify-between gap-2 mt-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <p className="border border-gray-200 p-2 rounded-md w-1/2 items-center justify-center flex bg-red-500 text-white hover:bg-red-700 cursor-pointer">Delete</p>
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
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild >
                        <p
                            className="border border-gray-200 p-2 rounded-md w-1/2 items-center justify-center flex cursor-pointer hover:bg-black hover:text-white">Answer</p>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Msg. {content}</AlertDialogTitle>
                            <AlertDialogDescription>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        <FormField
                                            name="content"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <textarea
                                                            style={{ resize: "none" }}
                                                            className='p-2 mt-2 w-full border border-gray-300  rounded-sm outline-none focus:ring-0 focus:ring-offset-0'
                                                            placeholder="Add your answer here"
                                                            rows={5}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className='w-full'
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? <>
                                                <Loader2
                                                    className="mr-2 h-4 w-4 animate-spin"
                                                /> Please wait
                                            </> : "Save"}
                                        </Button>
                                    </form>
                                </Form>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                className='w-full'
                            >Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>

    )
}

export default MessageCard