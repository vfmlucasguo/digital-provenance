#!/bin/bash
# Manual provenance generation (for testing)
echo "🚀 Running manual provenance generation..."
syft . -o cyclonedx-json > base-sbom.json
python3 scripts/process_aibom.py
COSIGN_PASSWORD="${COSIGN_PASSWORD}" cosign sign-blob --key cosign.key --bundle aibom.sigstore.json aibom-final.json
cosign verify-blob --key cosign.pub --bundle aibom.sigstore.json aibom-final.json
echo "✅ Manual provenance generation completed"
