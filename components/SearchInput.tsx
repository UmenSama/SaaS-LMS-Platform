'use client'
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import React, { useEffect, useState } from 'react'

const SearchInput = () => {
    const pathname = usePathname(); //gets the current URL path. Useful for conditional rendering or routing logic based on the current page.
    const router = useRouter(); //Gives you access to programmatic navigation. can do things like   1. router.push('/companions?topic=math');     2.  router.replace('/dashboard');
    const searchParams = useSearchParams(); 
    const query = searchParams.get('topic') || '';  // Safely extracts the topic value from the URL.

    const [searchQuery,setSearchQuery] = useState(query);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            if (searchQuery) {
                params.set('topic', searchQuery);
            } else {
                params.delete('topic');
            }
            
            router.push(`${pathname}?${params.toString()}`);
        }, 300); // 300ms debounce to prevent routing at every keystroke

        return () => clearTimeout(timeoutId);
    }, [searchQuery, router, pathname, searchParams]);

  return (
    <div className="relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit">
      <Image src="/icons/search.svg" alt="search" width={15} height={15} />
      
      <input
        placeholder="Search companions..."
        className = "outline-none"
        value = {searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
    </div>
  )
}

export default SearchInput
