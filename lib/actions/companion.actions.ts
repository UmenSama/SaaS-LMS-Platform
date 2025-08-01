"use server" //The 'use server' directive tells Next.js that this code should only run on the server, not in the browser.

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

 export const createCompanion = async (formData: CreateCompanion)=>{
    const {userId: author} = await auth();// This renames userId to author
    const supabase = createSupabaseClient();

    const {data,error} = await supabase
    .from("companions")
    .insert({...formData, author})
    .select();
    if(error || !data) throw new Error("Failed to create companion");

    return data[0];
 }

 /*
 So, at runtime, an example formData object might look like:
 {
  name: "Study Buddy",
  subject: "Math",
  topic: "Derivatives and Integrals",
  voice: "female",
  style: "casual",
  duration: 15
}

const { userId: author } = await auth(); is doing 2 things:
1. It's getting the current user's ID from Clerk auth
2. It's renaming the userId to author for clarity.

Then you’re inserting this into Supabase with the additional author field from Clerk auth:

  {
  name: "Study Buddy",
  subject: "Math",
  topic: "Derivatives and Integrals",
  voice: "female",
  style: "casual",
  duration: 15,
  author: "user_xyz123"
} 
 */