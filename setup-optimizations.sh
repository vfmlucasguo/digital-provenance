#!/bin/bash

# Digital Provenance Optimization Setup Script
# This script applies all recommended optimizations to your existing setup

set -e

echo "🚀 Digital Provenance Optimization Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
    print_error "Please run this script from your Ionic project root directory"
    exit 1
fi

print_info "Detected project: $(basename $(pwd))"

# 1. Backup existing configuration
echo
echo "📦 Creating backup of existing configuration..."
BACKUP_DIR="provenance-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup existing files
[ -f ".git/hooks/pre-commit" ] && cp ".git/hooks/pre-commit" "$BACKUP_DIR/"
[ -f "scripts/process_aibom.py" ] && cp "scripts/process_aibom.py" "$BACKUP_DIR/"
[ -f ".env" ] && cp ".env" "$BACKUP_DIR/"

print_status "Backup created in $BACKUP_DIR"

# 2. Update .gitignore for security
echo
echo "🔒 Updating .gitignore for security..."
if ! grep -q "cosign.key" .gitignore 2>/dev/null; then
    cat >> .gitignore << 'EOF'

# Digital Provenance - Security
cosign.key
*.key
!cosign.pub
.env
provenance-backup-*/
EOF
    print_status ".gitignore updated"
else
    print_info ".gitignore already configured"
fi

# 3. Install optimized pre-commit hook
echo
echo "⚡ Installing optimized pre-commit hook..."
if [ -f ".git/hooks/pre-commit-optimized" ]; then
    cp ".git/hooks/pre-commit-optimized" ".git/hooks/pre-commit"
    chmod +x ".git/hooks/pre-commit"
    print_status "Optimized pre-commit hook installed"
else
    print_warning "Optimized pre-commit hook not found, keeping existing"
fi

# 4. Setup enhanced AI detection
echo
echo "🤖 Setting up enhanced AI detection..."
if [ -f "scripts/process_aibom_enhanced.py" ]; then
    # Keep original as backup
    [ -f "scripts/process_aibom.py" ] && mv "scripts/process_aibom.py" "scripts/process_aibom_original.py"
    cp "scripts/process_aibom_enhanced.py" "scripts/process_aibom.py"
    print_status "Enhanced AI detection installed"
else
    print_warning "Enhanced AI detection script not found"
fi

# 5. Setup environment configuration
echo
echo "⚙️  Setting up environment configuration..."
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp ".env.example" ".env"
    print_warning "Created .env from template - PLEASE UPDATE THE COSIGN_PASSWORD!"
    print_info "Edit .env file and set a secure COSIGN_PASSWORD"
elif [ -f ".env" ]; then
    print_info ".env file already exists"
else
    print_warning "No .env template found, please create manually"
fi

# 6. Generate new secure keys if requested
echo
echo "🔑 Key Management"
read -p "Do you want to generate new secure Cosign keys? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Generating new Cosign key pair..."

    # Remove old keys
    rm -f cosign.key cosign.pub

    # Generate new keys with user-provided password
    echo "Please enter a secure password for your new Cosign key:"
    read -s COSIGN_PASSWORD
    echo

    COSIGN_PASSWORD="$COSIGN_PASSWORD" cosign generate-key-pair

    if [ -f "cosign.key" ] && [ -f "cosign.pub" ]; then
        print_status "New Cosign key pair generated"
        print_warning "Please update COSIGN_PASSWORD in .env file"
        print_info "Public key (cosign.pub) should be committed to git"
        print_info "Private key (cosign.key) is automatically gitignored"
    else
        print_error "Failed to generate keys"
    fi
else
    print_info "Keeping existing keys"
fi

