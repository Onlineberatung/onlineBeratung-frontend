# Checkbox and Radio Button Size Increase

## Overview

Increased the size of checkbox and radio button icons by 6px to match the original theme sizing.

## Changes Made

### Size Increase Summary

| Component | Before | After | Increase |
|-----------|--------|-------|----------|
| Checkbox | 24px | 30px | +6px |
| Radio (default) | 24px | 30px | +6px |
| Radio (smaller) | 18px | 24px | +6px |

### Implementation Details

#### 1. Checkbox Size Increase

**File:** `src/components/checkbox/checkboxMui.styles.scss`

**Change:**
```scss
.MuiCheckbox-root {
  .MuiSvgIcon-root {
    font-size: 30px; // 6px bigger than default 24px
  }
}
```

#### 2. Radio Button Size Increase (Default)

**File:** `src/components/radioButton/radioButtonMui.styles.scss`

**Change:**
```scss
.MuiRadio-root {
  .MuiSvgIcon-root {
    font-size: 30px; // 6px bigger than default 24px
  }
}
```

#### 3. Radio Button Size Increase (Smaller Variant)

**File:** `src/components/radioButton/radioButtonMui.styles.scss`

**Change:**
```scss
&--smaller {
  .MuiRadio-root {
    .MuiSvgIcon-root {
      font-size: 24px; // 6px bigger than previous 18px
    }
  }
}
```

## Reason for Change

The original theme had slightly larger checkboxes and radio buttons than MUI's default 24px size. Users expected the familiar sizing, so we increased all variants by 6px to match.

## Benefits

1. **Matches Original Theme** - Now consistent with existing design expectations
2. **Better Visibility** - Larger icons are easier to see
3. **Improved Usability** - Easier to click/tap on larger targets
4. **Consistent Increase** - All variants increased by same amount (6px)

## Visual Impact

### Before
- Checkbox: 24px × 24px (MUI default)
- Radio: 24px × 24px (MUI default)
- Radio (smaller): 18px × 18px

### After
- Checkbox: 30px × 30px (+25% size)
- Radio: 30px × 30px (+25% size)
- Radio (smaller): 24px × 24px (+33% size)

## Files Modified

1. `src/components/checkbox/checkboxMui.styles.scss`
2. `src/components/radioButton/radioButtonMui.styles.scss`

## Testing

### Visual Verification
- [x] Checkboxes appear larger
- [x] Radio buttons appear larger
- [x] Smaller radio variant is appropriately sized
- [x] No layout issues
- [x] Proper alignment with labels

### Functional Testing
- [x] Checkbox click/tap works
- [x] Radio button selection works
- [x] All variants function correctly
- [x] No regression in existing functionality

## API Compatibility

- ✅ Zero breaking changes
- ✅ Same component API
- ✅ Same props interface
- ✅ Only visual size change
- ✅ All functionality preserved

## Related Documentation

- FORM_COMPONENTS_MUI_MIGRATION.md - Original form component migration
- MUI Checkbox documentation
- MUI Radio documentation

## Status

✅ **Complete** - All checkbox and radio buttons are now 6px bigger as requested!
