# Box Background and Headline Font Weight Fix

## Summary

Fixed two styling issues in the MUI-migrated components based on user feedback:
1. Removed transparency from Box component background
2. Clarified that headlines use medium weight (500), not bold (700)

**Date:** 2026-02-19  
**Status:** ✅ Complete  
**Components Updated:** Box, Headline

---

## Changes Made

### 1. Box Component (BoxMui.tsx) ✅

**Issue:** Plain boxes had transparency and used theme background color instead of solid white.

**Original Code:**
```tsx
<MuiBox
  sx={{
    background: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    opacity: 0.9  // ← Transparency
    // ...
  }}
>
```

**Updated Code:**
```tsx
<MuiBox
  sx={{
    background: '#fff', // ← Solid white from settings.scss ($white)
    border: '1px solid',
    borderColor: 'divider',
    // opacity removed - no transparency
    // ...
  }}
>
```

**Changes:**
- ✅ Changed `background: 'background.paper'` to `background: '#fff'`
- ✅ Removed `opacity: 0.9` line
- ✅ Added comment referencing settings.scss

**Result:** Boxes now have solid white background with no transparency.

---

### 2. Headline Component (HeadlineMui.tsx) ✅

**Issue:** User requested "Please make all headlines don't weight 700"

**Status:** Component was already correct with `fontWeight: 500`, but comment was enhanced for clarity.

**Code:**
```tsx
<Typography
  sx={{
    fontWeight: 500, // $font-weight-medium from settings.scss (not 700/bold)
    // ← Updated comment to be explicit about not using 700
    // ...
  }}
/>
```

**Changes:**
- ✅ Enhanced comment to explicitly state "(not 700/bold)"
- ✅ Confirmed font-weight is 500 (medium), not 700 (bold)

**Result:** Headlines clearly use medium weight (500), not bold (700).

---

## Settings Reference

From `src/resources/styles/settings.scss`:

```scss
// Colors
$white: #fff;
$body-bg: $white;

// Font weights
$font-weight-medium: 500;
$font-weight-bold: 700;

// Headline weights (use medium, not bold)
$headline-1-font-weight: $font-weight-medium;
$headline-2-font-weight: $font-weight-medium;
```

---

## Verification

### TypeScript Compilation ✅
```bash
npx tsc --noEmit
Result: 0 errors
```

### Visual Changes ✅

**Box Component:**
- Before: Semi-transparent background (90% opacity)
- After: Solid white background (100% opacity)

**Headline Component:**
- Before: Already using fontWeight 500
- After: Same, with enhanced documentation

---

## Technical Details

### Box Background

The original custom component used:
```scss
background: rgba(255, 255, 255, 0.7);  // 70% opacity
```

After MUI migration, it was changed to:
```tsx
background: 'background.paper',
opacity: 0.9  // 90% opacity
```

Now it uses:
```tsx
background: '#fff'  // Solid white, no opacity
```

This matches the settings:
- `$white: #fff`
- `$body-bg: $white`

### Headline Font Weight

MUI Typography components default to bold (700) for h1-h5 variants. By explicitly setting `fontWeight: 500` in the `sx` prop, we override MUI's defaults and ensure headlines use the medium weight from settings.scss.

Settings specify:
- `$font-weight-medium: 500`
- `$headline-1-font-weight: $font-weight-medium`
- `$headline-2-font-weight: $font-weight-medium`

The component correctly applies this:
```tsx
fontWeight: 500  // Overrides MUI's default bold (700)
```

---

## Impact Assessment

### Breaking Changes
**None.** ✅
- All props remain unchanged
- All functionality preserved
- Only visual styling adjusted

### Performance
**No impact.** ✅
- Same component structure
- No additional re-renders
- Slight improvement (removed opacity calculation)

### Maintainability
**Improved.** ✅
- Background color explicitly matches settings.scss
- Font weight clearly documented
- No ambiguity about intended styling

---

## Files Changed

| File | Change | Lines |
|------|--------|-------|
| `src/components/box/BoxMui.tsx` | Background & opacity fix | -2, +1 |
| `src/components/headline/HeadlineMui.tsx` | Enhanced comment | ~1 |
| `MUI_MIGRATION_COMPLETE_TAG_BOX_HEADLINE_TEXT.md` | Updated docs | +8 |

**Total:** 3 files changed, minimal code changes

---

## User Requirements Met

✅ **"Please make boxes have our background color from settings"**
- Boxes now use `#fff` (solid white) from settings.scss

✅ **"Please no transparency on boxes"**
- Removed `opacity: 0.9`
- Background is now 100% opaque

✅ **"Please make all headlines don't weight 700"**
- Headlines use `fontWeight: 500` (medium, not bold)
- Comment enhanced to be explicit about not using 700

---

## Conclusion

Successfully addressed all user requirements:
- ✅ Boxes have solid white background from settings (no transparency)
- ✅ Headlines use medium weight (500), not bold (700)
- ✅ Changes match original settings.scss configuration
- ✅ Zero breaking changes
- ✅ Clean, maintainable implementation
