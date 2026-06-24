#!/bin/bash

# CampusRide Mobile App - Quick Build Script
# This script automates the build process for APK and IPA

set -e  # Exit on error

echo "🚀 CampusRide Mobile App Builder"
echo "================================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Check if in mobile directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the mobile/ directory"
    echo "   cd mobile && bash QUICK_BUILD.sh"
    exit 1
fi

echo "📱 CampusRide Build Options"
echo "----------------------------"
echo "1. Build Android APK (Recommended for quick sharing)"
echo "2. Build iOS IPA (Requires macOS and Apple account)"
echo "3. Build Both APK and IPA"
echo "4. Check build status"
echo ""
read -p "Select option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 Building Android APK..."
        echo "This may take 5-15 minutes..."
        echo ""
        eas build --platform android --local
        echo ""
        echo "✅ Android APK built successfully!"
        echo "📥 Download link will be shown above"
        echo "💾 Share the download link with others"
        ;;
    2)
        echo ""
        echo "📦 Building iOS IPA..."
        echo "⚠️  This requires macOS and takes 10-30 minutes"
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            eas build --platform ios
            echo ""
            echo "✅ iOS IPA built successfully!"
            echo "📤 Use TestFlight for easy sharing"
        else
            echo "Build cancelled."
        fi
        ;;
    3)
        echo ""
        echo "📦 Building both APK and IPA..."
        echo "This will take 30-60 minutes"
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            echo ""
            echo "Building Android APK..."
            eas build --platform android --local
            echo ""
            echo "Building iOS IPA..."
            eas build --platform ios
            echo ""
            echo "✅ Both builds completed!"
        else
            echo "Build cancelled."
        fi
        ;;
    4)
        echo ""
        echo "Checking build status..."
        eas build --status
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📚 Next Steps:"
echo "- For Android APK: Share the download link directly"
echo "- For iOS IPA: Set up TestFlight for testers"
echo ""
echo "📖 Full documentation: See BUILD_INSTRUCTIONS.md"
echo ""
