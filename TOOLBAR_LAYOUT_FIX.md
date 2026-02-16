# Toolbar Layout Fix: Emoji Picker and Attachment Icons

## Summary
Fixed syntax error and moved **BOTH** the emoji picker and file attachment icons to the vertical toolbar (featureWrapper), as requested.

## Issues Addressed
1. **Syntax Error**: Line 940 in `messageSubmitInterfaceComponent.tsx` had mismatched parentheses
2. **Incomplete Migration**: Only the file attachment icon was moved to toolbar initially, emoji picker was still in editor
3. **User Request**: "btw i said mograte the emojipicker AND the file attach icon into this toolbar, seems you only did for the picker"

## Final Toolbar Layout

Icons are now vertically stacked in `textarea__featureWrapper`:

```
┌─────────┐
│    ⚙️    │ ← Richtext toggle (top)
│    😊    │ ← Emoji picker (middle) ✨ NOW HERE
│    📎    │ ← Attachment upload (bottom)
└─────────┘
```

Previously:
- ❌ Emoji picker was inside TiptapEditor (bottom-right of input area)
- ✅ Attachment icon was already in toolbar

Now:
- ✅ Both icons are in the toolbar (featureWrapper)
- ✅ Consistent vertical layout
- ✅ No visual collision

## Technical Changes

### 1. Syntax Error Fix

**File**: `messageSubmitInterfaceComponent.tsx`
**Line 940**: 
```tsx
// Before (broken)
{hasUploadFunctionality && attachmentSelected && (
    <div>...</div>
))}  // ← Extra closing parenthesis

// After (fixed)
{hasUploadFunctionality && attachmentSelected && (
    <div>...</div>
)}
```

### 2. Emoji Picker Extraction

**File**: `TiptapEditor.tsx`

**Removed**:
- Emoji button UI from editor toolbar (lines 310-326)
- Emoji Popover component (lines 328-343)
- Handler functions: `handleEmojiClick`, `handleEmojiButtonClick`, `handleEmojiClose`
- State: `emojiAnchorEl`
- Imports: `Popover`, `EmojiPicker`, `EmojiClickData`, `EmojiIcon`

**Added**:
- `onInsertEmoji` prop to interface
- `useEffect` hook to expose `insertEmoji` function to parent
```typescript
useEffect(() => {
    if (editor && onInsertEmoji) {
        const insertEmoji = (emoji: string) => {
            editor.chain().focus().insertContent(emoji).run();
        };
        onInsertEmoji(insertEmoji);
    }
}, [editor, onInsertEmoji]);
```

### 3. Emoji Picker in Toolbar

**File**: `messageSubmitInterfaceComponent.tsx`

**Added Imports**:
```typescript
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Popover } from '@mui/material';
import EmojiIcon from '../../resources/img/icons/smiley-positive.svg?react';
```

**Added State**:
```typescript
const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);
const [insertEmojiFunc, setInsertEmojiFunc] = useState<((emoji: string) => void) | null>(null);
```

**Added Handlers**:
```typescript
const handleEmojiButtonClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchorEl(event.currentTarget);
}, []);

const handleEmojiClose = useCallback(() => {
    setEmojiAnchorEl(null);
}, []);

const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
    if (insertEmojiFunc) {
        insertEmojiFunc(emojiData.emoji);
        setEmojiAnchorEl(null);
    }
}, [insertEmojiFunc]);

const handleInsertEmojiReady = useCallback((insertEmoji: (emoji: string) => void) => {
    setInsertEmojiFunc(() => insertEmoji);
}, []);
```

**Added UI in Toolbar** (between richtext and attachment icons):
```tsx
<span className="textarea__emojiIcon">
    <EmojiIcon
        width="20"
        height="20"
        onClick={handleEmojiButtonClick}
        title={translate('app.emoji')}
        aria-label={translate('app.emoji')}
        style={{ cursor: 'pointer' }}
    />
</span>
```

