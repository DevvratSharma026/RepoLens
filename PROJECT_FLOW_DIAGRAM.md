# AI Code Reviewer - Complete Project Flow Diagram

## 🏗️ System Architecture Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │────────▶│  Express API │────────▶│   MongoDB   │
│  (Frontend) │         │   (Backend)  │         │  (Database) │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               │
                        ┌──────▼──────┐
                        │   Worker    │
                        │  (Background│
                        │   Process)  │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │  AWS S3     │
                        │  (Storage)  │
                        └─────────────┘
```

---

## 📋 Complete Flow: From Upload to Review Results

### **PHASE 1: Authentication & Authorization**

```
User Request
    │
    ▼
POST /v1/api/auth/login (or register)
    │
    ▼
auth.controller.js
    │
    ├─► Validates credentials
    ├─► Generates JWT token
    └─► Returns token in cookie/response
    │
    ▼
[User Authenticated] ──► Token stored in cookie
```

---

### **PHASE 2: Snapshot Creation (Two Paths)**

#### **Path A: ZIP File Upload**

```
User Uploads ZIP
    │
    ▼
POST /v1/api/repo/upload
    │
    ├─► auth.middleware.js ──► Validates JWT token
    ├─► fileUpload.middleware.js ──► Saves ZIP to tmp/uploads/
    │
    ▼
repo.controller.js → upload()
    │
    ├─► Step 1: Unzip File
    │   └─► utils/unZip.js
    │       └─► Extracts to tmp/extracted/{timestamp}/
    │
    ├─► Step 2: Detect Languages
    │   └─► utils/langDetect.js
    │       └─► Scans files, counts by extension
    │       └─► Returns languageStats: { js: 5, ts: 2, ... }
    │
    ├─► Step 3: Upload to S3
    │   └─► services/s3UploadFolder.js
    │       ├─► Walks extracted directory
    │       ├─► Uploads each file to S3
    │       └─► Returns s3Path: "s3://bucket/snapshots/{userId}/{timestamp}/"
    │
    ├─► Step 4: Create Snapshot Record
    │   └─► models/RepoSnapShot.js
    │       └─► Saves to MongoDB:
    │           {
    │             userId: ObjectId,
    │             repoName: string,
    │             s3Path: "s3://...",
    │             languageStats: {...},
    │             meta: {...}
    │           }
    │
    └─► Step 5: Cleanup
        └─► utils/cleanup.js
            ├─► Deletes tmp/uploads/{file}
            └─► Deletes tmp/extracted/{timestamp}/
    │
    ▼
Response: { snapshotId, s3Path, languageStats }
```

#### **Path B: GitHub Repository**

```
User Provides GitHub URL
    │
    ▼
POST /v1/api/github/snapshot
    │
    ├─► auth.middleware.js ──► Validates JWT token
    │
    ▼
github.controller.js → createSnapshotFromGitHub()
    │
    ├─► Step 1: Download from GitHub
    │   └─► utils/githubFetch.js
    │       ├─► Parses GitHub URL
    │       ├─► Downloads ZIP from GitHub API
    │       └─► Saves to tmp/{repo-name}.zip
    │
    ├─► Step 2: Unzip (same as Path A)
    ├─► Step 3: Detect Languages (same as Path A)
    ├─► Step 4: Upload to S3 (same as Path A)
    ├─► Step 5: Create Snapshot Record (same as Path A)
    └─► Step 6: Cleanup (same as Path A)
    │
    ▼
Response: { snapshotId, s3Path, languageStats }
```

---

### **PHASE 3: Review Request Creation**

```
User Requests Review
    │
    ▼
POST /v1/api/review/create
Body: { snapShotId: "..." }
    │
    ├─► auth.middleware.js ──► Validates JWT token
    │
    ▼
review.controller.js → createReview()
    │
    ├─► Validates snapShotId exists in DB
    │
    └─► Creates ReviewRequest in MongoDB:
        {
          snapShotId: ObjectId,
          requestBy: userId,
          status: "pending",
          result: null,
          createdAt: Date
        }
    │
    ▼
Response: { reviewId, status: "pending" }
```

**Note:** At this point, the review is queued but NOT processed yet.

---

### **PHASE 4: Worker Processing (Background)**

```
Worker Process (review.worker.js)
    │
    ├─► Connects to MongoDB
    ├─► Starts polling loop (every 5 seconds)
    │
    ▼
Polling Loop:
    │
    ├─► ProcessOnePending()
    │   │
    │   ├─► Atomically claims a "pending" review:
    │   │   ReviewRequest.findOneAndUpdate(
    │   │     { status: 'pending' },
    │   │     { status: 'processing', startedAt: Date }
    │   │   )
    │   │
    │   └─► If found, processes it:
    │
    ▼
