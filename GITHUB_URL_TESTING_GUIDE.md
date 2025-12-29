# GitHub URL Testing Guide

## 📍 Endpoint Details

**Endpoint:** `POST /v1/api/github/snapshot`  
**Authentication:** Required (JWT token in cookie or Authorization header)  
**Content-Type:** `application/json`

---

## 🔑 Step 1: Get Authentication Token

First, you need to authenticate to get a JWT token:

### Option A: Login (if you have an account)
```http
POST http://localhost:4000/v1/api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

### Option B: Register (if you don't have an account)
```http
POST http://localhost:4000/v1/api/auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Response will include a cookie with JWT token** (or you can extract it from response if configured)

---

## 🧪 Step 2: Test GitHub URL Snapshot Creation

### Using Postman/API Client:

```http
POST http://localhost:4000/v1/api/github/snapshot
Content-Type: application/json
Cookie: token=YOUR_JWT_TOKEN_HERE
# OR
Authorization: Bearer YOUR_JWT_TOKEN_HERE

{
  "repoUrl": "https://github.com/expressjs/express"
}
```

### Using cURL:

```bash
curl -X POST http://localhost:4000/v1/api/github/snapshot \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "repoUrl": "https://github.com/expressjs/express"
  }'
```

---

## ✅ Supported GitHub URL Formats

The system supports various GitHub URL formats:

### 1. Basic Repository URL (Main/Master branch)
```
https://github.com/expressjs/express
https://github.com/facebook/react
https://github.com/microsoft/vscode
```

### 2. Repository URL with .git extension
```
https://github.com/expressjs/express.git
```

### 3. Repository URL with specific branch
```
https://github.com/expressjs/express/tree/main
https://github.com/expressjs/express/tree/master
https://github.com/expressjs/express/tree/v4.18.0
```

### 4. Repository URL with blob path (will use branch)
```
https://github.com/expressjs/express/blob/main/README.md
```

**Note:** If no branch is specified, it tries `main` first, then `master`.

---

## 📝 Example Test Cases

### Test Case 1: Small Public Repository
```json
{
  "repoUrl": "https://github.com/octocat/Hello-World"
}
```

### Test Case 2: Repository with Specific Branch
```json
{
  "repoUrl": "https://github.com/expressjs/express/tree/main"
}
```

### Test Case 3: Your Own Repository
```json
{
  "repoUrl": "https://github.com/YOUR_USERNAME/YOUR_REPO"
}
```

---

## 📤 Expected Response (Success)

```json
{
  "success": true,
  "message": "Github repo snapshot created",
  "snapshotId": "6950e1234567890abcdef123",
  "s3Path": "s3://your-bucket/snapshots/user123/1766907864617/",
  "languageStats": {
    "js": 45,
    "ts": 12,
    "json": 8
  }
}
```

**Save the `snapshotId`** - you'll need it for the next step!

---

## ❌ Error Responses

### Missing repoUrl
```json
{
  "success": false,
  "message": "RepoURL is required"
}
```

### Invalid GitHub URL
```json
{
  "success": false,
  "message": "Failed to create snapshot from github",
  "error": "Invalid github url"
}
```

### Repository Not Found / Access Denied
```json
{
  "success": false,
  "message": "Failed to create snapshot from github",
  "error": "Failed to download GitHub for owner/repo. Last error: Request failed with status code 404"
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## 🔄 Step 3: Create Review Request (After Snapshot)

Once you have the `snapshotId`, create a review request:

```http
POST http://localhost:4000/v1/api/review/create
Content-Type: application/json
Cookie: token=YOUR_JWT_TOKEN_HERE

