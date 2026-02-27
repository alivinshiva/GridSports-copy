# FEED IMPLEMENTATION PLAN v2.0
## Random Image/Video Feed with localStorage + User Post Exclusion

---

## 🎯 **Core Requirements**
1. Users see a randomized feed of submissions
2. **Users NEVER see their own posts in the feed**
3. Feed order is persistent across page reloads (localStorage)
4. Feed refreshes when new posts are available
5. Batch loading for better performance
6. No post deletion feature required

---

## �️ **Feed Clearing Mechanism (Detailed)**

### What is "Clearing the Feed"?

Clearing the feed means **removing all currently rendered posts from the UI** and resetting to a fresh state. This is done via React state management.

### React State Structure

```javascript
// Component state
const [feed, setFeed] = useState([]); // Array of post objects
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);

// feed array structure:
// [
//   { _id: "abc123", mediaUrl: "...", mediaType: "video", ... },
//   { _id: "def456", mediaUrl: "...", mediaType: "image", ... },
//   ...
// ]
```

### When Does Feed Clearing Happen?

#### 1️⃣ **User Clicks "Refresh Feed" Button**
```javascript
refreshFeedWithNewPosts() {
    // 1. Update localStorage with new shuffled IDs
    saveFeedState(newShuffled, 0, timestamp, total);
    
    // 2. Clear React state
    setFeed([]); // ← FEED CLEARED: array becomes empty
    
    // 3. UI now shows empty/loading state
    // 4. Fetch first batch
    await loadNextBatch(); // This will populate feed again
}
```

**Visual Flow:**
```
Before Clear:
┌─────────────────────┐
│  Post 1 (old)       │
│  Post 2 (old)       │
│  Post 3 (old)       │
│  ... (old posts)    │
└─────────────────────┘

After setFeed([]):
┌─────────────────────┐
│                     │
│   Loading...        │ ← Optional loading spinner
│                     │
└─────────────────────┘

After loadNextBatch():
┌─────────────────────┐
│  Post 47 (new)      │
│  Post 100 (NEW!)    │ ← New post included
│  Post 23 (new)      │
│  ... (fresh order)  │
└─────────────────────┘
```

#### 2️⃣ **Component Unmounts & Remounts**
```javascript
// User navigates away and comes back
useEffect(() => {
    initializeFeed(); // May clear and reload
}, []); // Runs on mount

// If metadata changed since last visit:
if (needsRefresh) {
    // Clear not needed here since component is fresh
    // Just load directly
    await loadNextBatch();
}
```

### Why Clear the Feed?

1. **Prevent Duplicates**: If we just append new posts, old ones remain
2. **Fresh Start**: Users expect to see new content from top
3. **Correct Order**: localStorage has new shuffled order, UI must match
4. **Memory Management**: Removes old posts from memory

### Alternative: Append Without Clearing

```javascript
// ❌ DON'T DO THIS (without clearing):
const newPosts = await fetchNewBatch();
setFeed(prev => [...prev, ...newPosts]);
// Problem: Old posts still there, new order not applied

// ✅ CORRECT WAY:
setFeed([]); // Clear old
const newPosts = await fetchNewBatch();
setFeed(newPosts); // Set fresh
```

### Clearing vs Reloading - Complete Sequence

```javascript
async function refreshFeedWithNewPosts() {
    // ==========================================
    // PHASE 1: PREPARATION
    // ==========================================
    setLoading(true); // Show loading indicator
    
    // ==========================================
    // PHASE 2: FETCH NEW DATA
    // ==========================================
    const { data: feedData } = await getAllFeedIds();
    // feedData.ids = ["id47", "id100", "id23", ...] (all 100+ posts)
    
    const { data: backendMeta } = await getFeedMetadata();
    // backendMeta = { totalPosts: 101, lastUpdatedAt: "..." }
    
    // ==========================================
    // PHASE 3: UPDATE LOCALSTORAGE
    // ==========================================
    const shuffled = shuffleArray(feedData.ids);
    saveFeedState(shuffled, 0, backendMeta.lastUpdatedAt, backendMeta.totalPosts);
    // localStorage now has fresh shuffled order
    
    // ==========================================
    // PHASE 4: CLEAR UI (THE CLEARING PART)
    // ==========================================
    setFeed([]); 
    // ↑ React state is now: feed = []
    // ↑ UI re-renders with empty array
    // ↑ All post components unmount
    // ↑ Screen shows loading spinner or empty state
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // ↑ Scroll user to top for better UX
    
    // ==========================================
    // PHASE 5: RELOAD WITH NEW ORDER
    // ==========================================
    await loadNextBatch();
    // This function does:
    //   1. const { ids } = getNextBatch(10); 
    //      → Gets first 10 IDs from NEW shuffled order
    //   2. const { data } = await getBatchSubmissions(ids);
    //      → Fetches full post details
    //   3. setFeed(prev => [...prev, ...data]);
    //      → Since prev is [], this becomes [post1, post2, ...]
    //   4. UI re-renders with FRESH posts in NEW order
    
    setLoading(false);
    toast.success('Feed refreshed!');
}
```

