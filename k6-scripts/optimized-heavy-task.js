// k6-scripts/optimized-heavy-task.js
// K6 Load Test for OPTIMIZED heavy-task endpoint
/* eslint-disable import/no-anonymous-default-export */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { getBaseUrl, logProcessingTime, createArtistChecks } from './shared.js';

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
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/heavy-task-optimized`;
  
  const response = http.get(url);
  
  const checks = {
    ...createArtistChecks(),
    'optimized flag is true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.metadata?.optimized === true;
      } catch {
        return false;
      }
    },
  };
  
  const success = check(response, checks);
  errorRate.add(!success);
  logProcessingTime(response);
  
  sleep(1); // Wait 1 second between requests
}