{
  "snapShotId": "6950e1234567890abcdef123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review request created",
  "reviewId": "6950e1234567890abcdef456",
  "status": "pending"
}
```

---

## 🔍 Step 4: Check Review Status

Poll the review endpoint to check when it's completed:

```http
GET http://localhost:4000/v1/api/review/6950e1234567890abcdef456
Cookie: token=YOUR_JWT_TOKEN_HERE
```

**Response (while processing):**
```json
{
  "success": true,
  "review": {
    "_id": "6950e1234567890abcdef456",
    "status": "processing",
    "result": null,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "startedAt": "2024-01-15T10:00:05.000Z",
    "finishedAt": null,
    "snapshot": {
      "repoName": "express",
      "s3Path": "s3://...",
      "languageStats": {...}
    }
  }
}
```

**Response (completed):**
```json
{
  "success": true,
  "review": {
    "_id": "6950e1234567890abcdef456",
    "status": "completed",
    "result": {
      "summary": "This repository contains...",
      "issues": [
        {
          "type": "bug",
          "message": "...",
          "occurrences": 1
        }
      ],
      "suggestions": ["...", "..."],
      "meta": {
        "filesReviewed": 25,
        "chunkAnalyzed": 45,
        "languages": ["javascript"],
        "truncated": false
      }
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "startedAt": "2024-01-15T10:00:05.000Z",
    "finishedAt": "2024-01-15T10:02:30.000Z"
  }
}
```

---

## 🧪 Complete Testing Workflow

### 1. Authenticate
```bash
# Login or Register
POST /v1/api/auth/login
# Save the JWT token from cookie/response
```

### 2. Create Snapshot from GitHub
```bash
POST /v1/api/github/snapshot
Body: { "repoUrl": "https://github.com/expressjs/express" }
# Save snapshotId from response
```

### 3. Create Review Request
```bash
POST /v1/api/review/create
Body: { "snapShotId": "<snapshotId from step 2>" }
# Save reviewId from response
```

### 4. Poll Review Status
```bash
GET /v1/api/review/<reviewId>
# Keep polling until status is "completed" or "failed"
```

---

## 🐛 Troubleshooting

### Issue: "Invalid github url"
- **Cause:** URL format not recognized
- **Solution:** Use format: `https://github.com/owner/repo` or `https://github.com/owner/repo/tree/branch`

### Issue: "Failed to download GitHub"
- **Cause:** Repository doesn't exist, is private, or branch doesn't exist
- **Solution:** 
  - Verify the repository is public
  - Check the branch name (try `main` or `master`)
  - Ensure the URL is correct

### Issue: "Unauthorized"
- **Cause:** Missing or invalid JWT token
- **Solution:** Re-authenticate and get a new token

### Issue: Snapshot created but review fails
- **Check:** Worker is running (`node worker/review.worker.js`)
- **Check:** LLM configuration is correct (OPENAI_API_KEY, etc.)
- **Check:** S3 credentials are correct

---

## 📊 What Happens Behind the Scenes

1. **URL Parsing:** Extracts owner, repo, and branch from GitHub URL
2. **Download:** Downloads repository as ZIP from GitHub
3. **Extract:** Unzips to temporary directory
4. **Language Detection:** Scans files and counts by extension
5. **S3 Upload:** Uploads all files to S3
6. **Database:** Creates RepoSnapshot record
7. **Cleanup:** Removes temporary files

Then when you create a review:
1. **Worker picks up** the pending review
2. **Downloads** files from S3
3. **Selects** eligible files (JS/TS, <50KB, max 25 files)
4. **Chunks** files into reviewable pieces
5. **Reviews** each chunk with LLM
6. **Aggregates** results
7. **Saves** to database

---

## ✅ Quick Test Checklist

- [ ] Server is running (`npm start` or `nodemon index.js`)
- [ ] Worker is running (`node worker/review.worker.js`)
- [ ] You have a valid JWT token
- [ ] GitHub repository is public
- [ ] Repository has code files (not empty)
- [ ] S3 credentials are configured
- [ ] LLM API credentials are configured

---

## 🎯 Recommended Test Repositories

Here are some good repositories to test with:

1. **Small & Simple:**
   - `https://github.com/octocat/Hello-World`

2. **Medium Size:**
   - `https://github.com/expressjs/express` (main branch)
   - `https://github.com/axios/axios`

3. **TypeScript:**
   - `https://github.com/microsoft/TypeScript` (specific branch)

4. **Your Own Repo:**
   - Use a small test repository you own

---

## 💡 Tips

1. **Start Small:** Test with a small repository first
2. **Check Logs:** Watch both server and worker console logs
3. **Verify S3:** Check that files are uploaded to S3
4. **Monitor Worker:** Ensure worker is processing reviews
5. **Test Different Branches:** Try repositories with different branch names

---

Happy Testing! 🚀