### UI States During Clear & Reload

```javascript
// Recommended: Show loading state while clearing
<div className="feed-container">
    {loading ? (
        // Shown during clear period
        <div className="loading-state">
            <Loader2 className="animate-spin" />
            <p>Loading fresh posts...</p>
        </div>
    ) : feed.length === 0 ? (
        // Shown if no posts available
        <div className="empty-state">
            <p>No posts available yet</p>
        </div>
    ) : (
        // Normal feed rendering
        feed.map(post => <PostCard key={post._id} post={post} />)
    )}
</div>
```

### Optimization: Keep Old Posts During Fetch

**Option A: Hard Clear (Recommended for clarity)**
```javascript
setFeed([]); // Empty immediately
await loadNextBatch(); // Then load new
```
- ✅ Clear indication of refresh
- ✅ No confusion about old vs new
- ❌ Brief empty/loading state

**Option B: Soft Clear (Better UX, more complex)**
```javascript
// Keep old posts visible while loading new
setLoading(true);
const newIds = getNextBatch(10).ids;
const newPosts = await getBatchSubmissions(newIds);

// Replace in one atomic operation
setFeed(newPosts); // Old posts replaced instantly
setLoading(false);
```
- ✅ No empty state visible
- ✅ Smooth transition
- ⚠️ User might not realize feed refreshed

### Clearing on Different Triggers

| Trigger | Clear Needed? | Why? |
|---------|--------------|------|
| First visit | ❌ No | Component starts empty |
| Page reload (no new posts) | ❌ No | Continue from pointer |
| Page reload (new posts) | ❌ No | Component re-mounts fresh |
| Manual refresh button | ✅ YES | Full reset needed |
| Scrolling to load more | ❌ No | Appending, not replacing |
| Reached end (reshuffle) | ❌ No | Just change order in localStorage |
| Logout | ✅ YES | Clear state + localStorage |

### Summary

**"Clearing the feed" = `setFeed([])`**

This empties the React state array that holds post objects, causing all post components to unmount and the UI to show an empty/loading state. After clearing, we immediately fetch and load posts from the new shuffled order stored in localStorage.

### Complete State Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│             FEED REFRESH WITH CLEARING - FULL CYCLE            │
└────────────────────────────────────────────────────────────────┘

INITIAL STATE:
  React State: feed = [post1, post2, ..., post20]
  localStorage: ["old-id-1", "old-id-2", ..., "old-id-99"] (pointer: 20)
  UI: User sees 20 old posts, scrolled down
                          │
                          ▼
                 ┌─────────────────┐
                 │ User Clicks     │
                 │ "Refresh Feed"  │
                 └─────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
   setLoading(true)              Fetch Backend Data
   loading = true                ├─ getAllFeedIds()
                                 └─ getFeedMetadata()
        │                                   │
        └─────────────────┬─────────────────┘
                          ▼
                 Shuffle New IDs
           ["new-id-47", "new-id-100", ...]
                          │
                          ▼
            Update localStorage
        postOrder: [new shuffled array]
        pointer: 0 (reset)
        lastUpdatedAt: "2026-02-27..."
        totalPosts: 101
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
   🗑️ setFeed([])               window.scrollTo(0)
   feed = []                     User scrolled to top
   ALL POST COMPONENTS UNMOUNT
        │                                   │
        └─────────────────┬─────────────────┘
                          ▼
        ┌──────────────────────────────────┐
        │ UI SHOWS LOADING/EMPTY STATE     │
        │ • No posts rendered              │
        │ • Spinner visible                │
        │ • Clean slate                    │
        └──────────────────────────────────┘
                          │
                          ▼
              await loadNextBatch()
        ┌───────────────────────────┐
        │ 1. getNextBatch(10)       │
        │    Returns first 10 IDs   │
        │    from new shuffle       │
        │                           │
        │ 2. getBatchSubmissions()  │
        │    Fetch full details     │
        │                           │
        │ 3. setFeed(newPosts)      │
        │    feed = [post1, ...,    │
        │           post10]         │
        └───────────────────────────┘
                          │
                          ▼
              setLoading(false)
              loading = false
                          │
                          ▼
        ┌──────────────────────────────────┐
        │ UI SHOWS FRESH FEED              │
        │ • 10 new posts rendered          │
        │ • In new random order            │
        │ • Includes newly added posts     │
        │ • User at top of page            │
        └──────────────────────────────────┘
                          │
                          ▼
               User scrolls down...
      (Normal infinite scroll resumes)

FINAL STATE:
  React State: feed = [post47, post100, post23, ..., post10]
  localStorage: ["new-id-47", ..., "new-id-100", ...] (pointer: 10)
  UI: User sees fresh feed with new posts included
