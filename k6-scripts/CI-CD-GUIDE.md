# Performance Testing in CI/CD

## Current Setup

### ✅ Automated in CI (`.github/workflows/ci.yml`)
- **Linting**: Runs on every push/PR
- **Unit tests**: Runs on every push/PR
- **Performance endpoint tests**: Unit tests verify endpoints work correctly

**Why this is good:**
- Fast feedback (< 2 minutes)
- Catches bugs early
- Free on GitHub Actions
- Reliable results

### 🎯 Manual Performance Testing (`.github/workflows/performance.yml`)
- **K6 load tests**: Run manually via GitHub Actions UI
- **Environment selection**: Test staging or production
- **Results stored**: Artifacts saved for 30 days

**Why manual:**
- Resource-intensive (costs money)
- Requires real database with data
- Results vary by environment
- Not needed on every commit

---

## How to Use

### Local Development (Recommended)

```bash
# Run all performance tests locally
npm run test:perf

# Or individual tests
npm run test:perf:baseline
npm run test:perf:optimized
npm run test:perf:compare
```

### Manual CI Performance Test

1. Go to **Actions** tab in GitHub
2. Select **Performance Testing** workflow
3. Click **Run workflow**
4. Choose environment (staging/production)
5. Download results from artifacts

### Testing Against Different Environments

```bash
# Test against staging
BASE_URL=https://staging.yourapp.com k6 run k6-scripts/baseline-heavy-task.js

# Test against production (be careful!)
BASE_URL=https://yourapp.com k6 run k6-scripts/baseline-heavy-task.js
```

---

## When to Run Performance Tests

### ✅ Always Run Locally When:
- Making performance-critical changes
- Optimizing database queries
- Refactoring algorithms
- Before merging large features

### ✅ Run Manual CI Test When:
- Before major releases
- After infrastructure changes
- Investigating production performance issues
- Quarterly performance audits

### ❌ Don't Run on Every Commit Because:
- Wastes CI minutes (costs money)
- Slows down development
- Results are inconsistent in CI
- Unit tests catch most issues

---

## Best Practices

### 1. Use Unit Tests for Correctness
```typescript
// app/api/heavy-task/route.test.ts
it('should return similar artists', async () => {
  const response = await GET();
  expect(response.status).toBe(200);
});
```

### 2. Use K6 for Performance
```bash
# Local performance testing
npm run test:perf:compare
```

### 3. Monitor Production
Use APM tools instead of load testing production:
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking + performance
- **New Relic**: Full APM suite
- **DataDog**: Infrastructure + APM

---

## Setting Up Secrets for CI

If you want to use the manual performance workflow:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `STAGING_URL`: Your staging environment URL
   - `PRODUCTION_URL`: Your production URL (optional)

Example:
```
STAGING_URL=https://your-app-staging.vercel.app
PRODUCTION_URL=https://your-app.vercel.app
```

---

## Cost Considerations

### GitHub Actions Free Tier
- 2,000 minutes/month for private repos
- Unlimited for public repos
- K6 tests use ~5-10 minutes per run

### Recommendation
- Keep unit tests in CI (fast, cheap)
- Run K6 tests manually (when needed)
- Use production monitoring (always on)

---

## Alternative: Scheduled Performance Tests

If you want automated performance testing without running on every commit:

```yaml
# .github/workflows/performance.yml
on:
  schedule:
    - cron: '0 2 * * 1'  # Every Monday at 2 AM
  workflow_dispatch:      # Also allow manual runs
```

This runs weekly performance tests automatically.

---

## Vercel Considerations

### ❌ Don't Load Test Vercel Preview Deployments
- Preview deployments have limited resources
- Not representative of production performance
- Can trigger rate limits
- Costs money on Pro plan

### ✅ Do Monitor Vercel Production
- Use Vercel Analytics (built-in)
- Set up Vercel Speed Insights
- Monitor function execution times
- Track Core Web Vitals

---

## Summary

| Test Type | Where | When | Why |
|-----------|-------|------|-----|
| Unit Tests | CI (automated) | Every push | Fast, reliable, catches bugs |
| K6 Load Tests | Local | During development | Immediate feedback |
| K6 Load Tests | CI (manual) | Before releases | Validate performance |
| Production Monitoring | Vercel/APM | Always | Real user data |

**Bottom line**: Keep your CI fast with unit tests, run K6 locally during development, and use monitoring for production insights.
