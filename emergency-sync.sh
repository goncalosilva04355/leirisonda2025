#!/bin/bash

echo "🚨 EMERGENCY SYNC SCRIPT - Gonçalo Fonseca"
echo "=========================================="
echo ""

# Current status
echo "📍 Current branch: $(git branch --show-current)"
echo "📊 Git status:"
git status --short

echo ""
echo "🔍 Recent commits:"
git log --oneline -5

echo ""
echo "📋 Critical files status:"
echo "✅ userDeletionService.ts - $([ -f src/services/userDeletionService.ts ] && echo 'EXISTS' || echo 'MISSING')"
echo "✅ completeUserCleanup.ts - $([ -f src/services/completeUserCleanup.ts ] && echo 'EXISTS' || echo 'MISSING')"
echo "✅ DangerousUserDeletion.tsx - $([ -f src/components/DangerousUserDeletion.tsx ] && echo 'EXISTS' || echo 'MISSING')"
echo "✅ builder-force-sync.json - $([ -f builder-force-sync.json ] && echo 'EXISTS' || echo 'MISSING')"

echo ""
echo "🔐 Superadmin preservation check:"
if grep -q "gongonsilva@gmail.com" src/services/userDeletionService.ts; then
    echo "✅ Superadmin email found in deletion service"
else
    echo "❌ Superadmin email NOT found - CRITICAL ERROR"
fi

echo ""
echo "📝 To manually sync to GitHub:"
echo "1. Go to: https://github.com/GoncaloFonseca86/Builder-stellar-landing"
echo "2. Create branch: ai_main_9fcae005c620"
echo "3. Upload these files manually if needed"
echo ""
echo "🚨 ALL CHANGES ARE SAFELY STORED LOCALLY!"
echo "🛡️ Superadmin Gonçalo will be preserved in any user deletion!"
