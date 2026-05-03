# JoTube Implementation Roadmap

This plan outlines the evolution of JoTube from its current state to a production-ready video platform, organized by priority and implementation logic.

---

## Phase 1: Core Features & UX Polish (Immediate Gaps)
*Focus: Completing the "Creator-to-Fan" loop and essential engagement features.*

<!-- ### 2. Studio Content Management
- **Video Management:** Add a "Content" tab to the Studio where creators can edit titles/descriptions or delete videos.
- **Visibility Controls:** Add "Draft," "Private," or "Unlisted" options for video processing and privacy. -->

### 3. Engagement Depth
- **Comment Replies:** Transform the flat comment list into threaded conversations.
- **Creator Interaction:** Allow creators to "heart" comments to build community.

<!-- ### 4. Personalization & Discovery
- **Search Filters:** Add sorting (Most Recent/Most Views) and filters to the search results.
- **Infinite Scroll:** Implement automatic loading as users reach the bottom of the Home and Search feeds. -->

### 5. Visual "Pro" Polish
- **Skeleton Loading:** Use shimmer effects for every page load (not just Watch Later) to make the app feel faster.
- **Dark Mode Toggle:** Add a manual switch in the user menu.

---

## Phase 2: Technical Foundation & Security (Hardening)
*Focus: Securing the platform and optimizing for initial growth.*

### 1. API Security & Validation
- **Input Sanitization:** Sanitize comments and descriptions to prevent XSS.
- **Zod Everywhere:** strictly define schemas for every route; never trust `req.body` directly.
- **Security Headers:** Integrate `helmet` middleware for standard production headers.

### 2. Database Optimization
- **Database Indexes:** Add explicit `@@index` on high-traffic columns (`videoId` in `Comment`, `channelId` in `Video`).
- **Cursor Pagination:** Switch from bulk fetches to Prisma cursor-based pagination for feeds.
- **N+1 Query Check:** Use specific `select` statements instead of broad `include` to keep JSON payloads small.

### 3. Architecture
- **Global Error Handler:** Centralize error management to avoid leaking stack traces and ensure consistent JSON responses.
- **Rate Limiting:** Implement `express-rate-limit` to prevent spamming of upload/comment APIs.

---

## Phase 3: Advanced Media & Architecture (Scalability)
*Focus: Scaling video delivery and offloading heavy tasks.*

### 1. Background Workers
- **Decoupling:** Move file transfers to GCS and thumbnail generation to background workers (BullMQ or RabbitMQ).
- **Auto-generated Thumbnails:** Generate 3-4 frame-based options for creators to choose from.
<!-- 
### 2. Video Infrastructure
- **Transcoding/Encoding:** Process videos into multiple resolutions (360p - 1080p) using HLS or DASH. -->
- **CDN Integration:** Cache videos globally via CloudFront or Cloudflare to eliminate buffering.

<!-- ### 3. Storage & Privacy
- **Signed URLs:** Use temporary access links for unauthorized/private content instead of public buckets.
- **Streaming Headers:** Ensure correct `Content-Range` headers for smooth timeline scrubbing. -->

---

## Phase 4: Pro Features & Monitoring (The "Finish")
*Focus: Advanced social features and production observability.*

### 1. Retention Features
- **Resume Playback:** Save the `currentTime` to the database so users can pick up where they left off.
- **Subscriptions Feed:** A dedicated feed for videos only from followed channels.
- **Playlists:** Allow users to create collections and play them in sequence.

### 2. Advanced UX
- **Miniplayer:** Allow browsing while watching in a small corner.
- **Share with Timestamp:** Option to start video sharing at the current playhead.

### 3. Monitoring & SEO
- **Error Logging:** Implement Sentry to capture production bugs in real-time.
- **SEO & Social:** Dynamic Meta/OG tags for video sharing and SSR for Google indexing.
- **Basic Analytics:** A simple creator dashboard showing views/likes over the last 30 days.