// app/auth/page.jsx

'use client'
import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'

function Login() {


    //Used to Sign In with Google
    const singInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) console.log('Error: ', error.message)
    }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen'>
        <div className='flex flex-col justify-center items-center border rounded-2xl p-8'>
            <Image src={'/logo.png'} alt="logo" width={400} height={180}/>
            <div className='flex items-center flex-col gap-4 '>
                <Image src={'/login.png'} alt="login" width={400} height={400} 
                className='w-[400px] h-[250px] rounded-2xl'
                />
                <h2 className='text-2xl font-bold text-center mt-5'>Welcome to AICruiter</h2>
                <p className='text-gray-500 text-center'>Sign In With Google Authentication</p>

                <Button className='mt-7 w-full'
                onClick={singInWithGoogle}>Login with Google</Button>
            </div>
        </div>
    </div>
  )
}

export default Login