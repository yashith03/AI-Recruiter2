// app/page.js

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className='p-10'>
      <h2>Subscribe to yashith</h2>

      <Link href="/auth">
        <Button className="mt-4">Login</Button>
      </Link>
    </div>
  )
}