```

---

## �📋 **Implementation Steps**

### **PHASE 1: Backend - Data Layer**

#### 1.1 Create Feed Metadata Model
**File**: `adBackend/model/feedMetadata.model.js`

```javascript
const feedMetadataSchema = new mongoose.Schema({
    _id: { type: String, default: 'global_feed_metadata' },
    totalPosts: { type: Number, default: 0 },
    lastUpdatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
```

**Purpose**: Track when feed data changes to trigger client-side refresh

---

#### 1.2 Update Submission Upload Flow
**File**: `adBackend/controller/submission.controller.js`

**In `addSubmissionController`** (after successful submission save):
```javascript
// Update global feed metadata
await FeedMetadata.findOneAndUpdate(
    { _id: 'global_feed_metadata' },
    { 
        $inc: { totalPosts: 1 },
        $set: { lastUpdatedAt: new Date() }
    },
    { upsert: true }
);
```

**Purpose**: Notify all clients that new content is available

---

#### 1.3 Create Feed Metadata Endpoint
**File**: `adBackend/controller/submission.controller.js`

```javascript
export const getFeedMetadataController = async (req, res) => {
    try {
        const metadata = await FeedMetadata.findOne({ _id: 'global_feed_metadata' });
        
        return res.status(200).json({
            success: true,
            data: {
                totalPosts: metadata?.totalPosts || 0,
                lastUpdatedAt: metadata?.lastUpdatedAt || new Date()
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch metadata" 
        });
    }
};
```

**Route**: `GET /api/v1/submission/feed-metadata`

**Purpose**: Let clients check if feed needs refresh

---

#### 1.4 Create All Feed IDs Endpoint (Excluding Own Posts)
**File**: `adBackend/controller/submission.controller.js`

```javascript
export const getAllFeedIdsController = async (req, res) => {
    try {
        const loggedInUserId = req.user; // From auth middleware
        
        // Get all submission IDs EXCEPT user's own posts
        const submissions = await submissionModel
            .find({ 
                user: { $ne: loggedInUserId } // Exclude own posts
            })
            .select('_id')
            .lean();
        
        const ids = submissions.map(sub => sub._id.toString());
        
        return res.status(200).json({
            success: true,
            data: { ids }
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch feed IDs" 
        });
    }
};
```

**Route**: `GET /api/v1/submission/feed-ids`

**Purpose**: Provide complete list of post IDs (excluding user's own) for client-side shuffle

---

#### 1.5 Create Batch Fetch Endpoint
**File**: `adBackend/controller/submission.controller.js`

```javascript
export const getBatchSubmissionsController = async (req, res) => {
    try {
        const { ids } = req.body; // Array of submission IDs
        const loggedInUserId = req.user;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "IDs array required" 
            });
        }
        
        // Fetch only requested IDs, excluding user's own posts
        const submissions = await submissionModel
            .find({ 
                _id: { $in: ids },
                user: { $ne: loggedInUserId } // Extra safety check
            })
            .populate("challenge", "name scoringType parameters comments")
            .populate("user", "name")
            .lean();
        
        // Check user's ratings for these submissions
        const subIds = submissions.map(sub => sub._id);
        const pointLedgers = await PointLedger.find({
            user: loggedInUserId,
            submission: { $in: subIds },
            actionType: { $regex: /^RATE_/ }
        });
        
        const detailedRatings = await DetailedRating.find({
            user: loggedInUserId,
            submission: { $in: subIds }
        });
        
        // Merge ratings into submissions
        const submissionsWithRatings = submissions.map(sub => {
            const rating = pointLedgers.find(
                pl => pl.submission.toString() === sub._id.toString()
            );
            const detailed = detailedRatings.find(
                dr => dr.submission.toString() === sub._id.toString()
            );
            
            return {
                ...sub,
                userRating: rating?.actionType.replace('RATE_', '') || null,
                detailedUserRating: detailed || null
            };
        });
        
        return res.status(200).json({
            success: true,
            data: submissionsWithRatings
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch batch" 
        });
    }
};
```

**Route**: `POST /api/v1/submission/batch`

**Purpose**: Fetch full details for specific post IDs from localStorage

---

#### 1.6 Add Routes
**File**: `adBackend/router/submission.router.js`

```javascript
submissionRouter.route("/feed-metadata").get(getFeedMetadataController);
submissionRouter.route("/feed-ids").get(verifyCookies, getAllFeedIdsController);
submissionRouter.route("/batch").post(verifyCookies, getBatchSubmissionsController);
```

---

### **PHASE 2: Frontend - Feed Utilities**

#### 2.1 Create Feed Manager Utility
**File**: `frontend/src/utils/feedManager.js`

```javascript
const FEED_VERSION = 'v2'; // Increment when changing logic
const STORAGE_KEYS = {
    postOrder: `feed_post_order_${FEED_VERSION}`,
    pointer: `feed_pointer_${FEED_VERSION}`,
    lastUpdated: `feed_lastUpdatedAt_${FEED_VERSION}`,
    totalPosts: `feed_totalPosts_${FEED_VERSION}`
};

