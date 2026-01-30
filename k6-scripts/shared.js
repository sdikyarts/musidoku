// k6-scripts/shared.js
// Shared utilities for K6 tests

/**
 * Common K6 test options for performance testing
 */
export const commonOptions = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% of requests should be below 5s
    errors: ['rate<0.1'],              // Error rate should be below 10%
  },
};

/**
 * Common checks for artist similarity endpoints
 */
export function createArtistChecks() {
  return {
    'status is 200': (r) => r.status === 200,
    'response has target_artist': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.target_artist !== undefined;
      } catch {
        return false;
      }
    },
    'response has similar_artists': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.similar_artists);
      } catch {
        return false;
      }
    },
    'processing time recorded': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.metadata?.processing_time_ms !== undefined;
      } catch {
        return false;
      }
    },
  };
}

/**
 * Log processing time from response
 */
export function logProcessingTime(response) {
  if (response.status === 200) {
    try {
      const body = JSON.parse(response.body);
      console.log(`Processing time: ${body.metadata.processing_time_ms}ms`);
    } catch {
      // Ignore parse errors
    }
  }
}

/**
 * Get base URL from environment or default to localhost
 */
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}
