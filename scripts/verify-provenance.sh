#!/bin/bash
# Verify existing provenance files
echo "🔍 Verifying provenance files..."

if [ ! -f "aibom-final.json" ]; then
    echo "❌ No AIBOM file found"
    exit 1
fi

if [ ! -f "aibom.sigstore.json" ]; then
    echo "❌ No signature bundle found"
    exit 1
fi

cosign verify-blob --key cosign.pub --bundle aibom.sigstore.json aibom-final.json
echo "✅ Provenance verification successful"
