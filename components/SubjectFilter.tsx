'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjects } from '@/constants'

const SubjectFilter = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSubject = searchParams.get('subject') || ''

  const handleSubjectChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'all') {
      params.delete('subject')
    } else {
      params.set('subject', value)
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      <Select value={currentSubject || 'all'} onValueChange={handleSubjectChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          {subjects.map((subject) => (
            <SelectItem key={subject} value={subject} className="capitalize">
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SubjectFilter
