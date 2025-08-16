import Image from 'next/image'
import Link from 'next/link'
import NavItems from './NavItems'
import {SignInButton, SignedIn,SignedOut, UserButton} from '@clerk/nextjs';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image
            src="/images/image.png"
            alt="logo"
            width={46}
            height={44}
          />
        </div>
      </Link>
      <div className = "flex items-center gap-8">
        <NavItems />
    
        <SignedOut> {/* if user is not signed in, show sign in button */}
                <SignInButton>
                <button className ='btn-signin'>
                    Sign In
                </button>
                </SignInButton>
        </SignedOut>
        <SignedIn> {/* if user is signed in, show user button */}
            <UserButton afterSignOutUrl='/' />
        </SignedIn>
    </div>
      
    </nav>
  )
}

export default Navbar
