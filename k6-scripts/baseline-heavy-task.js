// k6-scripts/baseline-heavy-task.js
// K6 Load Test for UNOPTIMIZED heavy-task endpoint
/* eslint-disable import/no-anonymous-default-export */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { createArtistChecks, logProcessingTime, getBaseUrl } from './shared.js';

// Custom metrics
const errorRate = new Rate('errors');

export { commonOptions as options } from './shared.js';

export default function () {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/heavy-task`;
  
  const response = http.get(url);
  
  const success = check(response, createArtistChecks());
  
  errorRate.add(!success);
  
  logProcessingTime(response);
  
  sleep(1); // Wait 1 second between requests
}
