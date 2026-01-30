# Artist Similarity Search: Optimization Case Study

## The Problem

Your artist database has thousands of artists. Users want to find similar artists based on:
- **Genre overlap** (e.g., both artists have "pop" and "rock")
- **Name similarity** (e.g., "The Beatles" vs "Beatles")

The naive approach loads all artists and compares each one - this is slow and doesn't scale.

---

## Bottleneck Analysis

### Unoptimized Code (`/api/heavy-task`)

```typescript
// ❌ PROBLEM 1: Load ALL artists into memory
const allArtists = await db.select().from(artists);
// If you have 5,000 artists, this loads 5,000 records

// ❌ PROBLEM 2: Compare with EVERY artist (O(n²) for genres)
const similarities = allArtists.map(artist => {
  // For each artist, loop through all genres
  for (const g1 of genres1) {
    for (const g2 of genres2) {  // Nested loop!
      if (g1 === g2) matchCount++;
    }
  }
  
  // ❌ PROBLEM 3: Calculate expensive string distance for ALL
  const distance = levenshteinDistance(name1, name2);
  // This creates a full matrix: O(m * n) space and time
  
  return { artist, score };
})
// ❌ PROBLEM 4: Sort entire array
.sort((a, b) => b.score - a.score)
.slice(0, 10);  // We only need 10, but we sorted thousands!
```

### Performance Impact

With 5,000 artists:
- **5,000 database records** loaded
- **5,000 genre comparisons** (each with nested loops)
- **5,000 Levenshtein calculations** (each allocating a matrix)
- **5,000 items sorted** (we only need top 10)

**Result**: 2-5 seconds per request, low throughput

---

## The Optimizations

### 1. Database-Level Filtering

```typescript
// ✅ Filter at database level - only get relevant artists
const candidateArtists = await db
  .select({
    spotify_id: artists.spotify_id,
    scraper_name: artists.scraper_name,
    genres: artists.genres,
  })
  .from(artists)
  .where(sql`${artists.primary_genre} = ${targetArtist.primary_genre}`)
  .limit(500);
```

**Impact**: 
- Reduces dataset from 5,000 to ~500 artists
- Only selects needed columns (not all fields)
- 90% less data to process in memory

### 2. Algorithmic Improvement: Set-Based Comparison

```typescript
// ❌ BEFORE: O(n²) nested loops
for (const g1 of genres1) {
  for (const g2 of genres2) {
    if (g1 === g2) matchCount++;
  }
}

// ✅ AFTER: O(n) with Set lookup
const genres2Set = new Set(genres2);
for (const g1 of genres1) {
  if (genres2Set.has(g1)) {  // O(1) lookup
    matchCount++;
  }
}
```

**Impact**:
- Genre comparison: O(n²) → O(n)
- For 10 genres each: 100 operations → 10 operations
- 10x faster per comparison

### 3. Early Termination

```typescript
// ✅ Skip expensive calculations for low-similarity candidates
const genreSimilarity = calculateGenreSimilarity(genres1, genres2);

if (genreSimilarity < 0.3) {
  continue;  // Don't calculate name similarity
}

const nameSimilarity = quickNameSimilarity(name1, name2);
```

**Impact**:
- Avoids ~70% of expensive string distance calculations
- Only calculates when genre similarity is promising

### 4. Memory-Efficient String Distance

```typescript
// ❌ BEFORE: Full matrix O(m*n) space
const dp: number[][] = Array(m + 1)
  .fill(0)
  .map(() => Array(n + 1).fill(0));

// ✅ AFTER: Two arrays O(n) space
let prev = Array(n + 1).fill(0);
let curr = Array(n + 1).fill(0);
// Reuse arrays instead of allocating matrix
```

**Impact**:
- Memory: O(m*n) → O(n)
- For 50-char names: 2,500 cells → 50 cells
- Less memory allocation = less garbage collection

### 5. Partial Sorting

