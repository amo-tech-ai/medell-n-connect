# 07 - Saved & Favorites Module

## I Love Medellín - Saved Places

---

## 1. CONTEXT & ROLE

Building the saved places and favorites module for I Love Medellín, enabling users to organize and access their saved apartments, cars, restaurants, events, and collections.

Act as an expert **favorites and collection system developer** specializing in **user content organization**.

---

## 2. PURPOSE

Provide a central location for users to view, organize, and manage all their saved items across the platform, with smart collections and quick access for planning.

---

## 3. GOALS

- Build saved places dashboard
- Enable collections for organization
- Implement cross-type saving
- Provide quick access for trip planning
- Prepare for AI agents (Phase 2+)

---

## 4. SCREENS

### Saved Dashboard (`/saved`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation with Saved highlighted
- Collections list
- Filter by type

**Main Panel - Work:**
- All saved items grid
- Filter tabs (All, Apartments, Cars, Restaurants, Events)
- Collection management
- Sort by date saved, name

**Right Panel - Intelligence:**
- "Based on your saves" suggestions
- Collection recommendations
- Quick add to trip
- Outdated listing alerts

**Saved Item Card:**
- Same as listing cards
- Date saved badge
- Collection tag
- Remove button
- Move to collection button

---

### Collection Detail (`/saved/collections/:id`)

**3-Panel Layout:**

**Left Panel - Context:**
- Navigation
- All collections list
- Back to saved

**Main Panel - Work:**
- Collection name and description
- Items in collection grid
- Reorder capability
- Share collection button
- Add notes to items

**Right Panel - Intelligence:**
- Map of collection items
- AI suggestions for collection
- Export options

---

## 5. DATA MODEL

**saved_places Table:**
- id (uuid, primary key, default: gen_random_uuid())
- user_id (uuid, references profiles, required)
- location_type (text, required, check: event|restaurant|rental|poi)
  - Note: 'rental' covers both apartments and cars, 'poi' for tourist destinations
- location_id (uuid, required) - References event, restaurant, rental, or tourist_destination
- collection_id (uuid, optional, FK collections)
- tags (text[], optional, default: '{}')
- notes (text, optional)
- is_favorite (boolean, optional, default: false)
- priority (integer, optional, default: 0)
- saved_at (timestamptz, default: now())
- last_viewed_at (timestamptz, optional)
- view_count (integer, optional, default: 0)

**collections Table:**
- id (uuid, primary key)
- user_id (uuid, references profiles)
- name (text)
- description (text)
- is_public (boolean, default false)
- cover_image (text, optional)
- created_at, updated_at

---

## 6. AI AGENTS (Phase 2+)

**Collection Organizer Agent**
- Model: gemini-3-flash-preview
- Screen: Saved Dashboard
- Purpose: Suggest organization of saves

**Smart Recall Agent**
- Model: gemini-3-pro + RAG
- Screen: Saved Dashboard
- Purpose: Context-aware recall

**Recommendation Refresher**
- Model: gemini-3-pro-preview
- Screen: Saved Dashboard
- Purpose: Update outdated info

---

## 7. RIGHT PANEL AI ACTIONS (Phase 2+)

**Saved Dashboard:**
- "You might also like" based on saves
- Auto-collection suggestions
- "These 3 would make a great trip" prompts
- Outdated listing warnings

**Collection Detail:**
- Map visualization
- "Missing from this collection" suggestions
- Share preparation

---

## 8. USER JOURNEY

1. User saves item from any listing page
2. User navigates to Saved
3. User sees all saved items
4. User creates collection (e.g., "Weekend Trip Ideas")
5. User moves items to collection
6. User adds notes to saved items
7. User uses saved items in trip planning

---

## 9. FEATURES

**Saving:**
- One-click save from any listing
- Save to default or specific collection
- Unsave with confirmation
- Visual feedback on save

**Collections:**
- Create named collections
- Custom descriptions
- Reorder items
- Cover image
- Public/private toggle

**Organization:**
- Filter by resource type
- Sort by date or name
- Search within saved
- Bulk actions (future)

**Integration:**
- Quick add to trip
- Export collection
- Share with friends (future)

---

## 10. 3-PANEL LOGIC

**Left Panel Updates:**
- Highlights "Saved" in navigation
- Lists all collections
- Quick type filters

**Main Panel Focus:**
- Grid of saved items
- Collection management
- Notes and organization

**Right Panel Intelligence:**
- AI suggestions
- Map of items
- Quick actions
- Recommendations

---

## 11. WORKFLOWS

**Save Item Workflow:**
1. User clicks heart on listing
2. Item added to saved_places
3. Toast confirms save
4. Icon updates to filled
5. Item appears in Saved page

**Create Collection Workflow:**
1. User clicks Create Collection
2. User enters name and description
3. Collection created
4. User can add items
5. Collection appears in sidebar

**Organize Saved Workflow:**
1. User selects saved items
2. User chooses collection
3. Items moved to collection
4. UI updates

---

## 12. SUPABASE QUERIES

**List Saved:**
- Select from saved_places
- Join with resource tables
- Filter by user_id
- Filter by type if specified
- Order by saved_at

**Get Collections:**
- Select from collections
- Filter by user_id
- Include item counts

**Save Item:**
- Insert into saved_places
- Check for duplicates

**Remove Item:**
- Delete from saved_places
- By user_id and resource_id

---

## 13. RESPONSIVE BEHAVIOR

**Desktop:**
- Full 3-panel layout
- Grid of cards
- Inline collection picker

**Tablet:**
- 2-panel layout
- Smaller grid
- Modal collection picker

**Mobile:**
- Full-screen list
- Swipe actions
- Bottom sheet for collections

---

## 14. SUCCESS CRITERIA

- Save items from all listing types
- View all saved items
- Create and manage collections
- Move items between collections
- Add notes to saved items
- Responsive across devices

---

## 15. TESTING & VERIFICATION

### Unit Tests:
- [ ] Save button toggles correctly
- [ ] Saved items display in list
- [ ] Collections can be created
- [ ] Items can be moved between collections
- [ ] Notes can be added/edited
- [ ] Delete functionality works

### Integration Tests:
- [ ] Save persists to database
- [ ] Collections save correctly
- [ ] Items load from database
- [ ] RLS policies enforce access
- [ ] Cross-resource saving works

### Manual Verification:
1. Save apartment - appears in saved
2. Save restaurant - appears in saved
3. Save event - appears in saved
4. Create collection - collection created
5. Move items to collection - items moved
6. Add note - note saved
7. Delete item - item removed
8. Test on mobile - responsive works

### Production Readiness:
- [ ] Loading states during fetch
- [ ] Empty state when no saved items
- [ ] Error handling for failed saves
- [ ] Performance acceptable
- [ ] Sync across devices works

---

## 16. REAL-WORLD EXAMPLE

**User Journey: Organize Saved Places**

1. User saves 10 restaurants over time
2. Opens Saved page
3. Creates "Date Night Spots" collection
4. Moves 3 romantic restaurants to collection
5. Creates "Coworking Cafes" collection
6. Moves 4 cafes to collection
7. Adds notes to saved items
8. Uses collections when planning trips

**Time:** 2 minutes (vs 10 minutes manual organization)

---

## 17. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Simple save/unsave is enough
- Basic collections (don't need complex tagging yet)
- Simple notes (don't need rich text yet)
- Basic organization (don't need complex sorting yet)

**Production Focus:**
- Fast save/unsave
- Easy organization
- Clear collections
- Good mobile experience

---

**Previous Prompt:** 06-listings-events.md  
**Next Prompt:** 08-explore-discover.md
