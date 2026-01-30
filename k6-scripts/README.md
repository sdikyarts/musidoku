# Performance Testing & Optimization Workflow

This guide walks you through performance testing and optimization for the Artist Database API, following industry best practices for profiling and load testing.

## 📚 Documentation Index

- **[GETTING-STARTED.md](./GETTING-STARTED.md)** - Quick 5-minute start guide
- **[WORKFLOW-DIAGRAM.md](./WORKFLOW-DIAGRAM.md)** - Visual workflow with diagrams
- **[OPTIMIZATION-GUIDE.md](./OPTIMIZATION-GUIDE.md)** - Deep dive into optimization techniques
- **[SUMMARY.md](./SUMMARY.md)** - Overview of what was created
- **[README.md](./README.md)** - This file (complete tutorial)

## 🚀 Quick Start

```bash
# 1. Ensure database has data
npm run db:import

# 2. Start dev server
npm run dev

# 3. Run automated performance tests (in another terminal)
npm run test:perf
```

## Overview

We've created a realistic performance scenario: **Artist Similarity Search**
- Finds similar artists based on genre overlap and name similarity
- Demonstrates common bottlenecks: O(n²) algorithms, inefficient string operations, excessive memory usage
- Two implementations: unoptimized (`/api/heavy-task`) and optimized (`/api/heavy-task-optimized`)

## Prerequisites

1. **Install K6** (load testing tool)
   ```bash
   # macOS
   brew install k6
   
   # Or download from https://k6.io/docs/getting-started/installation/
   ```

2. **Ensure your database has artist data**
   ```bash
   npm run db:import
   ```

3. **Start your Next.js dev server**
   ```bash
   npm run dev
   ```

---

## Step 1: Establish Baseline Performance

### Goal
Measure the unoptimized endpoint's performance under load.

### Actions

1. **Quick manual test** to verify the endpoint works:
   ```bash
   curl http://localhost:3000/api/heavy-task | jq
   ```
   
   You should see a response with `target_artist`, `similar_artists`, and `metadata.processing_time_ms`.

2. **Run K6 baseline load test**:
   ```bash
   k6 run k6-scripts/baseline-heavy-task.js
   ```

### What to Record

From the K6 output, note these key metrics:
- **http_req_duration (avg)**: Average response time
- **http_req_duration (p95)**: 95th percentile response time
- **http_reqs**: Total requests per second (throughput)
- **iterations**: Total completed requests

Example baseline results:
```
http_req_duration..............: avg=2.5s  p95=4.2s
http_reqs......................: 120 (2.4/s)
```

---

## Step 2: Profile the Bottleneck

### Goal
Identify which specific functions are consuming the most CPU time.

### Method A: Chrome DevTools (Recommended for Node.js)

1. **Stop your dev server** (Ctrl+C)

2. **Restart with Node.js inspector enabled**:
   ```bash
   NODE_OPTIONS='--inspect' npm run dev
   ```

3. **Open Chrome DevTools**:
   - Open Chrome browser
   - Navigate to `chrome://inspect`
   - Click "inspect" under your Node.js process
   - Go to the "Profiler" tab

4. **Start CPU profiling**:
   - Click "Start"
   - In another terminal, trigger the endpoint multiple times:
     ```bash
     for i in {1..5}; do curl http://localhost:3000/api/heavy-task; done
     ```
   - Click "Stop" in DevTools

5. **Analyze the Flame Chart**:
   - Look for the **widest bars** - these represent functions consuming the most time
   - You should see:
     - `calculateGenreSimilarity` - nested loops
     - `levenshteinDistance` - full matrix allocation
     - `.map()` and `.sort()` operations on large arrays

### Method B: Node.js Built-in Profiler

```bash
# Generate CPU profile
node --cpu-prof --cpu-prof-dir=./results node_modules/.bin/next dev

# Trigger the endpoint
curl http://localhost:3000/api/heavy-task

# Stop the server (Ctrl+C)
# Profile will be saved in ./results/
```

Analyze with:
```bash
# Install clinic.js for visualization
npm install -g clinic

# Or use speedscope.app (upload the .cpuprofile file)
```

### What to Look For

The profiler should reveal:
1. **Nested loops** in `calculateGenreSimilarity` (O(n²) complexity)
2. **Full matrix allocation** in `levenshteinDistance`
3. **Large array operations** (map, filter, sort on all artists)
4. **No database-level filtering** (loading all records)

---

## Step 3: Understand the Optimizations

Before testing the optimized version, review what was improved:

### Optimization 1: Database-Level Filtering
```typescript
// BEFORE: Load ALL artists
const allArtists = await db.select().from(artists);

// AFTER: Filter by primary genre at database level
const candidateArtists = await db
  .select({ /* only needed fields */ })
  .from(artists)
  .where(sql`${artists.primary_genre} = ${targetArtist.primary_genre}`)
  .limit(500);
```
**Impact**: Reduces dataset from thousands to hundreds

