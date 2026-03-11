#!/bin/bash
# render-build.sh - Build script for Render deployment

echo "=========================================="
echo "🚀 Starting Phoenix Innovative Technologies Build"
echo "=========================================="

# Print environment info
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "=========================================="

# Clean install to ensure no corrupted modules
echo "📦 Cleaning previous installations..."
rm -rf node_modules package-lock.json
echo "✅ Clean complete"

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force
echo "✅ Cache cleared"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Installation failed"
    exit 1
fi

# Verify critical modules
echo "🔍 Verifying critical modules..."
node -e "
const modules = ['express', 'ejs', 'dotenv', 'nodemailer'];
let missing = [];
modules.forEach(m => {
    try {
        require.resolve(m);
        console.log('  ✅ ' + m);
    } catch(e) {
        console.log('  ❌ ' + m);
        missing.push(m);
    }
});
if (missing.length > 0) {
    console.error('Missing modules:', missing.join(', '));
    process.exit(1);
}
"

if [ $? -eq 0 ]; then
    echo "✅ All critical modules verified"
else
    echo "❌ Module verification failed"
    exit 1
fi

echo "=========================================="
echo "✅ Build completed successfully!"
echo "=========================================="