# 7. Setup utility scripts
echo
echo "🛠️  Setting up utility scripts..."
chmod +x scripts/*.py 2>/dev/null || true

# Create convenience scripts
cat > scripts/manual-provenance.sh << 'EOF'
#!/bin/bash
# Manual provenance generation (for testing)
echo "🚀 Running manual provenance generation..."
syft . -o cyclonedx-json > base-sbom.json
python3 scripts/process_aibom.py
COSIGN_PASSWORD="${COSIGN_PASSWORD}" cosign sign-blob --key cosign.key --bundle aibom.sigstore.json aibom-final.json
cosign verify-blob --key cosign.pub --bundle aibom.sigstore.json aibom-final.json
echo "✅ Manual provenance generation completed"
EOF

cat > scripts/verify-provenance.sh << 'EOF'
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
EOF

chmod +x scripts/manual-provenance.sh scripts/verify-provenance.sh
print_status "Utility scripts created"

# 8. Setup GitHub Actions (if .github directory exists or user wants it)
echo
echo "🔄 CI/CD Integration"
if [ -d ".github" ] || [ -d ".github/workflows" ]; then
    read -p "Setup GitHub Actions workflow? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        mkdir -p .github/workflows
        if [ -f ".github/workflows/digital-provenance.yml" ]; then
            print_status "GitHub Actions workflow ready"
            print_info "Don't forget to set COSIGN_PRIVATE_KEY and COSIGN_PASSWORD secrets in GitHub"
        else
            print_warning "GitHub Actions workflow template not found"
        fi
    fi
else
    print_info "No .github directory found, skipping CI/CD setup"
fi

# 9. Commit provenance files to git
echo
echo "📝 Git Integration"
read -p "Add provenance files to git tracking? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    # Update .gitignore to track provenance files
    if ! grep -q "# Track provenance files" .gitignore 2>/dev/null; then
        cat >> .gitignore << 'EOF'

# Track provenance files
!base-sbom.json
!aibom-final.json
!aibom.sigstore.json
EOF
    fi

    # Add files if they exist
    git add .gitignore 2>/dev/null || true
    [ -f "base-sbom.json" ] && git add base-sbom.json
    [ -f "aibom-final.json" ] && git add aibom-final.json
    [ -f "aibom.sigstore.json" ] && git add aibom.sigstore.json
    [ -f "cosign.pub" ] && git add cosign.pub

    print_status "Provenance files added to git tracking"
else
    print_info "Provenance files will remain untracked"
fi

# 10. Performance test
echo
echo "⚡ Performance Test"
read -p "Run a performance test of the optimized workflow? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Running performance test..."
    start_time=$(date +%s)

    # Run the optimized workflow
    if [ -f ".git/hooks/pre-commit" ]; then
        .git/hooks/pre-commit
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        print_status "Performance test completed in ${duration} seconds"

        if [ $duration -lt 30 ]; then
            print_status "Excellent performance! 🚀"
        elif [ $duration -lt 60 ]; then
            print_status "Good performance! ⚡"
        else
            print_warning "Consider further optimization for large projects"
        fi
    else
        print_error "Pre-commit hook not found"
    fi
fi

# 11. Final summary and recommendations
echo
echo "🎉 Optimization Setup Complete!"
echo "================================"
echo
print_status "Applied optimizations:"
echo "  • Security hardening (password management)"
echo "  • Performance improvements (SBOM caching)"
echo "  • Enhanced AI detection"
echo "  • Automated git integration"
echo "  • CI/CD workflow templates"
echo "  • Utility scripts for maintenance"
echo
print_warning "Next steps:"
echo "  1. Update COSIGN_PASSWORD in .env file"
echo "  2. Test the workflow: git commit -m 'test optimized provenance'"
echo "  3. Setup GitHub secrets for CI/CD (if using)"
echo "  4. Review and customize .env settings"
echo
print_info "Useful commands:"
echo "  • Test provenance: ./scripts/manual-provenance.sh"
echo "  • Verify signatures: ./scripts/verify-provenance.sh"
echo "  • Compare SBOMs: python3 scripts/sbom_diff.py old.json new.json"
echo
print_status "Your digital provenance system is now optimized! 🚀"