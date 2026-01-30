#!/bin/bash
# k6-scripts/quick-test.sh
# Quick performance comparison script

set -e

echo "🎯 Artist Database Performance Testing"
echo "========================================"
echo ""

# Check if K6 is installed
if ! command -v k6 &> /dev/null; then
    echo "❌ K6 is not installed. Install it with:"
    echo "   brew install k6"
    exit 1
fi

# Check if server is running
if ! curl -s http://localhost:3000/api/heavy-task > /dev/null 2>&1; then
    echo "❌ Server is not running on http://localhost:3000"
    echo "   Start it with: npm run dev"
    exit 1
fi

echo "✅ Prerequisites met"
echo ""

# Create results directory
mkdir -p results

# Test 1: Quick baseline test
echo "📊 Step 1: Testing UNOPTIMIZED endpoint..."
echo "   Endpoint: /api/heavy-task"
echo ""

curl -s http://localhost:3000/api/heavy-task | jq '.metadata' > results/baseline-sample.json
BASELINE_TIME=$(cat results/baseline-sample.json | jq -r '.processing_time_ms')
echo "   Sample processing time: ${BASELINE_TIME}ms"
echo ""

# Test 2: Quick optimized test
echo "📊 Step 2: Testing OPTIMIZED endpoint..."
echo "   Endpoint: /api/heavy-task-optimized"
echo ""

curl -s http://localhost:3000/api/heavy-task-optimized | jq '.metadata' > results/optimized-sample.json
OPTIMIZED_TIME=$(cat results/optimized-sample.json | jq -r '.processing_time_ms')
echo "   Sample processing time: ${OPTIMIZED_TIME}ms"
echo ""

# Calculate improvement
IMPROVEMENT=$(echo "scale=2; (($BASELINE_TIME - $OPTIMIZED_TIME) / $BASELINE_TIME) * 100" | bc)
echo "⚡ Quick comparison: ${IMPROVEMENT}% faster"
echo ""

# Ask if user wants to run full load test
echo "🚀 Ready to run full K6 load tests?"
echo "   This will take about 5 minutes total."
read -p "   Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipping load tests. Run manually with:"
    echo "   k6 run k6-scripts/comparison-test.js"
    exit 0
fi

echo ""
echo "📈 Running K6 comparison test..."
echo "   This tests both endpoints under load"
echo ""

k6 run k6-scripts/comparison-test.js 2>&1 | tee results/comparison-results.txt

echo ""
echo "✅ Testing complete!"
echo ""
echo "📁 Results saved to:"
echo "   - results/baseline-sample.json"
echo "   - results/optimized-sample.json"
echo "   - results/comparison-results.txt"
echo ""
echo "🎓 Next steps:"
echo "   1. Review the K6 output above"
echo "   2. Profile with: NODE_OPTIONS='--inspect' npm run dev"
echo "   3. Open chrome://inspect in Chrome"
echo "   4. Read k6-scripts/README.md for detailed analysis"
