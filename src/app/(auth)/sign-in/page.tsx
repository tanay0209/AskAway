'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { signinSchena } from '@/schemas/signinSchema'
import { zodResolver } from '@hookform/resolvers/zod'

import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"


function page() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof signinSchena>>({
        resolver: zodResolver(signinSchena),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signinSchena>) => {
        setIsSubmitting(true)
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        if (result?.error) {
            toast({
                title: "Login Failed",
                description: "Incorrect username or password",
                variant: "destructive"
            })
            setIsSubmitting(false)
        }
        if (result?.url) {
            setIsSubmitting(false)
            router.replace("/dashboard")
        }
    }
    return (
        <div
            className="flex justify-center items-center min-h-screen bg-gray-100"
        >
            <div
                className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
                    <p className="mb-4">Sign in to start your journey</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username/Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username/Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <>
                                <Loader2
                                    className="mr-2 h-4 w-4 animate-spin"
                                /> Please wait
                            </> : "Sign In"}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        New User?{' '}
                        <Link
                            href='/sign-up'
                            className="text-blue-600 hover:text-blue-800"
                        >Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page