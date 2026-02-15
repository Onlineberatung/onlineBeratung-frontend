# SCSS Variable Name Fix

## Issue Fixed

**Build Error:**
```
[plugin:vite:css] [sass] Undefined variable.
   ╷
25 │       color: $link-hover-color;
   │              ^^^^^^^^^^^^^^^^^
   ╵
  src\components\tooltip\tooltipMui.styles.scss 25:14
```

## Root Cause

Used incorrect variable name in tooltipMui.styles.scss:
- **Used:** `$link-hover-color` (wrong)
- **Correct:** `$link-color-hover` (matches codebase convention)

## Solution

Changed one line in `src/components/tooltip/tooltipMui.styles.scss`:

```scss
// Before (line 22)
&:hover {
  color: $link-hover-color;  // ❌ Undefined
}

// After (line 22)
&:hover {
  color: $link-color-hover;  // ✅ Correct
}
```

## Variable Naming Convention

The codebase follows this pattern: `{property}-{state}`

**Defined in settings.scss:**
```scss
$link-color: $primary;          // Base link color
$link-color-hover: $hover-primary;  // Hover state
```

**Pattern:**
- ✅ `$link-color-hover` - property first, state second
- ❌ `$link-hover-color` - incorrect order

## Files Modified

1. **src/components/tooltip/tooltipMui.styles.scss**
   - Line 22: Fixed variable name
   - Change: `$link-hover-color` → `$link-color-hover`

## Result

- ✅ Build succeeds without SCSS errors
- ✅ Tooltip link hover color works correctly
- ✅ Follows codebase naming convention
- ✅ Uses correct variable from settings.scss

## Testing

**Verification:**
1. Build completes without errors
2. Tooltips display correctly
3. Link hover state shows correct color (hover-primary from theme)

## Related Variables

**Available in settings.scss:**
```scss
// Links
$link-color: $primary;
$link-color-hover: $hover-primary;
$link-text-decoration: underline;
$link-text-decoration-hover: $link-text-decoration !default;
```

## Lessons Learned

1. Always check existing variable names in settings.scss
2. Follow codebase naming conventions
3. Pattern: `{property}-{state}` not `{property}-{state}-{property}`
4. Use grep to find existing similar variables

## Status

✅ **Fixed:** Variable name corrected  
✅ **Build:** Succeeds without errors  
✅ **Convention:** Matches codebase pattern  

---

**Date:** 2026-02-15  
**Component:** tooltipMui.styles.scss  
**Type:** SCSS variable name correction  
**Impact:** Build error fixed, zero functionality changes
