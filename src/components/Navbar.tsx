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
            <div className='md:container mx-auto flex flex-row justify-between items-center'>
                <a
                    className='md:text-xl text-lg font-bold'
                    href="/">SpeakOut </a>
                {
                    session ? (
                        <Button
                            className=''
                            onClick={() => signOut()}>Log out</Button>
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