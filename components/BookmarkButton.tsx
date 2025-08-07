"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toggleBookmark } from "@/lib/actions/companion.actions";

interface BookmarkButtonProps {
  companionId: string;
  initialBookmarked: boolean;
}

const BookmarkButton = ({ companionId, initialBookmarked }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleToggleBookmark = () => {
    startTransition(async () => {
      try {
        const result = await toggleBookmark(companionId);
        setIsBookmarked(result.bookmarked);
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
        // Revert the optimistic update on error
        setIsBookmarked(isBookmarked);
      }
    });
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isPending}
      className={`transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'} hover:scale-110 transition-transform`}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      <Image
        src={isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
        alt="bookmark"
        width={12.5}
        height={15}
      />
    </button>
  );
};

export default BookmarkButton;
