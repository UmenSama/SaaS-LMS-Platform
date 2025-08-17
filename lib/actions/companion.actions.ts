"use server"; // Ensures this module is treated as a Server Action file in Next.js (runs only on the server)

// Clerk server-side auth helper. We only ever call this on the server (safe to access cookies/session).
import { auth } from "@clerk/nextjs/server";
// Centralized Supabase client factory for server usage.
import { createSupabaseClient } from "@/lib/supabase";
// Next.js 14+ cache API: lets us invalidate a specific path so UI refreshes with latest data after mutations.
import { revalidatePath } from "next/cache";

/**
 * createCompanion
 * ---------------------------------------------
 * Inserts a new row into the `companions` table. The `author` field is taken
 * from the authenticated Clerk user (userId) and added to the payload.
 *
 * @param formData - The companion payload coming from the client (validated upstream)
 * @returns The inserted companion row (first element of the returning array)
 * @throws  Error with a friendly message when the insert fails
 *
 * Example shape of `formData` at runtime:
 * {
 *   name: "Study Buddy",
 *   subject: "Math",
 *   topic: "Derivatives and Integrals",
 *   voice: "female",
 *   style: "casual",
 *   duration: 15
 * }
 *
 * After attaching Clerk author:
 * {
 *   ...formData,
 *   author: "user_xyz123"
 * }
 */
export const createCompanion = async (formData: CreateCompanion) => {
  // Clerk: get the current authenticated user id and rename it to `author` to match our DB schema
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, author })
    .select(); // Return the inserted row(s)

  if (error || !data) throw new Error(error?.message || "Failed to create a companion");

  return data[0];
};

/**
 * getAllCompanions
 * ---------------------------------------------
 * Lists companions with optional fuzzy filters for `subject` and `topic` (also matches `name`).
 * Supports simple pagination via limit + page.
 *
 * @param limit  - number of rows per page (default 10)
 * @param page   - 1-based page index (default 1)
 * @param subject - optional case-insensitive filter on `subject`
 * @param topic   - optional case-insensitive filter on `topic` OR `name`
 * @returns An array of companion rows
 */
export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
  const supabase = createSupabaseClient();

  let query = supabase.from("companions").select().order('created_at', { ascending: false });

  // Compose filters. NOTE: Supabase `.or()` expects a comma-separated list of filters.
  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`); // match topic OR name
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  // Pagination: convert 1-based page → zero-based range indices
  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;
  if (error) throw new Error(error.message);

  return companions;
};

/**
 * getCompanion
 * ---------------------------------------------
 * Fetch a single companion by id.
 *
 * @param id - the companion's primary key
 * @returns The companion row (or undefined if not found)
 */
export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id);

  if (error) return console.log(error);
  return data?.[0];
};

/**
 * addToSessionHistory
 * ---------------------------------------------
 * Writes a new row to `session_history` connecting a user to a companion they interacted with.
 *
 * @param companionId - the companion id that was used
 * @returns The inserted `session_history` row(s)
 */
export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("session_history").insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);
  return data;
};

/**
 * getRecentSessions
 * ---------------------------------------------
 * Returns the most recent sessions across all users, joined with the full companion row.
 * Uses a foreign-table select syntax: `companions:companion_id (*)`.
 *
 * @param limit - max rows to return (default 10)
 * @returns Array of companion rows (flattened from the join)
 */
export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data.map(({ companions }) => companions);
};

/**
 * getUserSessions
 * ---------------------------------------------
 * Returns the most recent sessions for a specific user, joined with the full companion row.
 *
 * @param userId - the Clerk user id
 * @param limit  - max rows to return (default 10)
 * @returns Array of companion rows (flattened from the join)
 */
export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data.map(({ companions }) => companions);
};

/**
 * getUserCompanions
 * ---------------------------------------------
 * Fetch all companions authored by a specific user.
 *
 * @param userId - the Clerk user id who created the companions
 * @returns Array of companion rows
 */
export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId);

  if (error) throw new Error(error.message);
  return data;
};

/**
 * newCompanionPermissions
 * ---------------------------------------------
 * Gatekeeper for whether a user can create a new companion.
 * - Pro plan: unlimited (returns true immediately)
 * - Feature flags: either 3- or 10-companion limit
 * - Otherwise: default limit stays 0 → returns false when any companion exists
 *
 * NOTE: This uses a simple length check. If you prefer an authoritative count,
 * you can use `{ count: 'exact', head: true }` and read `count` instead.
 */
export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  let limit = 0;

  if (has({ plan: "pro" })) {
    return true; // Pro users bypass limits
  } else if (has({ feature: "3_companion_limit" })) {
    limit = 3;
  } else if (has({ feature: "10_companion_limit" })) {
    limit = 10;
  }

  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length ?? 0;
  return companionCount < limit; // true if under the cap
};

// ============================================================
// Bookmarks API
// ============================================================

/**
 * addBookmark
 * ---------------------------------------------
 * Creates a bookmark row for the current user against a given companion.
 * Revalidates a provided path so UI updates instantly after the mutation.
 *
 * @param companionId - the companion to bookmark
 * @param path        - a Next.js route path to revalidate (e.g., "/dashboard")
 */
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return; // Not signed in → silently do nothing (or throw if you prefer)

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Force the target path to re-render with fresh data (Server Components cache bust)
  revalidatePath(path);
  return data;
};

/**
 * removeBookmark
 * ---------------------------------------------
 * Deletes a bookmark row for the current user and companion.
 * Also revalidates the provided path.
 */
export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(path);
  return data;
};

/**
 * getBookmarkedCompanions
 * ---------------------------------------------
 * Returns the companion rows for a user's bookmarks by joining `bookmarks` → `companions`.
 * The `(*)` selects *all columns* from the foreign table (companions).
 */
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  // Flatten: we only need the joined companion objects, not the bookmark rows
  return data.map(({ companions }) => companions);
};