runReviewForSnapshot()
    │
    ├─► Step 1: Parse S3 URI
    │   └─► Converts "s3://bucket/prefix/" → { bucket, prefix }
    │
    ├─► Step 2: Download from S3
    │   └─► services/s3DownloadSnapshot.js
    │       ├─► Lists all objects in S3 prefix
    │       ├─► Downloads each file
    │       └─► Saves to tmp/worker/{reviewId}/
    │
    ├─► Step 3: Select Eligible Files
    │   └─► services/fileSelect.service.js
    │       ├─► Walks directory recursively
    │       ├─► Filters by extension (.js, .jsx, .ts, .tsx)
    │       ├─► Ignores node_modules, dist, build, etc.
    │       ├─► Filters by size (max 50KB per file)
    │       ├─► Limits to 25 files (sorted by size DESC)
    │       └─► Returns array of file objects
    │
    ├─► Step 4: Chunk Files
    │   └─► services/chunker.service.js
    │       ├─► Reads each file content
    │       ├─► Splits into chunks (2000 chars each, 200 overlap)
    │       ├─► Detects language per file
    │       └─► Returns array of chunks:
    │           [
    │             {
    │               filePath: "User.js",
    │               chunkIndex: 0,
    │               totalChunks: 1,
    │               language: "javascript",
    │               content: "..."
    │             },
    │             ...
    │           ]
    │
    ├─► Step 5: Review Each Chunk with LLM
    │   └─► services/llm.service.js
    │       ├─► For each chunk:
    │       │   ├─► Builds prompt (services/promptBuilder.service.js)
    │       │   ├─► Calls OpenAI API (or compatible)
    │       │   ├─► Extracts JSON from response
    │       │   └─► Returns:
    │       │       {
    │       │         summary: "...",
    │       │         issues: [
    │       │           { type: "bug", message: "..." },
    │       │           { type: "smell", message: "..." }
    │       │         ],
    │       │         suggestions: ["...", "..."]
    │       │       }
    │       │
    │       └─► Collects all chunk results
    │
    ├─► Step 6: Aggregate Results
    │   └─► services/aggregation.service.js
    │       ├─► Merges summaries
    │       ├─► Deduplicates issues (by type + normalized message)
    │       ├─► Counts issue occurrences
    │       ├─► Collects unique suggestions
    │       └─► Returns final result:
    │           {
    │             summary: "Merged summary...",
    │             issues: [
    │               { type: "bug", message: "...", occurrences: 2 },
    │               ...
    │             ],
    │             suggestions: ["...", "..."],
    │             meta: {
    │               filesReviewed: 5,
    │               chunkAnalyzed: 8,
    │               languages: ["javascript"],
    │               truncated: false
    │             }
    │           }
    │
    └─► Step 7: Cleanup & Save
        ├─► Deletes tmp/worker/{reviewId}/ directory
        ├─► Updates ReviewRequest in MongoDB:
        │   {
        │     status: "completed",
        │     result: { ...aggregated result... },
        │     finishedAt: Date
        │   }
        └─► OR if error:
            {
              status: "failed",
              result: { error: "..." },
              finishedAt: Date
            }
```

---

### **PHASE 5: Retrieve Review Results**

```
User Checks Review Status
    │
    ▼
GET /v1/api/review/:id
    │
    ├─► auth.middleware.js ──► Validates JWT token
    │
    ▼
review.controller.js → getReview()
    │
    ├─► Finds ReviewRequest by ID
    ├─► Populates snapshot info
    │
    ▼
Response:
{
  success: true,
  review: {
    _id: "...",
    status: "completed" | "pending" | "processing" | "failed",
    result: {
      summary: "...",
      issues: [...],
      suggestions: [...],
      meta: {...}
    },
    createdAt: Date,
    startedAt: Date,
    finishedAt: Date,
    snapshot: {
      repoName: "...",
      s3Path: "...",
      languageStats: {...}
    }
  }
}
```

---

## 🔄 Complete End-to-End Flow Example

```
1. User logs in
   └─► Gets JWT token

2. User uploads ZIP file
   └─► ZIP saved to tmp/uploads/
   └─► Extracted to tmp/extracted/{timestamp}/
   └─► Language detection runs
   └─► Files uploaded to S3
   └─► Snapshot saved to MongoDB
   └─► Temp files cleaned up
   └─► Returns snapshotId

3. User creates review request
   └─► ReviewRequest created with status="pending"
   └─► Returns reviewId

4. Worker picks up review (within 5 seconds)
   └─► Status changed to "processing"
   └─► Downloads files from S3 to tmp/worker/{reviewId}/
   └─► Selects eligible files
   └─► Chunks files
   └─► Reviews each chunk with LLM
   └─► Aggregates results
   └─► Saves result to MongoDB
   └─► Cleans up tmp/worker/{reviewId}/
   └─► Status changed to "completed"