### Optimization 2: Set-Based Genre Comparison
```typescript
// BEFORE: O(n²) nested loops
for (const g1 of genres1) {
  for (const g2 of genres2) {
    if (g1 === g2) matchCount++;
  }
}

// AFTER: O(n) with Set
const genres2Set = new Set(genres2);
for (const g1 of genres1) {
  if (genres2Set.has(g1)) matchCount++;
}
```
**Impact**: Reduces genre comparison from O(n²) to O(n)

### Optimization 3: Early Termination
```typescript
// Skip expensive calculations for low-similarity candidates
if (genreSimilarity < minScore) continue;
```
**Impact**: Avoids unnecessary string distance calculations

### Optimization 4: Memory-Efficient Levenshtein
```typescript
// BEFORE: Full matrix O(m*n) space
const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

// AFTER: Single array O(n) space
let prev = Array(n + 1).fill(0);
let curr = Array(n + 1).fill(0);
```
**Impact**: Reduces memory allocation and GC pressure

---

## Step 4: Test Optimized Version

### Actions

1. **Quick manual test**:
   ```bash
   curl http://localhost:3000/api/heavy-task-optimized | jq
   ```
   
   Compare `metadata.processing_time_ms` with the unoptimized version.

2. **Run K6 optimized load test**:
   ```bash
   k6 run k6-scripts/optimized-heavy-task.js
   ```

3. **Run side-by-side comparison**:
   ```bash
   k6 run k6-scripts/comparison-test.js
   ```

### What to Record

Compare with baseline:
- Response time improvement (should be 50-80% faster)
- Throughput increase (more requests/second)
- Lower p95 latency (more consistent performance)

Example optimized results:
```
http_req_duration..............: avg=600ms  p95=1.1s
http_reqs......................: 450 (9/s)
Improvement: 76%
```

---

## Step 5: Profile Again (Verification)

### Goal
Verify that the bottlenecks have been eliminated.

### Actions

1. **Profile the optimized endpoint**:
   ```bash
   NODE_OPTIONS='--inspect' npm run dev
   ```

2. **Capture CPU profile** while hitting `/api/heavy-task-optimized`

3. **Compare flame charts**:
   - The widest bars should now be database queries, not CPU-intensive loops
   - String operations should be minimal
   - Overall execution time should be significantly shorter

---

## Step 6: Generate Performance Report

### Create a comparison document

```bash
# Run both tests and save results
k6 run k6-scripts/baseline-heavy-task.js > results/baseline-results.txt
k6 run k6-scripts/optimized-heavy-task.js > results/optimized-results.txt
k6 run k6-scripts/comparison-test.js > results/comparison-results.txt
```

### Key Metrics to Report

| Metric | Baseline | Optimized | Improvement |
|--------|----------|-----------|-------------|
| Avg Response Time | ___ ms | ___ ms | ___% |
| P95 Response Time | ___ ms | ___ ms | ___% |
| Throughput (req/s) | ___ | ___ | ___% |
| Error Rate | ___% | ___% | ___% |

---

## Additional Experiments

### Experiment 1: Increase Load
Modify the K6 stages to test with more concurrent users:
```javascript
stages: [
  { duration: '1m', target: 50 },
  { duration: '2m', target: 50 },
]
```

### Experiment 2: Database Query Optimization
Add database indexes:
```sql
CREATE INDEX idx_artists_primary_genre ON artists(primary_genre);
CREATE INDEX idx_artists_genres ON artists USING gin(to_tsvector('english', genres));
```

### Experiment 3: Caching
Add Redis caching for frequently requested similar artists.

---

## Troubleshooting

### K6 not installed
```bash
brew install k6
```

### Database connection errors
Check your `.env.local` file has correct `DATABASE_URL`.

### Server crashes under load
Reduce K6 concurrent users or increase Node.js memory:
```bash
NODE_OPTIONS='--max-old-space-size=4096' npm run dev
```

### No artists in database
```bash
npm run db:import
```

---

## Learning Outcomes

After completing this workflow, you should understand:

1. ✅ How to establish performance baselines with K6
2. ✅ How to profile Node.js applications with Chrome DevTools
3. ✅ How to identify CPU bottlenecks in flame charts
4. ✅ Common optimization techniques (algorithmic, database, memory)
5. ✅ How to verify optimizations with load testing
6. ✅ How to generate performance comparison reports

---

## Next Steps

- Apply these techniques to other endpoints in your API
- Set up continuous performance testing in CI/CD
- Implement monitoring with tools like New Relic or DataDog
- Create performance budgets for your API endpoints