```typescript
// ✅ Only keep candidates above threshold
if (score >= minScore) {
  topSimilar.push({ artist, score });
}

// ✅ Sort only the filtered results
topSimilar.sort((a, b) => b.score - a.score);
const top10 = topSimilar.slice(0, 10);
```

**Impact**:
- Sort ~200 items instead of 5,000
- Could further optimize with a min-heap for top-K

---

## Performance Comparison

### Expected Results

| Metric | Unoptimized | Optimized | Improvement |
|--------|-------------|-----------|-------------|
| **Avg Response Time** | 2,500ms | 600ms | 76% faster |
| **P95 Response Time** | 4,200ms | 1,100ms | 74% faster |
| **Throughput** | 2.4 req/s | 9 req/s | 275% more |
| **Memory per Request** | ~50MB | ~5MB | 90% less |

### Flame Chart Comparison

**Before Optimization:**
```
┌─────────────────────────────────────────────────┐
│ GET /api/heavy-task                             │ 100%
├─────────────────────────────────────────────────┤
│ ├─ Database Query                               │ 10%
│ ├─ calculateGenreSimilarity ████████████████    │ 40%
│ ├─ levenshteinDistance ████████████████████     │ 45%
│ └─ Array.sort ████                              │ 5%
└─────────────────────────────────────────────────┘
```

**After Optimization:**
```
┌─────────────────────────────────────────────────┐
│ GET /api/heavy-task-optimized                   │ 100%
├─────────────────────────────────────────────────┤
│ ├─ Database Query ████████████████████          │ 60%
│ ├─ calculateGenreSimilarityOptimized ████       │ 20%
│ ├─ quickNameSimilarity ████                     │ 15%
│ └─ Array.sort █                                 │ 5%
└─────────────────────────────────────────────────┘
```

Notice:
- Database query is now the dominant operation (good - it's optimized by Postgres)
- CPU-intensive operations are much smaller
- Overall execution time is 76% shorter

---

## Key Takeaways

### 1. Profile Before Optimizing
- Use Chrome DevTools or Node.js profiler
- Look for the widest bars in flame charts
- Measure baseline performance with K6

### 2. Optimize at Multiple Levels
- **Database**: Filter and limit data early
- **Algorithm**: Use appropriate data structures (Set vs Array)
- **Memory**: Reduce allocations and GC pressure
- **Logic**: Early termination for unlikely candidates

### 3. Verify Your Optimizations
- Run load tests before and after
- Compare flame charts
- Measure real-world impact

### 4. Common Patterns to Avoid
- ❌ Loading all data when you need a subset
- ❌ Nested loops when a Set/Map would work
- ❌ Sorting entire arrays when you need top-K
- ❌ Expensive calculations without early termination
- ❌ Allocating large objects in hot paths

### 5. Common Patterns to Use
- ✅ Database-level filtering with WHERE clauses
- ✅ Set/Map for O(1) lookups instead of O(n) searches
- ✅ Early termination with threshold checks
- ✅ Streaming or pagination for large datasets
- ✅ Caching for frequently accessed data

---

## Real-World Applications

These optimization techniques apply to many scenarios in your artist database:

1. **Search autocomplete**: Use trie or prefix indexes instead of LIKE queries
2. **Recommendation engine**: Pre-compute similarity scores, use collaborative filtering
3. **Analytics dashboards**: Aggregate at database level, cache results
4. **Playlist generation**: Use graph algorithms, limit search space
5. **Duplicate detection**: Use fuzzy hashing (MinHash, SimHash) instead of pairwise comparison

---

## Further Reading

- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [K6 Load Testing Guide](https://k6.io/docs/)
- [Chrome DevTools Profiling](https://developer.chrome.com/docs/devtools/performance/)
- [Big O Notation Cheat Sheet](https://www.bigocheatsheet.com/)
- [Database Indexing Strategies](https://use-the-index-luke.com/)