5. User fetches review results
   └─► Returns complete review with results
```

---

## 📁 Key Directories & Their Purpose

```
backend/
├── tmp/
│   ├── uploads/          # Temporary ZIP uploads (cleaned after processing)
│   ├── extracted/         # Unzipped files (cleaned after S3 upload)
│   └── worker/            # Downloaded S3 files for review (cleaned after review)
│
├── models/                # MongoDB schemas
│   ├── User.js
│   ├── RepoSnapShot.js
│   └── ReviewRequest.js
│
├── Controllers/            # Request handlers
│   ├── auth.controller.js
│   ├── repo.controller.js
│   ├── github.controller.js
│   └── review.controller.js
│
├── services/               # Business logic
│   ├── s3UploadFolder.js
│   ├── s3DownloadSnapshot.js
│   ├── fileSelect.service.js
│   ├── chunker.service.js
│   ├── llm.service.js
│   ├── promptBuilder.service.js
│   └── aggregation.service.js
│
├── utils/                  # Helper functions
│   ├── unZip.js
│   ├── langDetect.js
│   ├── githubFetch.js
│   └── cleanup.js
│
├── middlewares/            # Express middlewares
│   ├── auth.middleware.js
│   └── fileUpload.middleware.js
│
├── routes/                 # API routes
│   ├── auth.routes.js
│   ├── repo.routes.js
│   ├── github.routes.js
│   └── review.routes.js
│
└── worker/                 # Background worker
    └── review.worker.js
```

---

## 🔑 Key Data Structures

### RepoSnapShot
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  repoName: "my-repo",
  s3Path: "s3://bucket/snapshots/user123/1234567890/",
  languageStats: { js: 5, ts: 2 },
  meta: { keyPrefix: "...", source: "github" },
  createdAt: Date
}
```

### ReviewRequest
```javascript
{
  _id: ObjectId,
  snapShotId: ObjectId (ref to RepoSnapShot),
  requestBy: ObjectId (ref to User),
  status: "pending" | "processing" | "completed" | "failed",
  result: {
    summary: "...",
    issues: [{ type: "bug", message: "...", occurrences: 1 }],
    suggestions: ["..."],
    meta: { filesReviewed: 5, chunkAnalyzed: 8 }
  },
  startedAt: Date,
  finishedAt: Date,
  createdAt: Date
}
```

---

## ⚙️ Configuration & Environment Variables

```
MONGO_URI              # MongoDB connection string
S3_BUCKET              # AWS S3 bucket name
S3_REGION              # AWS S3 region
S3_KEY                 # AWS access key
S3_SECRET              # AWS secret key
OPENAI_API_KEY         # OpenAI API key
OPENAI_URL             # OpenAI API endpoint
OPENAI_MODEL           # Model name (e.g., "gpt-4")
WORKER_POLL_INTERVAL_MS # Worker polling interval (default: 5000ms)
JWT_SECRET             # JWT signing secret
PORT                   # Server port (default: 4000)
```

---

## 🚀 Worker Polling Mechanism

```
Worker starts
    │
    ▼
Connect to MongoDB
    │
    ▼
Polling Loop (every 5 seconds):
    │
    ├─► Find ONE pending review
    │   └─► Atomically update to "processing"
    │
    ├─► If found:
    │   └─► Process it completely
    │   └─► Loop immediately (no wait)
    │
    └─► If not found:
        └─► Wait 5 seconds
        └─► Poll again
```

**Why atomic update?** Prevents multiple workers from processing the same review.

---

## 🧹 Cleanup Strategy

1. **After ZIP upload processing:**
   - `tmp/uploads/{file}` → Deleted
   - `tmp/extracted/{timestamp}/` → Deleted

2. **After review processing:**
   - `tmp/worker/{reviewId}/` → Deleted (in finally block)

3. **Error handling:**
   - All cleanup wrapped in try-catch
   - Failures logged but don't crash process

---

## 📊 Status Flow

```
pending ──► processing ──► completed
   │                          │
   │                          │
   └──────────────────────────┴──► failed
```

---

## 🔍 Error Handling Points

1. **File upload errors** → 500 response, temp files cleaned
2. **S3 upload errors** → 500 response, temp files cleaned
3. **LLM API errors** → Chunk marked as failed, continues with other chunks
4. **All chunks fail** → Review marked as "failed"
5. **Worker errors** → Review marked as "failed", temp files cleaned
6. **Network errors** → Retry logic in worker (implicit via polling)

---

This diagram represents the complete flow of the AI Code Reviewer system from user interaction to final review results.

