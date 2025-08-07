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

 export const getAllCompanions = async({limit=10,page=1, subject, topic, includeBookmarks=false}:GetAllCompanions)=>{
  const supabase= createSupabaseClient();
  const {userId} = await auth();

  let query = supabase.from('companions').select();

  if (subject && topic){
    query = query.ilike('subject', `%${subject}%`)
    .or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`)
  }else if(subject){
    query = query.ilike('subject', `%${subject}%`)
  }else if(topic){
    query = query.or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`)
  }

    query=query.range((page-1)*limit, page*limit-1); //pagination 

    const {data: companions, error} = await query; 
    //	above line does these 3 things 
    // 1.	query.data → assigned to a new variable called companions
    //2.	query.error → assigned to a variable error
    //3.	Awaits the query from Supabase
    if(error) throw new Error(error.message);

    // If includeBookmarks is true and user is authenticated, add bookmark status
    if (includeBookmarks && userId && companions.length > 0) {
      // Get all bookmarks for this user for the returned companions
      const companionIds = companions.map(c => c.id);
      const {data: bookmarks} = await supabase
        .from('bookmarks')
        .select('companion_id')
        .eq('user_id', userId)
        .in('companion_id', companionIds);

      const bookmarkedIds = new Set(bookmarks?.map(b => b.companion_id) || []);
      
      return companions.map(companion => ({
        ...companion,
        isBookmarked: bookmarkedIds.has(companion.id)
      }));
    }

    return companions;
}

 export const getCompanion = async (id: string)=>{
    const supabase = createSupabaseClient();

    const {data,error} = await supabase
    .from('companions')
    .select()
    .eq('id',id);

    if (error) return console.log(error);

      return data[0];

 }

 export const addToSessionHistory = async (companionId:string)=>{
    const {userId} = await auth();
    const supabase = createSupabaseClient();
    const {data,error} = await supabase.from('session_history')
      .insert({
          companion_id: companionId,
          user_id: userId,
      })

    if(error) throw new Error(error.message);

    return data
 }

 export const getRecentSessions = async (limit=10)=>{
    const supabase = createSupabaseClient();
    const {data,error} = await supabase
      .from('session_history')
      .select('companions: companion_id(*)')
      .order('created_at', {ascending: false})
      .limit(limit)

    if(error) throw new Error(error.message)

    return data.map(({companions})=> companions)
 }


 export const getUserSessions = async (userId: string ,limit=10)=>{
  const supabase = createSupabaseClient();
  const {data,error} = await supabase
    .from('session_history')
    .select('companions: companion_id(*)')
    .eq('user_id',userId)
    .order('created_at', {ascending: false})
    .limit(limit)

  if(error) throw new Error(error.message)

  return data.map(({companions})=> companions) 
  //Input: [{companions: {...}}, {companions: {...}}]
  //Output: [{...}, {...}]
}


export const getUserCompanions = async (userId: string ,limit=10)=>{
  const supabase = createSupabaseClient();
  const {data,error} = await supabase
    .from('companions')
    .select()
    .eq('author',userId)
    

  if(error) throw new Error(error.message)

  return data
}

export const newCompanionPermissions = async()=>{
  const {userId, has} = await auth()
  const supabase= createSupabaseClient();

  let limit=0;

  if(has({plan:'pro'})){
    return true;
  }else if(has({feature: '3_companion_limit'})){
    limit=3;
  }else if(has({feature: '10_companion_limit'})){
    limit=10;
  }

  const {data, error} = await supabase
  .from('companions')
  .select('id', {count:'exact'})
  .eq('author', userId)


if (error) throw new Error(error.message);

const companionCount = data?.length;

  if (companionCount>=limit){
    return false;
  }else{
    return true;
    
  }

}

// Bookmark functions
export const toggleBookmark = async (companionId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  
  const supabase = createSupabaseClient();

  // Check if bookmark already exists
  const { data: existingBookmark, error: checkError } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('companion_id', companionId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error(checkError.message);
  }

  if (existingBookmark) {
    // Remove bookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('companion_id', companionId);

    if (error) throw new Error(error.message);
    return { bookmarked: false };
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        companion_id: companionId,
      });

    if (error) throw new Error(error.message);
    return { bookmarked: true };
  }
};

export const getUserBookmarks = async (userId: string) => {
  const supabase = createSupabaseClient();

  // First get the companion IDs that are bookmarked by this user
  const { data: bookmarkData, error: bookmarkError } = await supabase
    .from('bookmarks')
    .select('companion_id')
    .eq('user_id', userId);

  if (bookmarkError) throw new Error(bookmarkError.message);

  if (!bookmarkData || bookmarkData.length === 0) {
    return [];
  }

  // Get the companion details for the bookmarked companion IDs
  const companionIds = bookmarkData.map(b => b.companion_id);
  const { data: companions, error: companionError } = await supabase
    .from('companions')
    .select('id, name, subject, topic, duration')
    .in('id', companionIds);

  if (companionError) throw new Error(companionError.message);

  return companions || [];
};

export const checkIfBookmarked = async (companionId: string) => {
  const { userId } = await auth();
  if (!userId) return false;
  
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('companion_id', companionId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  return !!data;
};
