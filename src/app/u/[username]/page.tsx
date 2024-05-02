'use client'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { useChat } from 'ai/react'


function PublicPage() {
    const [acceptingMsg, setAcceptingMsg] = useState<boolean>(true)
    const { username } = useParams()
    const { toast } = useToast()
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset } = useForm<z.infer<typeof messageSchema>>({ resolver: zodResolver(messageSchema) })
    const delimiter = "||"
    const initalMessage = "What's a dream destination you've always wanted to visit?||If you could learn any skill instantly, what would it be and why?||What's a book or movie that has profoundly impacted your perspective on life?"
    const { messages, isLoading, handleSubmit: promptSubmit, error } = useChat({ api: '/api/suggest-messages', initialInput: initalMessage });
    const parseString = (messageString: string): string[] => {
        return messageString.split(delimiter)
    }

    const fetchStatus = async () => {
        try {
            const response = await axios.get<ApiResponse>('/api/check-accepting-status', { params: { username } })
            if (response.status !== 200) {
                throw new Error("Not able to fetch message settings")
            }
            setAcceptingMsg(response.data.isAcceptingMessages!)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to fetch message settings',
                variant: 'destructive',
            });
        }
    }

    const handleMessageClick = (message: string) => {
        setValue("content", message)
    }

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            const response = await axios.post('/api/send-message', {
                username,
                content: data.content
            })
            if (response.status !== 200) {
                throw new Error("Not able to send message")
            }
            console.log(response);
            toast({
                title: "Success",
                description: "Message sent successfully"
            })
            reset()
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to fetch message settings',
                variant: 'destructive',
            });
        }

    }

    useEffect(() => {
        fetchStatus()
    }, [username, acceptingMsg, messages])

    return (
        <div className="md:max-w-4xl max-w-md  mx-auto mt-8 p-8">
            <h1 className="text-4xl font-bold text-center">Public Profile Link</h1>
            <div className="mt-8">
                <h3>Send Anonymous Message to @{username}</h3>
                <form
                    className="flex flex-col"
                    onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                        {...register('content', {
                            minLength: 10
                        })}
                        rows={5}
                        placeholder="Write your anonymous message here"
                        className="w-full mt-2 rounded-md focus:ring-0 focus:ring-offset-0 focus:outline-0 border-2 p-2 resize-none"
                    />
                    {errors.content && <p className="text-red-400">{errors.content.message}</p>}
                    <Button
                        disabled={!acceptingMsg}
                        type="submit"
                        className="mt-4"
                    >
                        {isSubmitting ? 'Sending your message' : 'Send message'}
                    </Button>
                </form>
                {acceptingMsg ? <></> : <p className="text-red-400">{username} is not accepting messages currently.</p>}
            </div>
            <div className="flex flex-col space-y-4 mt-8">
                <form onSubmit={promptSubmit}>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-40">Suggest Message</Button>
                </form>
                <p>Click on any message to select it.</p>
                <div className="border rounded-md p-4">
                    <h3
                        className="font-semibold text-2xl"
                    >Messages</h3>
                    {error && <p>Something went wrong while fetching suggestions</p>}

                    {messages.length === 0 ? (
                        <>
                            <ul className="mt-4 space-y-4">
                                {parseString(initalMessage).map((message, index) => {
                                    return <li
                                        key={index}
                                        onClick={() => handleMessageClick(message)}
                                        className="border hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                                        <p>{message}</p>
                                    </li>
                                })}
                            </ul>
                        </>) : <>{isLoading ?
                            <div className="mt-4 text-center text-xl">
                                Loading Suggestions
                            </div> : <>{!error && <ul className="mt-4 space-y-4">
                                {parseString(messages[1]['content']).map((message, index) => {
                                    return <li
                                        key={index}
                                        onClick={() => handleMessageClick(message)}
                                        className="border hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                                        <p>{message}</p>
                                    </li>
                                })}
                            </ul>}</>}</>}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-8 space-y-4">
                <h3>Get Your Message Board</h3>
                <Link
                    href='/sign-up'
                >
                    <Button
                    >Create Your Account</Button>
                </Link>
            </div>
        </div>
    )
}

export default PublicPage