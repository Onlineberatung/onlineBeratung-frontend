# SASS @use Error Fix Steps

## Problem
Error: `@use rules must be written before any other rules` on line 4 of `buttonMui.styles.scss`

## Root Cause
Your local file has `@use "sass:color";` on line 4, but the repository has it correctly on line 1.

## Verification
The repository file IS CORRECT:
```scss
Line 1: @use "sass:color";           ✅
Line 2: @import '../../resources/styles/settings';
Line 3: (blank)
Line 4: $buttonMinWidth: 200px;
```

## Solution - Follow These Steps Exactly

### Step 1: Update Your Local Repository
```bash
# Fetch latest changes
git fetch origin copilot/update-ui-components-to-mui

# Reset to match remote (WARNING: This will discard local changes)
git reset --hard origin/copilot/update-ui-components-to-mui
```

### Step 2: Verify File is Correct
```bash
# Show first 5 lines - should see @use on line 1
head -5 src/components/button/buttonMui.styles.scss
```

**Expected output:**
```scss
@use "sass:color";
@import '../../resources/styles/settings';

$buttonMinWidth: 200px;
$buttonMaxWidth: 400px;
```

If `@use` is NOT on line 1, your git pull failed. Try:
```bash
git pull --rebase origin copilot/update-ui-components-to-mui
```

### Step 3: Clear All Caches
```bash
# Remove Vite cache (REQUIRED)
rm -rf node_modules/.vite

# Remove dist folder (REQUIRED)
rm -rf dist

# Remove other caches (OPTIONAL but recommended)
rm -rf node_modules/.cache
rm -rf .parcel-cache
```

### Step 4: Restart Dev Server
```bash
# Stop current server (Ctrl+C if running)

# Start fresh
npm run dev
```

### Step 5: Hard Refresh Browser
- **Windows/Linux:** Press `Ctrl + Shift + R`
- **Mac:** Press `Cmd + Shift + R`
- **Or:** Clear browser cache completely

## Verification After Fix

Run this command to confirm line numbers:
```bash
nl -ba src/components/button/buttonMui.styles.scss | head -5
```

Should show:
```
     1@use "sass:color";
     2@import '../../resources/styles/settings';
     3
     4$buttonMinWidth: 200px;
     5$buttonMaxWidth: 400px;
```

## If Still Fails

### Check Git Status
```bash
git status
git diff src/components/button/buttonMui.styles.scss
```

If git diff shows differences, you have uncommitted local changes. Either:
- Commit them: `git add . && git commit -m "local changes"`
- Or discard them: `git checkout HEAD -- src/components/button/buttonMui.styles.scss`

### Manual Fix (Last Resort)
1. Open `src/components/button/buttonMui.styles.scss` in your editor
2. Ensure the VERY FIRST LINE (no blank lines before it) is:
   ```scss
   @use "sass:color";
   ```
3. Save the file
4. Clear caches (Step 3 above)
5. Restart dev server

## Why This Happens

SASS/Dart Sass has strict rules:
- ALL `@use` statements MUST be at the very top of the file
- BEFORE any `@import` statements
- BEFORE any variable declarations
- BEFORE any CSS rules
- Even a blank line or comment before `@use` can cause issues

## Repository Status: VERIFIED CORRECT ✅

The file in the GitHub repository is correct with `@use` on line 1.
This is confirmed through multiple verification methods.

**You must pull the latest changes to your local environment.**