// Fisher-Yates Shuffle Algorithm
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get stored feed state from localStorage
export function getFeedState() {
    try {
        return {
            postOrder: JSON.parse(localStorage.getItem(STORAGE_KEYS.postOrder) || '[]'),
            pointer: parseInt(localStorage.getItem(STORAGE_KEYS.pointer) || '0'),
            lastUpdated: localStorage.getItem(STORAGE_KEYS.lastUpdated) || null,
            totalPosts: parseInt(localStorage.getItem(STORAGE_KEYS.totalPosts) || '0')
        };
    } catch (error) {
        console.error('Failed to read feed state:', error);
        return { postOrder: [], pointer: 0, lastUpdated: null, totalPosts: 0 };
    }
}

// Save feed state to localStorage
export function saveFeedState(postOrder, pointer, lastUpdated, totalPosts) {
    try {
        localStorage.setItem(STORAGE_KEYS.postOrder, JSON.stringify(postOrder));
        localStorage.setItem(STORAGE_KEYS.pointer, pointer.toString());
        localStorage.setItem(STORAGE_KEYS.lastUpdated, lastUpdated);
        localStorage.setItem(STORAGE_KEYS.totalPosts, totalPosts.toString());
    } catch (error) {
        console.error('Failed to save feed state:', error);
    }
}

// Clear feed state (useful for version upgrades or logout)
export function clearFeedState() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

// Increment pointer and return next batch of IDs
export function getNextBatch(batchSize = 10) {
    const { postOrder, pointer } = getFeedState();
    
    if (pointer >= postOrder.length) {
        return { ids: [], hasMore: false, newPointer: pointer };
    }
    
    const ids = postOrder.slice(pointer, pointer + batchSize);
    const newPointer = pointer + batchSize;
    
    saveFeedState(postOrder, newPointer, getFeedState().lastUpdated, getFeedState().totalPosts);
    
    return { 
        ids, 
        hasMore: newPointer < postOrder.length,
        newPointer 
    };
}