**Added Popover** (at component level):
```tsx
<Popover
    open={Boolean(emojiAnchorEl)}
    anchorEl={emojiAnchorEl}
    onClose={handleEmojiClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    className="emoji__selectPopover"
>
    <EmojiPicker onEmojiClick={handleEmojiClick} />
</Popover>
```

**Updated TiptapEditor**:
```tsx
<TiptapEditor
    content={editorContent}
    onChange={handleEditorChange}
    onSubmit={handleEditorSubmit}
    onInsertEmoji={handleInsertEmojiReady}  // ← NEW
    placeholder={...}
    disabled={!draftLoaded}
    isRichtextActive={isRichtextActive}
/>
```

### 4. Styling

**File**: `messageSubmitInterface.styles.scss`

**Added** (between `&__richtextToggle` and `&__attachmentIcon`):
```scss
&__emojiIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: $grid-base-three;
    height: $grid-base-three;
    margin-bottom: $grid-base;
    cursor: pointer;

    @include from-large {
        margin-bottom: 12px;
    }

    svg {
        align-self: flex-end;

        * {
            fill: $tertiary;
        }

        &:hover {
            * {
                fill: var(--skin-color-primary, $primary);
            }
        }
    }
}
```

## Architecture

### Before
```
┌─────────────────────────┐
│ messageSubmitInterface  │
│  ┌──────────────────┐   │
│  │ featureWrapper   │   │
│  │  - Richtext ⚙️    │   │
│  │  - Attachment 📎  │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ TiptapEditor     │   │
│  │  - Editor        │   │
│  │  - Emoji 😊       │ ← INSIDE EDITOR
│  └──────────────────┘   │
└─────────────────────────┘
```

### After
```
┌─────────────────────────┐
│ messageSubmitInterface  │
│  ┌──────────────────┐   │
│  │ featureWrapper   │   │
│  │  - Richtext ⚙️    │   │
│  │  - Emoji 😊       │ ← NOW IN TOOLBAR
│  │  - Attachment 📎  │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ TiptapEditor     │   │
│  │  - Editor only   │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ Emoji Popover    │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

## Benefits

1. **Consistent Layout**: All feature icons in one place
2. **No Collision**: Icons don't overlap visually
3. **Better UX**: Clear, predictable icon locations
4. **Cleaner Editor**: TiptapEditor focuses on text editing only
5. **Maintainability**: Emoji logic in parent component where attachment logic already exists

## Testing

### Manual Tests Needed

1. **Emoji Picker Opens**:
   - Click emoji icon (😊) in toolbar
   - Verify popover opens with emoji picker

2. **Emoji Insertion**:
   - Select an emoji from picker
   - Verify it inserts at cursor position in editor
   - Verify popover closes after selection

3. **Icon Hover Effects**:
   - Hover over each icon
   - Verify color changes to primary color

4. **Responsive Layout**:
   - Test on different screen sizes
   - Verify icons stack vertically properly

5. **Attachment Still Works**:
   - Click attachment icon (📎)
   - Verify file upload dialog opens
   - Verify attachment icon is hidden when file selected

6. **Richtext Toggle Still Works**:
   - Click richtext icon (⚙️)
   - Verify formatting toolbar shows/hides

## Files Changed

1. `src/components/messageSubmitInterface/TiptapEditor.tsx`
   - Removed emoji UI
   - Added `onInsertEmoji` prop
   - Simplified component

2. `src/components/messageSubmitInterface/messageSubmitInterfaceComponent.tsx`
   - Added emoji picker to toolbar
   - Added state and handlers
   - Added Popover component

3. `src/components/messageSubmitInterface/messageSubmitInterface.styles.scss`
   - Added `&__emojiIcon` styles

## Verification

```bash
# TypeScript check
npx tsc --noEmit

# Should show no errors in modified files
```

All changes maintain backward compatibility and don't affect other functionality.
