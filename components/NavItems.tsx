'use client';

import { cn } from "@/lib/utils";
import Link from "next/link"
import { usePathname } from "next/navigation";

const navItems = [
    {name: "Home", href: "/"},
    {name: "Companions", href: "/companions"},
    {name: "My Journey", href: "/my-journey"},
]

const NavItems = () => {

    const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4">
      {navItems.map((item) => (
        <Link 
        href={item.href} 
        key={item.name}
        className={cn(pathname === item.href && "text-primary font-bold")}>
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

export default NavItems
