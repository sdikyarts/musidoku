// k6-scripts/comparison-test.js
// Side-by-side comparison test for both endpoints
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

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

export default function () {
  // Test baseline endpoint
  const baselineUrl = 'http://localhost:3000/api/heavy-task';
  const baselineResponse = http.get(baselineUrl);
  
  const baselineSuccess = check(baselineResponse, {
    'baseline: status is 200': (r) => r.status === 200,
  });
  
  if (baselineSuccess) {
    baselineResponseTime.add(baselineResponse.timings.duration);
    try {
      const body = JSON.parse(baselineResponse.body);
      baselineProcessingTime.add(body.metadata.processing_time_ms);
    } catch (e) {
      // Ignore
    }
  }
  
  errorRate.add(!baselineSuccess);
  
  sleep(0.5);
  
  // Test optimized endpoint
  const optimizedUrl = 'http://localhost:3000/api/heavy-task-optimized';
  const optimizedResponse = http.get(optimizedUrl);
  
  const optimizedSuccess = check(optimizedResponse, {
    'optimized: status is 200': (r) => r.status === 200,
  });
  
  if (optimizedSuccess) {
    optimizedResponseTime.add(optimizedResponse.timings.duration);
    try {
      const body = JSON.parse(optimizedResponse.body);
      optimizedProcessingTime.add(body.metadata.processing_time_ms);
    } catch (e) {
      // Ignore
    }
  }
  
  errorRate.add(!optimizedSuccess);
  
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
