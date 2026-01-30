// k6-scripts/comparison-test.js
// Side-by-side comparison test for both endpoints
/* eslint-disable import/no-anonymous-default-export */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { getBaseUrl } from './shared.js';

// Custom metrics for comparison
const baselineResponseTime = new Trend('baseline_response_time');
const optimizedResponseTime = new Trend('optimized_response_time');
const baselineProcessingTime = new Trend('baseline_processing_time');
const optimizedProcessingTime = new Trend('optimized_processing_time');
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 5 },   // Ramp up to 5 users
    { duration: '2m', target: 5 },    // Stay at 5 users
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '2m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
};

function testEndpoint(url, label, responseTimeTrend, processingTimeTrend) {
  const response = http.get(url);
  const success = check(response, {
    [`${label}: status is 200`]: (r) => r.status === 200,
  });
  
  if (success) {
    responseTimeTrend.add(response.timings.duration);
    try {
      const body = JSON.parse(response.body);
      processingTimeTrend.add(body.metadata.processing_time_ms);
    } catch {
      // Ignore parse errors
    }
  }
  
  errorRate.add(!success);
  return success;
}

export default function () {
  const baseUrl = getBaseUrl();
  
  // Test baseline endpoint
  testEndpoint(`${baseUrl}/api/heavy-task`, 'baseline', baselineResponseTime, baselineProcessingTime);
  sleep(0.5);
  
  // Test optimized endpoint
  testEndpoint(`${baseUrl}/api/heavy-task-optimized`, 'optimized', optimizedResponseTime, optimizedProcessingTime);
  sleep(1);
}

export function handleSummary(data) {
  const baselineAvg = data.metrics.baseline_response_time?.values?.avg || 0;
  const optimizedAvg = data.metrics.optimized_response_time?.values?.avg || 0;
  const improvement = ((baselineAvg - optimizedAvg) / baselineAvg * 100).toFixed(2);
  
  console.log('\n=== PERFORMANCE COMPARISON ===');
  console.log(`Baseline Avg Response Time: ${baselineAvg.toFixed(2)}ms`);
  console.log(`Optimized Avg Response Time: ${optimizedAvg.toFixed(2)}ms`);
  console.log(`Improvement: ${improvement}%`);
  
  return {
    'stdout': JSON.stringify(data, null, 2),
  };
}
