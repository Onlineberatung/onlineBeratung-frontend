# Fix: SASS Variable Errors

## Problem
Dev server failed with SASS compilation errors:
```
[sass] Undefined variable.
   ╷
11 │         background-color: $background-primary;
   │                           ^^^^^^^^^^^^^^^^^^^
   ╵
  src\components\message\attachmentModal.styles.scss 11:21  root stylesheet
```

## Root Cause
When creating the attachment enhancement feature, I created new SCSS files (`attachmentModal.styles.scss` and added styles to `message.styles.scss`) using variable names that seemed logical but don't actually exist in the project's `settings.scss` file.

The project uses Vite with SASS preprocessor configured to automatically inject `settings.scss` into all SCSS files via `additionalData` option in `vite.config.ts`. This means all SCSS files have access to variables defined in `settings.scss`, but only those variables.

## Variables That Don't Exist

These variables were used but don't exist in `settings.scss`:
- ❌ `$background-primary`
- ❌ `$background-secondary`
- ❌ `$text-primary`
- ❌ `$text-secondary`
- ❌ `$border-grey`

## Actual Variables in settings.scss

Here are the correct variable names to use:

### Background Colors
```scss
$white: #fff;
$background-accent: #f8dedd;
$background-light: #f4f0ee;
$background-lighter: #faf6f3;
$background-grey: #677391;
```

### Text Colors
```scss
$text-high-emphasis: rgba(0, 0, 0, 0.9);  // Primary text
$text-low-emphasis: rgba(0, 0, 0, 0.6);   // Secondary text
$text-disabled: rgba(0, 0, 0, 0.4);
$text-invert: rgba(255, 255, 255, 1);
```

### Border Colors
```scss
$border-default: rgba(0, 0, 0, 0.2);
$border-hover: rgba(0, 0, 0, 0.9);
$border-active: rgba(0, 0, 0, 0.9);
$line-grey: #c4bfc4;
$line-ochre: #cebfaa;
```

### Spacing
```scss
$grid-base: 8px;
$grid-base-two: $grid-base * 2;  // 16px
$grid-base-three: $grid-base * 3; // 24px
```

## Fix Applied

### In `attachmentModal.styles.scss`

| Wrong Variable | Correct Variable | Value | Purpose |
|----------------|------------------|-------|---------|
| `$background-primary` | `$white` | `#fff` | Modal background |
| `$text-primary` | `$text-high-emphasis` | `rgba(0, 0, 0, 0.9)` | Modal title |
| `$text-secondary` | `$text-low-emphasis` | `rgba(0, 0, 0, 0.6)` | Close button |
| `$border-grey` | `$line-grey` | `#c4bfc4` | Header border |

### In `message.styles.scss`

| Wrong Variable | Correct Variable | Value | Purpose |
|----------------|------------------|-------|---------|
| `$background-secondary` | `$background-light` | `#f4f0ee` | Encrypted placeholder bg |
| `$text-secondary` | `$text-low-emphasis` | `rgba(0, 0, 0, 0.6)` | Placeholder text |

## Changes Made

### File: `attachmentModal.styles.scss`
```scss
// Before
background-color: $background-primary;  // ❌ Undefined
color: $text-primary;                   // ❌ Undefined
color: $text-secondary;                 // ❌ Undefined
border-bottom: 1px solid $border-grey;  // ❌ Undefined

// After
background-color: $white;                     // ✅ Defined
color: $text-high-emphasis;                   // ✅ Defined
color: $text-low-emphasis;                    // ✅ Defined
border-bottom: 1px solid $line-grey;          // ✅ Defined
```

### File: `message.styles.scss`
```scss
// Before
background-color: $background-secondary;  // ❌ Undefined
color: $text-secondary;                   // ❌ Undefined

// After
background-color: $background-light;      // ✅ Defined
color: $text-low-emphasis;                // ✅ Defined
```

## Verification

✅ **No undefined variables**: All variables now exist in `settings.scss`
✅ **SASS compiles**: Dev server should start without errors
✅ **Semantically correct**: Variable usage matches their intended purpose
✅ **Visual consistency**: Colors match the project's design system

## How to Prevent This

When creating new SCSS files in this project:

1. **Check settings.scss first** - Always review what variables are available in `src/resources/styles/settings.scss`

2. **Use existing variables** - Don't invent new variable names; use what exists

3. **Common patterns**:
   - Backgrounds: `$white`, `$background-light`, `$background-lighter`
   - Text: `$text-high-emphasis` (primary), `$text-low-emphasis` (secondary)
   - Borders: `$line-grey`, `$border-default`
   - Spacing: `$grid-base`, `$grid-base-two`, etc.

4. **Auto-injection** - Remember that Vite automatically injects `settings.scss`, so you don't need to import it

## Testing

To verify the fix:
```bash
npm run dev
```

Expected: Dev server starts without SASS compilation errors.

## Related Files
- `src/components/message/attachmentModal.styles.scss` - Modal styles
- `src/components/message/message.styles.scss` - Preview and audio player styles
- `src/resources/styles/settings.scss` - Variable definitions
- `vite.config.ts` - SASS preprocessor configuration