// Reset feed (reshuffle existing IDs)
export function resetFeed() {
    const { postOrder, lastUpdated, totalPosts } = getFeedState();
    const shuffled = shuffleArray(postOrder);
    saveFeedState(shuffled, 0, lastUpdated, totalPosts);
}
```

---

#### 2.2 Update Submission Service
**File**: `frontend/src/services/submissionService.js`

```javascript
export const getFeedMetadata = async () => {
    try {
        const response = await axios.get(`${API_URL}/feed-metadata`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAllFeedIds = async () => {
    try {
        const response = await axios.get(`${API_URL}/feed-ids`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getBatchSubmissions = async (ids) => {
    try {
        const response = await axios.post(`${API_URL}/batch`, { ids }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
```

---

### **PHASE 3: Frontend - Feed Component Refactor**

#### 3.1 Update SubmissionFeed.jsx Logic
**File**: `frontend/src/pages/SubmissionFeed.jsx`

**Key Changes**:

1. **On Component Mount**:
```javascript
useEffect(() => {
    initializeFeed();
}, []);

async function initializeFeed() {
    // Step 1: Get backend metadata
    const { data: backendMeta } = await getFeedMetadata();
    
    // Step 2: Get local state
    const localState = getFeedState();
    
    // Step 3: Check if refresh needed
    const needsRefresh = 
        !localState.postOrder.length || 
        !localState.lastUpdated ||
        localState.lastUpdated !== backendMeta.lastUpdatedAt ||
        localState.totalPosts !== backendMeta.totalPosts;
    
    if (needsRefresh) {
        console.log('🔄 Feed refresh required, fetching new IDs...');
        const { data: feedData } = await getAllFeedIds();
        const shuffled = shuffleArray(feedData.ids);
        
        saveFeedState(
            shuffled, 
            0, 
            backendMeta.lastUpdatedAt, 
            backendMeta.totalPosts
        );
    }
    
    // Step 4: Load first batch
    await loadNextBatch();
}
```

2. **Load Next Batch**:
```javascript
async function loadNextBatch() {
    const { ids, hasMore } = getNextBatch(10);
    
    if (ids.length === 0) {
        // End of feed - reshuffle
        console.log('🔁 Reached end of feed, reshuffling...');
        resetFeed();
        const { ids: newIds } = getNextBatch(10);
        if (newIds.length > 0) {
            const { data: posts } = await getBatchSubmissions(newIds);
            setFeed(prev => [...prev, ...posts]);
        }
        return;
    }
    
    const { data: posts } = await getBatchSubmissions(ids);
    setFeed(prev => [...prev, ...posts]);
    setHasMore(hasMore);
}
```

3. **Infinite Scroll**:
```javascript
useEffect(() => {
    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
            !loading &&
            hasMore
        ) {
            loadNextBatch();
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, [loading, hasMore]);
```

4. **Periodic Metadata Check & Auto-Update** (every 30 seconds):
```javascript
const [hasNewContent, setHasNewContent] = useState(false);

useEffect(() => {
    const interval = setInterval(async () => {
        const { data: backendMeta } = await getFeedMetadata();
        const localState = getFeedState();
        
        if (backendMeta.lastUpdatedAt !== localState.lastUpdated || 
            backendMeta.totalPosts !== localState.totalPosts) {
            
            console.log('🆕 New content detected!');
            setHasNewContent(true);
            
            // OPTION A: Show banner with refresh button (Recommended)
            toast('New posts available!', {
                duration: Infinity, // Stays until dismissed
                icon: '🔄',
                action: {
                    label: 'Refresh Feed',
                    onClick: () => refreshFeedWithNewPosts()
                }
            });
            
            // OPTION B: Auto-update in background (silently)
            // Uncomment to enable automatic background refresh
            // await refreshFeedWithNewPosts(true);
        }
    }, 30000);
    
    return () => clearInterval(interval);
}, []);

// Function to handle feed refresh when new posts detected
async function refreshFeedWithNewPosts(silent = false) {
    try {
        if (!silent) setLoading(true);
        
        // Fetch fresh IDs from backend (excluding user's own posts)
        const { data: feedData } = await getAllFeedIds();
        const { data: backendMeta } = await getFeedMetadata();
        
        // Shuffle new ID list
        const shuffled = shuffleArray(feedData.ids);
        
        // Update localStorage with new data
        saveFeedState(
            shuffled, 
            0, 
            backendMeta.lastUpdatedAt, 
            backendMeta.totalPosts
        );
        
        // 🗑️ CLEAR FEED: Empty the React state array
        // This removes all currently rendered posts from the DOM
        setFeed([]);
        
        // 👆 Scroll user back to top for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 🔄 RELOAD: Fetch first batch from new shuffled order
        await loadNextBatch();
        
        setHasNewContent(false);
        
        if (!silent) {
            toast.success('Feed refreshed with new posts!');
        }
    } catch (error) {
        console.error('Failed to refresh feed:', error);
        toast.error('Failed to refresh feed');
    } finally {
        if (!silent) setLoading(false);
    }
}
```

---

## 🔄 **localStorage Update Triggers**

### When does localStorage get updated?

#### 1️⃣ **First Visit (Empty localStorage)**
```javascript
// Trigger: localStorage is empty or missing
// Action: Fetch all IDs → Shuffle → Save to localStorage
const { data: feedData } = await getAllFeedIds();
const shuffled = shuffleArray(feedData.ids);
saveFeedState(shuffled, 0, backendMeta.lastUpdatedAt, backendMeta.totalPosts);
```

#### 2️⃣ **Metadata Mismatch on Page Load**
```javascript
// Trigger: User returns and backend has new posts
const needsRefresh = 
    localState.lastUpdated !== backendMeta.lastUpdatedAt ||
    localState.totalPosts !== backendMeta.totalPosts;

if (needsRefresh) {
    // Re-fetch IDs, reshuffle, update localStorage
    const { data: feedData } = await getAllFeedIds();
    const shuffled = shuffleArray(feedData.ids);
    saveFeedState(shuffled, 0, backendMeta.lastUpdatedAt, backendMeta.totalPosts);
}
```

#### 3️⃣ **Pointer Increment (Scrolling)**
```javascript
// Trigger: User scrolls → Load more posts
// Action: Only update pointer, keep same ID array
const { ids, newPointer } = getNextBatch(10);
saveFeedState(postOrder, newPointer, lastUpdated, totalPosts);
//           ↑ same array  ↑ incremented
```

#### 4️⃣ **Reached End of Feed**
```javascript
// Trigger: pointer >= postOrder.length
// Action: Reshuffle existing IDs, reset pointer
const { postOrder } = getFeedState();
const reshuffled = shuffleArray(postOrder);
saveFeedState(reshuffled, 0, lastUpdated, totalPosts);
//            ↑ reshuffled  ↑ reset to 0
```

#### 5️⃣ **New Content Detected (30s Polling)**
```javascript
// Trigger: 30-second check finds new posts
// Option A: User clicks "Refresh Feed" button
refreshFeedWithNewPosts(); // Fetches fresh IDs, shuffles, updates localStorage

// Option B: Auto-update in background (silent)
await refreshFeedWithNewPosts(true); // Silent update without UI reset
```

#### 6️⃣ **User Logs Out**
```javascript
// Trigger: Logout action
// Action: Clear all feed data from localStorage
clearFeedState(); // Removes all feed-related keys
```

---

## 📊 **localStorage State Transitions**

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCALSTORAGE LIFECYCLE                       │
└─────────────────────────────────────────────────────────────────┘

[Empty]  ──(First Visit)──> [Fetch & Shuffle] ──> [Saved]
                                                      │
                                 ┌────────────────────┴─────────────────────┐
                                 │                                          │
                        (Normal Scrolling)                          (Page Reload)
                                 │                                          │
                                 ▼                                          ▼
                        [Update Pointer]                         [Check Metadata]
                                 │                                          │
                                 │                                ┌─────────┴─────────┐
                                 │                                │                   │
                                 │                           (Match)            (Mismatch)
                                 │                                │                   │
                                 │                                ▼                   ▼
                                 │                          [Use Stored]      [Re-fetch & 
                                 │                                            Reshuffle]
                                 │                                                   │
                                 └─────────────(Continue)──────────────────┬─────────┘
                                                                           │
                              ┌────────────────────────────────────────────┘
                              │
                  (Reached End of Array?)
                              │
                    ┌─────────┴──────────┐
                    │                    │
                  (Yes)                (No)
                    │                    │
                    ▼                    ▼
            [Reshuffle Same]      [Continue Loading]
            [Reset Pointer]

┌─────────────────────────────────────────────────────────────────┐
│              30s Background Check (Parallel)                    │
└─────────────────────────────────────────────────────────────────┘

[Polling Every 30s] ──(New Content?)──> [Show Notification]
                                              │
                                    ┌─────────┴─────────┐
                                    │                   │
                              (User Clicks         (Auto-Update
                               Refresh)             Enabled)
                                    │                   │
                                    └─────────┬─────────┘
                                              │
                                              ▼
                                    [Re-fetch All IDs]
                                    [Shuffle & Update]
                                    [Reset Feed View]
```

---

## 🔄 **Data Flow Summary**

### Initial Load:
```
1. User opens feed page
2. Check localStorage for existing feed state
3. Fetch backend metadata (totalPosts, lastUpdatedAt)
4. If mismatch OR no local data:
   └─> Fetch all post IDs (excluding user's own posts)
   └─> Shuffle using Fisher-Yates
   └─> Store in localStorage
5. Get next 10 IDs from shuffled array
6. Fetch full post details via batch endpoint
7. Render posts
```

### Scrolling:
```
1. User scrolls near bottom
2. Read next 10 IDs from localStorage pointer
3. Increment pointer
4. Fetch post details via batch endpoint
5. Append to feed
6. If pointer >= array length:
   └─> Reshuffle existing IDs
   └─> Reset pointer to 0
   └─> Continue loading
```

### New Post Detection:
```
1. Every 30 seconds, check backend metadata
2. Compare lastUpdatedAt with stored value
3. If different:
   └─> Show toast notification with "Refresh Feed" button
   └─> User clicks button OR auto-refresh triggers
   └─> Fetch fresh list of ALL post IDs (now includes new posts)
   └─> Shuffle the complete new list
   └─> Update localStorage with:
       • New shuffled array (includes new posts)
       • Reset pointer to 0
       • New lastUpdatedAt timestamp
       • New totalPosts count
   └─> Clear current feed display
   └─> Load first batch from new shuffled order
   └─> User sees fresh feed that includes new posts
```

---

## 🆕 **New Post Addition Flow (Complete Example)**

**Scenario**: User A uploads a new post while User B is viewing feed

```
TIME: 10:00 AM
─────────────────────────────────────────────────
User A Action:
  • Uploads new video submission
  • Backend saves to database
  • Backend updates FeedMetadata:
      totalPosts: 99 → 100
      lastUpdatedAt: "2026-02-27T10:00:00Z"

User B's Browser (Active on feed page):
  • localStorage state:
      postOrder: ["id1", "id2", ..., "id99"]  <-- 99 posts
      pointer: 15
      lastUpdatedAt: "2026-02-27T09:50:00Z"
      totalPosts: 99
  • Currently viewing posts 11-20
  • Continues scrolling normally...

─────────────────────────────────────────────────
TIME: 10:00:15 AM (15 seconds later)

User B's Browser:
  • 30-second interval check fires
  • Fetches backend metadata
  • Compares:
      Backend: lastUpdatedAt = "2026-02-27T10:00:00Z"
      Local:   lastUpdatedAt = "2026-02-27T09:50:00Z"
      ❌ MISMATCH DETECTED!
  
  • Shows notification:
      "🔄 New posts available! [Refresh Feed]"

─────────────────────────────────────────────────
TIME: 10:00:30 AM

User B clicks "Refresh Feed" button:

  1. Call getAllFeedIds() API
     Backend returns: ["id1", "id2", ..., "id99", "id100"]
                       ↑ All IDs except User B's own posts
                       ↑ Now includes User A's new post
  
  2. Client shuffles:
     Result: ["id47", "id100", "id23", "id8", ...]
              ↑ New post randomly placed in shuffled order
  
  3. Update localStorage:
     {
       postOrder: ["id47", "id100", "id23", ...],  ✅ 100 posts
       pointer: 0,                                  ✅ Reset
       lastUpdatedAt: "2026-02-27T10:00:00Z",      ✅ Updated
       totalPosts: 100                              ✅ Updated
     }
  
  4. Clear current feed display: setFeed([])
  
  5. Load first batch (next 10 from pointer 0):
     • Fetch IDs: ["id47", "id100", "id23", ..., "id92"]
     • Call getBatchSubmissions(ids)
     • Render posts
     
     DETAILED CLEARING SEQUENCE:
     ┌────────────────────────────────────────────────┐
     │ BEFORE setFeed([])                             │
     │ ─────────────────────────────────────────────  │
     │ React State: feed = [                          │
     │   {_id: "old1", ...},                          │
     │   {_id: "old2", ...},                          │
     │   ... (20 old posts rendered)                  │
     │ ]                                              │
     │ UI: Shows 20 old posts on screen               │
     └────────────────────────────────────────────────┘
                         ↓
                    setFeed([])
                         ↓
     ┌────────────────────────────────────────────────┐
     │ AFTER setFeed([])                              │
     │ ─────────────────────────────────────────────  │
     │ React State: feed = []                         │
     │ UI: Empty (shows loading spinner)              │
     └────────────────────────────────────────────────┘
                         ↓
               await loadNextBatch()
                         ↓
     ┌────────────────────────────────────────────────┐
     │ AFTER loadNextBatch()                          │
     │ ─────────────────────────────────────────────  │
     │ React State: feed = [                          │
     │   {_id: "id47", ...},  ← Fresh post            │
     │   {_id: "id100", ...}, ← NEW POST!             │
     │   {_id: "id23", ...},  ← Fresh post            │
     │   ... (10 new posts in new order)              │
     │ ]                                              │
     │ UI: Shows 10 fresh posts from new shuffle      │
     └────────────────────────────────────────────────┘
  
  6. User B now sees:
     ✅ Fresh randomized feed
     ✅ Includes User A's new post (randomly positioned)
     ✅ No duplicates from previous session
     ✅ Can scroll through all 100 posts

─────────────────────────────────────────────────
TIME: 10:05:00 AM

User B scrolls to bottom → Reaches end of 100 posts:
  • pointer = 100 (array length)
  • Triggers reshuffle:
      • Same 100 IDs, different random order
      • Reset pointer to 0
      • Shows posts again in new order
  • User can keep scrolling indefinitely
```

---

## 🚫 **User Uploads Own Post - What Happens?**

**Scenario**: User B uploads a post while viewing their own feed

```
TIME: 10:00 AM
─────────────────────────────────────────────────
User B Action:
  • Uploads new submission from upload page
  • Backend saves submission (user: User B's ID)
  • Backend updates FeedMetadata:
      totalPosts: 100 → 101
      lastUpdatedAt: "2026-02-27T10:00:00Z"
  • User B navigates back to feed page

User B's Feed Page:
  • 30s check detects metadata change
  • Shows "New posts available! [Refresh Feed]"
  
User B clicks Refresh:
  1. Calls GET /feed-ids
  2. Backend query: 
     submissionModel.find({ 
       user: { $ne: USER_B_ID }  ← Excludes User B's posts
     })
  3. Returns: ["id1", "id2", ..., "id100"]
     ↑ 100 posts (101 total minus User B's 1 post)
  4. Shuffle and display
  
✅ Result: User B sees:
   • Fresh feed with 100 posts
   • Their own post is EXCLUDED
   • Feed updates correctly for other users
   • User B can see everyone else's posts

─────────────────────────────────────────────────
Other Users' View:

User A's Feed (next time they refresh):
  1. GET /feed-ids (excludes User A's posts)
  2. Returns: ["id1", "id2", ..., "id101", "id100"]
     ↑ Now includes User B's new post
  3. User A WILL see User B's post in their shuffled feed

✅ Exclusion is per-user, not global
✅ Each user has their own filtered view
✅ Metadata updates notify all users
```

---

## 🎨 **User Experience Features**

1. **Seamless Scrolling**: Infinite scroll with preloading
2. **Consistent Order**: Same feed order across page reloads
3. **Fresh Content**: Automatic detection of new posts
4. **Privacy**: Users never see their own uploads
5. **Performance**: Batch loading reduces API calls
6. **No Duplicates**: Pointer system ensures no repeats until reshuffle

---

## ⚠️ **Edge Cases & Handling**

### 1. **Multiple Posts Added Quickly**
```javascript
// Scenario: 5 users upload posts within 10 seconds
// Problem: Multiple metadata updates
// Solution: Next 30s check will catch the latest state
//          User gets ALL new posts in one refresh
```

### 2. **User Uploads While Scrolling**
```javascript
// Scenario: User is at post #50, uploads their own post
// localStorage pointer: 50
// Result: 
//   - 30s check detects new content
//   - User can choose to refresh or continue scrolling
//   - If they refresh: pointer resets to 0, sees new feed
//   - If they continue: sees old posts, refreshes on next visit
```

### 3. **localStorage Quota Exceeded**
```javascript
// If user has >10,000 posts and localStorage is full:
try {
    saveFeedState(shuffled, 0, timestamp, total);
} catch (error) {
    // Fallback: Clear old data and retry
    clearFeedState();
    saveFeedState(shuffled, 0, timestamp, total);
    
    // Or fallback to sessionStorage
    sessionStorage.setItem('feed_post_order', JSON.stringify(shuffled));
}
```

### 4. **Network Failure During Refresh**
```javascript
async function refreshFeedWithNewPosts(silent = false) {
    try {
        // ... fetch new data
    } catch (error) {
        // Keep existing localStorage intact
        // Show error notification
        toast.error('Failed to refresh. Using cached feed.');
        // User can try again later
    }
}
```

### 5. **User Has No Posts to See**
```javascript
// Scenario: New user, all posts are their own
// Backend returns: { ids: [] }
// Frontend shows: "No posts available yet. Upload something!"
```

### 6. **Concurrent Tabs**
```javascript
// Scenario: User opens feed in 2 browser tabs
// Problem: Both tabs updating same localStorage
// Solution: Use storage event listener
window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('feed_')) {
        // Another tab updated feed state
        // Reload feed from updated localStorage
        const newState = getFeedState();
        // Update current view
    }
});
```

---

## 🧪 **Testing Checklist**

### Basic Flow:
- [ ] User A uploads post → User B sees it in feed (after 30s + refresh)
- [ ] User A doesn't see their own post in feed
- [ ] Feed order persists after page reload
- [ ] Scrolling loads more posts without duplicates
- [ ] Reaching end of feed triggers reshuffle
- [ ] Multiple users see different random orders

### localStorage Updates:
- [ ] First visit: localStorage is populated correctly
- [ ] Page reload with no new posts: Uses existing localStorage
- [ ] Page reload with new posts: localStorage is updated
- [ ] 30s polling detects new posts correctly
- [ ] Refresh button updates localStorage and resets feed
- [ ] Logout clears all feed-related localStorage

### New Post Scenarios:
- [ ] New post added → Metadata updates immediately
- [ ] User sees notification within 30s of new post
- [ ] Clicking refresh includes new post in shuffled feed
- [ ] Multiple new posts added → All appear after refresh
- [ ] User uploads own post → Doesn't see it, others do

### Edge Cases:
- [ ] Network error during refresh → Graceful fallback
- [ ] localStorage quota exceeded → Handled properly
- [ ] User has no posts to view → Shows empty state
- [ ] Concurrent tabs → Storage events sync correctly

---

## � **localStorage Update Summary (Quick Reference)**

| Trigger | What Updates | Action | localStorage State Change |
|---------|-------------|--------|--------------------------|
| **First Load** | All keys | Fetch IDs, shuffle, save | Empty → Populated |
| **Page Reload (No New Posts)** | Nothing | Use existing data | No change |
| **Page Reload (New Posts)** | All except pointer* | Re-fetch, reshuffle | IDs updated, pointer reset |
| **Scrolling Down** | Pointer only | Increment pointer | Pointer: 10 → 20 → 30... |
| **Reached End** | IDs + Pointer | Reshuffle same IDs | Same IDs, new order, pointer reset |
| **30s Check Finds New** | Nothing yet | Show notification | No change (waiting for user) |
| **User Clicks Refresh** | All keys | Re-fetch, reshuffle | Full update with new posts |
| **Auto-Refresh (Optional)** | All keys | Silent re-fetch | Full update in background |
| **User Logs Out** | All keys | Clear localStorage | All feed keys deleted |

*During page reload with new posts, pointer resets to 0 as part of the re-fetch process.

---

## 🔑 **Key Takeaways**

1. **localStorage is the source of truth** for feed order between sessions
2. **Backend metadata is the trigger** for knowing when to update
3. **Updates happen in 3 scenarios**:
   - Initial load (empty state)
   - Page reload with metadata mismatch
   - Manual/auto refresh when new posts detected
4. **Pointer updates constantly** during scrolling (most frequent update)
5. **User exclusion happens server-side**, not in localStorage
6. **30-second polling** ensures users know about new content within 30s
7. **Refresh is user-initiated by default** (can be made automatic)
8. **Feed clearing = `setFeed([])`** - Empties React state to remove all rendered posts before loading fresh ones

---

## �📊 **localStorage Structure**

```javascript
{
  "feed_post_order_v2": ["id1", "id2", "id3", ...],  // Shuffled IDs
  "feed_pointer_v2": "20",                            // Current position
  "feed_lastUpdatedAt_v2": "2026-02-27T10:30:00Z",  // Backend timestamp
  "feed_totalPosts_v2": "150"                        // Total post count
}
```

---

## 🚀 **Deployment Steps**

1. Deploy backend changes (model, controllers, routes)
2. Test endpoints via Postman
3. Deploy frontend utilities (feedManager.js)
4. Update SubmissionFeed component
5. Test with multiple user accounts
6. Monitor for localStorage quota issues
7. Add error boundaries for localStorage failures

---

## 🔮 **Future Enhancements**

1. **Redis Migration**: Move shuffle logic to server-side Redis for multi-device sync
2. **Smart Prefetching**: Preload next batch while user views current
3. **Feed Personalization**: ML-based ranking (while maintaining randomness)
4. **Offline Support**: Cache posts in IndexedDB for offline viewing
5. **Feed Analytics**: Track which posts users engage with most

---

## ⚠️ **Important Notes**

- **localStorage Limit**: ~5-10MB. With ~500 chars per ID, can store ~10,000 IDs safely
- **Version Control**: Increment `FEED_VERSION` when changing logic to force reset
- **Error Handling**: Always wrap localStorage access in try-catch
- **Performance**: Batch size of 10-15 posts balances UX and API efficiency
- **Security**: All endpoints require authentication (verifyCookies middleware)
