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
        <nav className='p-4 fixed top-0 left-0 right-0 flex items-center w-full text-black bg-opacity-80 backdrop-blur-md h-16 gap-8 shadow-md z-50'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link
                    className='md:text-xl text-lg font-bold'
                    href="/">AskAway </Link>
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
