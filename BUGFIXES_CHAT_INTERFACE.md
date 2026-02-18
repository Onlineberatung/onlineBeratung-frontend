# Bug Fixes Summary: Chat Interface Issues

## Overview
Fixed three critical bugs in the chat interface after the Tiptap migration:
1. Editor content not cleared after message send
2. Icon layout collision (emoji picker + attachment)
3. File decryption errors for all uploads

## Bug 1: Editor Content Not Cleared After Message Send ✅

### Problem
After sending a message, the editor content remained visible even though `setEditorContent('')` was called.

### Root Cause
The `useEffect` in `TiptapEditor.tsx` that syncs external content changes had a condition that only updated when `content.trim()` was truthy:

```typescript
if (editor && content !== undefined && content.trim()) {
    // Only updates when content has value
}
```

When an empty string was passed, the condition failed and the editor wasn't cleared.

### Fix
Modified the `useEffect` to explicitly handle empty content:

```typescript
useEffect(() => {
    if (editor && content !== undefined) {
        const currentText = editor.getText();
        // Clear editor if content is empty
        if (content === '' && currentText !== '') {
            editor.commands.clearContent();
        }
        // Only update if content actually changed and has content
        else if (content.trim() && currentText.trim() !== content.trim()) {
            editor.commands.setContent(content);
        }
    }
}, [content, editor]);
```

**File**: `src/components/messageSubmitInterface/TiptapEditor.tsx` (lines 107-119)

## Bug 2: Icon Layout Collision ✅

### Problem
The emoji picker icon (inside TiptapEditor, bottom-right of input) and the attachment icon (also bottom-right) collided visually, making it confusing for users.

### Desired Layout
Place all feature icons vertically in the `textarea__featureWrapper` sidebar:
1. Richtext toggle (top)
2. Attachment upload (middle)
3. Emoji picker (bottom, inside editor)

### Fix
Moved the attachment icon from its absolute-positioned location (`textarea__attachmentSelect`) into the `textarea__featureWrapper` container.

**File**: `src/components/messageSubmitInterface/messageSubmitInterfaceComponent.tsx`
- Lines 897-908: Added attachment icon to featureWrapper
- Condition: Only show when no attachment is selected
- Class: `textarea__attachmentIcon`

**File**: `src/components/messageSubmitInterface/messageSubmitInterface.styles.scss`
- Lines 271-297: Added styles for `&__attachmentIcon`
- Matches styling of `&__richtextToggle`
- Proper vertical spacing and hover effects

### Result
Icons now stack vertically without collision:
```
┌─────────┐
│    ⬇️    │ ← Richtext toggle
│    📎    │ ← Attachment upload
│    😊    │ ← Emoji picker (in editor)
└─────────┘
```

## Bug 3: File Decryption Errors ("Fehler beim entschlüsseln") ✅

### Problem
ALL uploaded files showed "decryption error" when trying to view them, regardless of file type or encryption settings.

### Root Cause
Complex interaction between E2EE room settings and attachment encryption:

1. **Dev Toolbar Setting**: `STORAGE_KEY_ATTACHMENT_ENCRYPTION` controls whether attachments are encrypted during upload
2. **When Disabled**: Attachments upload without encryption (plain files)
3. **Message Marking**: Backend still marks messages as `t: 'e2e'` because the room has E2EE enabled
4. **Frontend Logic**: Sees `props.t === 'e2e'` and tries to decrypt, causing errors

**The Issue**:
```typescript
// Old logic - showed preview if:
encryptedFile || props.t !== 'e2e'

// Problem: When props.t === 'e2e' but file isn't encrypted,
// this shows placeholder instead of image
```

### Fix
Added `shouldDecryptAttachment` computed value that checks all three conditions:

```typescript
const shouldDecryptAttachment = React.useMemo(() => {
    return encrypted && props.t === 'e2e' && isAttachmentEncryptionEnabled;
}, [encrypted, props.t, isAttachmentEncryptionEnabled]);
```

Then updated all preview/decryption logic to use this flag:

1. **Image Preview** (line 240):
   ```typescript
   // Before
   encryptedFile || props.t !== 'e2e'
   
   // After
   encryptedFile || !shouldDecryptAttachment
   ```

2. **Audio Player** (line 257):
   ```typescript
   // Before
   attachmentStatus === DECRYPTION_FINISHED || props.t !== 'e2e'
   
   // After
   attachmentStatus === DECRYPTION_FINISHED || !shouldDecryptAttachment
   ```

3. **Preview URL** (lines 198-207):
   ```typescript
   const getPreviewUrl = useCallback(() => {
       // If attachment encryption is not enabled, use direct URL
       if (!shouldDecryptAttachment) {
           return apiUrl + props.attachment.title_link;
       }
       // If encrypted, return the decrypted blob URL
       if (props.t === 'e2e') {
           return encryptedFile;
       }
       return apiUrl + props.attachment.title_link;
   }, [props.t, encryptedFile, props.attachment.title_link, shouldDecryptAttachment]);
   ```

4. **Handle Preview Click** (line 187):
   ```typescript
   // Before
   if (props.t === 'e2e' && !encryptedFile)
   
   // After
   if (shouldDecryptAttachment && !encryptedFile)
   ```

**File**: `src/components/message/MessageAttachment.tsx`

### Result
Now files display correctly based on actual encryption status:
- ✅ Non-encrypted files in E2EE rooms → Show directly
- ✅ Encrypted files → Decrypt then show
- ✅ No more false decryption errors

## Testing Recommendations

### Test Case 1: Message Sending
1. Type a message with formatting
2. Send the message
3. ✅ **Verify**: Editor clears completely

### Test Case 2: Icon Layout
1. Open chat interface
2. ✅ **Verify**: Icons stack vertically in left sidebar
3. ✅ **Verify**: No visual collision
4. Click each icon
5. ✅ **Verify**: All icons work correctly

### Test Case 3: Attachments (E2EE Room, Attachment Encryption Disabled)
1. Open dev toolbar
2. Set "DEV ATTACHMENT ENCRYPTION" to "Disabled"
3. Upload an image
4. ✅ **Verify**: Image preview shows immediately (not encrypted placeholder)
5. Click preview
6. ✅ **Verify**: Modal opens with image (no decryption error)
7. Upload a PDF
8. ✅ **Verify**: PDF opens in modal
9. Upload an MP3
10. ✅ **Verify**: Audio player appears and plays

### Test Case 4: Attachments (E2EE Room, Attachment Encryption Enabled)
1. Open dev toolbar
2. Set "DEV ATTACHMENT ENCRYPTION" to "Enabled"
3. Upload an image
4. ✅ **Verify**: Image shows encrypted placeholder
5. Click preview
6. ✅ **Verify**: Decryption happens, then modal opens
7. Upload and test PDF and audio
8. ✅ **Verify**: All work with encryption

## Files Changed

1. `src/components/messageSubmitInterface/TiptapEditor.tsx`
   - Added `onEditorReady` prop
   - Fixed empty content handling

2. `src/components/message/MessageAttachment.tsx`
   - Added `shouldDecryptAttachment` computed value
   - Updated all decryption logic
   - Fixed preview conditions

3. `src/components/messageSubmitInterface/messageSubmitInterfaceComponent.tsx`
   - Moved attachment icon to featureWrapper

4. `src/components/messageSubmitInterface/messageSubmitInterface.styles.scss`
   - Added `&__attachmentIcon` styles

## Summary

All three critical bugs have been fixed:
- ✅ Editor clears after send
- ✅ Icons properly laid out
- ✅ Attachments display without false decryption errors

The fixes maintain backward compatibility and don't introduce breaking changes.
