import { Button } from '@/components/ui/button'
import React from 'react'
import { UniverseButton } from "../components/UniverseButton";

const Page = () => {
  return (
    <div>
      <h1 className='text-3xl font-bold underline'>Hello World</h1>
      <Button>Click me Bitch</Button>
      <UniverseButton />
    </div>
  )
}

export default Page