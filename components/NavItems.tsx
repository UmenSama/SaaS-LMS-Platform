'use client';

// Import utility function for conditional class name merging
import { cn } from "@/lib/utils";
// Import Next.js Link component for client-side navigation
import Link from "next/link"
// Import hook to get current pathname for active link highlighting
import { usePathname } from "next/navigation";

// Define navigation items array with name and href properties
// This array contains all the main navigation links for the application
const navItems = [
    {name: "Home", href: "/"},
    {name: "Companions", href: "/companions"},
    {name: "My Journey", href: "/my-journey"},
]

// NavItems component - renders the main navigation menu
const NavItems = () => {
    // Get the current pathname to determine which link should be highlighted as active
    const pathname = usePathname();

  return (
    // Navigation container with flexbox layout and gap between items
    <nav className="flex items-center gap-4">
      {/* Map through each navigation item to render individual links */}
      {navItems.map((item) => (
        <Link 
        href={item.href} 
        key={item.name}
        // Apply conditional styling: if current pathname matches this link's href,
        // add "text-primary font-bold" classes to highlight the active link
        className={cn(pathname === item.href && "text-primary font-bold")}>
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

export default NavItems
