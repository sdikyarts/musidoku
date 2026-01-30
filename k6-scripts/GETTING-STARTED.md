# Getting Started: Performance Testing Your Artist Database

## Quick Start (5 minutes)

Want to see the performance difference immediately? Run this:

```bash
# 1. Make sure your dev server is running
npm run dev

# 2. Run the automated test script
./k6-scripts/quick-test.sh
```

This will:
- Test both endpoints (unoptimized and optimized)
- Show you the processing time difference
- Optionally run full K6 load tests

---

## What You'll Learn

This tutorial teaches you how to:

1. ✅ **Identify performance bottlenecks** using profiling tools
2. ✅ **Measure performance** with K6 load testing
3. ✅ **Optimize code** using algorithmic and architectural improvements
4. ✅ **Verify improvements** with before/after comparisons

---

## The Scenario

We've created a realistic API endpoint that finds similar artists:

**Endpoint**: `/api/heavy-task`
- Takes a random artist from your database
- Compares them with all other artists
- Calculates similarity based on genres and names
- Returns top 10 most similar artists

**The Problem**: This is slow because it:
- Loads thousands of artists into memory
- Uses inefficient O(n²) algorithms
- Performs expensive string operations on every artist
- Doesn't filter or optimize at the database level

**The Solution**: `/api/heavy-task-optimized`
- Filters at database level (only relevant artists)
- Uses efficient data structures (Set instead of nested loops)
- Implements early termination (skip unlikely matches)
- Reduces memory allocations

---

## Prerequisites

### 1. Install K6

```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows
choco install k6
```

Or download from: https://k6.io/docs/getting-started/installation/

### 2. Ensure Database Has Data

```bash
npm run db:import
```

This imports artists from `artist.csv` into your database.

### 3. Install jq (for JSON parsing in scripts)

```bash
# macOS
brew install jq

# Linux
sudo apt-get install jq

# Windows
choco install jq
```

---

## Step-by-Step Workflow

### Step 1: Manual Testing (2 minutes)

First, verify both endpoints work:

```bash
# Test unoptimized endpoint
curl http://localhost:3000/api/heavy-task | jq '.metadata'

# Test optimized endpoint
curl http://localhost:3000/api/heavy-task-optimized | jq '.metadata'
```

Compare the `processing_time_ms` values. The optimized version should be significantly faster.

### Step 2: Baseline Load Test (3 minutes)

Run K6 against the unoptimized endpoint:

```bash
k6 run k6-scripts/baseline-heavy-task.js
```

**What to look for:**
- `http_req_duration` (avg): Average response time
- `http_req_duration` (p95): 95th percentile (worst case)
- `http_reqs`: Requests per second (throughput)

**Save these numbers** - you'll compare them later.

### Step 3: Profile the Code (5 minutes)

Find out WHERE the code is slow:

```bash
# Stop your dev server (Ctrl+C)

# Restart with Node.js inspector
NODE_OPTIONS='--inspect' npm run dev
```

Then:
1. Open Chrome and go to `chrome://inspect`
2. Click "inspect" under your Node.js process
3. Go to "Profiler" tab
4. Click "Start"
5. In another terminal: `curl http://localhost:3000/api/heavy-task`
6. Click "Stop" in Chrome DevTools

**Analyze the flame chart:**
- Look for the widest bars (most time spent)
- You should see `calculateGenreSimilarity` and `levenshteinDistance` taking most of the time

### Step 4: Review Optimizations (5 minutes)

Open these files side-by-side:
- `app/api/heavy-task/route.ts` (unoptimized)
- `app/api/heavy-task-optimized/route.ts` (optimized)

Read the comments to understand what changed. Key improvements:
1. Database filtering (reduce dataset)
2. Set-based lookups (O(n) instead of O(n²))
3. Early termination (skip unlikely matches)
4. Memory-efficient algorithms

See `k6-scripts/OPTIMIZATION-GUIDE.md` for detailed explanations.

### Step 5: Test Optimized Version (3 minutes)

Run K6 against the optimized endpoint:

```bash
k6 run k6-scripts/optimized-heavy-task.js
```

**Compare with baseline:**
- Response time should be 50-80% faster
- Throughput should be 2-4x higher
- P95 latency should be more consistent

### Step 6: Side-by-Side Comparison (5 minutes)

Run both endpoints simultaneously:

```bash
k6 run k6-scripts/comparison-test.js
```

This will show you the performance difference under the same load conditions.

---

## Understanding the Results

### Good Results

```
Baseline:
  http_req_duration: avg=2.5s  p95=4.2s
  http_reqs: 2.4/s

Optimized:
  http_req_duration: avg=600ms  p95=1.1s
  http_reqs: 9/s

Improvement: 76% faster, 275% more throughput
```

### What If Results Are Similar?

If you don't see much improvement:
1. **Database might be small**: With <100 artists, the difference is minimal
2. **Database is slow**: The optimization assumes DB queries are fast
3. **CPU is very fast**: On powerful machines, the unoptimized version might still be "fast enough"

Try increasing the load (more concurrent users) to see the difference.

---

## Next Steps

### Apply to Your Own Code

Look for these patterns in your existing API endpoints:

1. **Loading all records**: Use WHERE clauses and LIMIT
2. **Nested loops**: Use Set/Map for lookups
3. **Expensive operations on every item**: Add early termination
4. **Large memory allocations**: Use streaming or pagination

### Set Up Continuous Testing

Add performance tests to your CI/CD:

```yaml
# .github/workflows/performance.yml
name: Performance Tests
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run dev &
      - run: k6 run k6-scripts/baseline-heavy-task.js
```

### Monitor in Production

Use tools like:
- **New Relic**: APM and profiling
- **DataDog**: Metrics and traces
- **Sentry**: Error tracking with performance monitoring
- **Prometheus + Grafana**: Custom metrics

---

## Troubleshooting

### "k6: command not found"
Install K6 (see Prerequisites above)

### "Connection refused"
Make sure your dev server is running: `npm run dev`

### "No artists found"
Import data: `npm run db:import`

### Tests are too slow
Reduce concurrent users in K6 scripts:
```javascript
stages: [
  { duration: '30s', target: 5 },  // Lower number
]
```

### Server crashes under load
Increase Node.js memory:
```bash
NODE_OPTIONS='--max-old-space-size=4096' npm run dev
```

---

## Resources

- **Full Tutorial**: `k6-scripts/README.md`
- **Optimization Guide**: `k6-scripts/OPTIMIZATION-GUIDE.md`
- **K6 Documentation**: https://k6.io/docs/
- **Node.js Profiling**: https://nodejs.org/en/docs/guides/simple-profiling/
- **Chrome DevTools**: https://developer.chrome.com/docs/devtools/performance/

---

## Questions?

Common questions answered in `k6-scripts/README.md`:

- How do I read a flame chart?
- What's a good response time?
- When should I optimize?
- How do I profile production code?
- What are performance budgets?

Happy optimizing! 🚀
