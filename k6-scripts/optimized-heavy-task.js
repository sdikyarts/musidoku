// k6-scripts/optimized-heavy-task.js
// K6 Load Test for OPTIMIZED heavy-task endpoint
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s (stricter)
    errors: ['rate<0.1'],              // Error rate should be below 10%
  },
};

export default function () {
  const url = 'http://localhost:3000/api/heavy-task-optimized';
  
  const response = http.get(url);
  
  const success = check(response, {
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
    'optimized flag is true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.metadata?.optimized === true;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  
  // Log processing time for analysis
  if (response.status === 200) {
    try {
      const body = JSON.parse(response.body);
      console.log(`Processing time: ${body.metadata.processing_time_ms}ms`);
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  sleep(1); // Wait 1 second between requests
}
