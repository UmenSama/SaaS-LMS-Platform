# Bookmark Feature Setup Guide

## Database Setup

To enable the bookmark functionality, you need to create the bookmarks table in your Supabase database.

### 1. Create the Bookmarks Table

Run the SQL migration file located at `database/migrations/create_bookmarks_table.sql` in your Supabase SQL editor:

```sql
-- Create bookmarks table for storing user bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  companion_id UUID NOT NULL REFERENCES companions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only bookmark a companion once
  UNIQUE(user_id, companion_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_companion_id ON bookmarks(companion_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_companion ON bookmarks(user_id, companion_id);

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid()::text = user_id);

-- Users can only insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can only delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid()::text = user_id);
```

### 2. Verify Table Creation

After running the migration, verify that the table was created correctly by checking:
- The `bookmarks` table exists
- All indexes are created
- RLS policies are active

## Features Implemented

### 1. Bookmark Toggle
- Users can click the bookmark icon on any companion card to bookmark/unbookmark
- Visual feedback with filled/unfilled bookmark icons
- Optimistic UI updates with error handling

### 2. Bookmark Status Display
- Companion cards show current bookmark status
- Efficient batch loading of bookmark status for multiple companions

### 3. Bookmarks Page
- Dedicated page at `/bookmarks` to view all bookmarked companions
- Empty state with call-to-action to browse companions
- Counter showing number of saved bookmarks

### 4. Navigation Integration
- Added "Bookmarks" link to main navigation
- Active state highlighting for bookmarks page

## API Functions

### Server Actions
- `toggleBookmark(companionId)` - Add/remove bookmark
- `getUserBookmarks(userId)` - Get all user's bookmarked companions
- `checkIfBookmarked(companionId)` - Check if specific companion is bookmarked
- `getAllCompanions({...options, includeBookmarks})` - Get companions with optional bookmark status

### Client Components
- `BookmarkButton` - Interactive bookmark toggle button
- Updated `CompanionCard` to support bookmark functionality

## Usage

### In Companion Lists
```tsx
const companions = await getAllCompanions({
  subject, 
  topic, 
  includeBookmarks: true // Include bookmark status
});

// Pass bookmark status to CompanionCard
<CompanionCard 
  {...companion} 
  isBookmarked={companion.isBookmarked}
/>
```

### Standalone Bookmark Button
```tsx
<BookmarkButton 
  companionId={companion.id} 
  initialBookmarked={isBookmarked} 
/>
```

## Security

- Row Level Security (RLS) ensures users can only access their own bookmarks
- User authentication required for all bookmark operations
- Foreign key constraints maintain data integrity

## Performance Considerations

- Efficient batch loading of bookmark status to minimize database queries
- Indexed columns for fast lookups
- Optimistic UI updates for better user experience
