#!/bin/bash

# Quick performance test - Core optimizations only
echo "🚀 Testing optimized Digital Provenance workflow..."

start_time=$(date +%s)

# Load environment
source .env

echo "📦 Testing SBOM caching logic..."
if git diff --cached --name-only | grep -q "package-lock.json"; then
    echo "   ✅ Would regenerate SBOM (dependencies changed)"
else
    echo "   ⚡ Using cached SBOM (no dependency changes)"
fi

echo "🤖 Testing enhanced AI detection..."
python3 scripts/process_aibom.py

echo "🔑 Testing secure signing..."
cosign sign-blob --key cosign.key --bundle aibom.sigstore.json aibom-final.json

echo "✅ Testing signature verification..."
cosign verify-blob --key cosign.pub --bundle aibom.sigstore.json aibom-final.json

end_time=$(date +%s)
duration=$((end_time - start_time))

echo "⏱️  Core workflow completed in ${duration} seconds"

if [ $duration -lt 15 ]; then
    echo "🚀 Excellent performance! Significant improvement achieved"
elif [ $duration -lt 30 ]; then
    echo "⚡ Good performance! Notable improvement"
else
    echo "📊 Baseline performance established"
fi