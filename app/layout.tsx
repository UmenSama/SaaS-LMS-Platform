import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mentora",
  description: "Real-time AI Teaching Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en">
        <body className={`${bricolage.variable} antialiased`}>
          <ClerkProvider appearance = {{variables:{
            colorPrimary: '#fe5933'}}}> { /* wrapped our application around the lerk Provider*/ }
            <Navbar />
            {children}
          </ClerkProvider>
          
        </body>
      </html>
  );
}
