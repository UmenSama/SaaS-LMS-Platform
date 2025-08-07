import CompanionCard from "@/components/CompanionCard";
import { getUserBookmarks } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const BookmarksPage = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const bookmarkedCompanions = await getUserBookmarks(userId);

  return (
    <main>
      <section className="flex justify-between items-center">
        <h1>My Bookmarks</h1>
        <p className="text-gray-600">{bookmarkedCompanions.length} companions saved</p>
      </section>

      {bookmarkedCompanions.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No bookmarks yet</h2>
          <p className="text-gray-500 mb-6">Start exploring companions and bookmark your favorites!</p>
          <Link 
            href="/companions" 
            className="btn-primary inline-flex items-center"
          >
            Browse Companions
          </Link>
        </div>
      ) : (
        <section className="companions-grid">
          {bookmarkedCompanions.map((companion) => (
            <CompanionCard 
              key={companion.id} 
              {...companion} 
              color={getSubjectColor(companion.subject)}
              isBookmarked={true} // All companions on this page are bookmarked
            />
          ))}
        </section>
      )}
    </main>
  );
};

export default BookmarksPage;
