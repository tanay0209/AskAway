'use client'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from "next-auth"
import Link from 'next/link'
import { Button } from './ui/button'


function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user as User
    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a
                    className='text-xl font-bold mb-4 md:mb-0'
                    href="/">Mystery Message</a>
                {
                    session ? (
                        <div className='w-full flex items-center justify-between'>
                            <div
                                className='mr-4'
                            >Welcome, {user?.username}</div>
                            <Button
                                className=''
                                onClick={() => signOut()}>Log out</Button>
                        </div>
                    ) : (
                        <Link href='/sign-in' >
                            <Button
                                className='w-full md:m-auto'
                            >Login</Button>
                        </Link>
                    )
                }
            </div >
        </nav >
    )
}

export default Navbar