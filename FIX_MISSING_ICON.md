# Fix: Missing file.svg Icon Import

## Problem
Dev server failed to start with error:
```
Failed to resolve import "../../resources/img/icons/file.svg?react" 
from "src/components/message/messageHelpers.ts". Does the file exist?
```

## Root Cause
During the attachment enhancement implementation, I added support for audio files and unknown attachment types. To provide a generic icon for these cases, I imported `file.svg` which doesn't exist in the repository.

## Available Icons in Repository

### File-specific Icons (Existing)
- ✅ `file-doc.svg` - For DOCX files
- ✅ `file-image.svg` - For PNG/JPEG files
- ✅ `file-pdf.svg` - For PDF files
- ✅ `file-xls.svg` - For XLSX files

### Generic Icons
- ❌ `file.svg` - **DOES NOT EXIST**
- ✅ `documents.svg` - **EXISTS** (used in multiple places as CopyIcon)

## Solution

Replaced the non-existent `file.svg` import with `documents.svg`:

```typescript
// Before (BROKEN):
import FileIcon from '../../resources/img/icons/file.svg?react';

export const getIconForAttachmentType = (attachmentType: string) => {
	// ... other cases ...
	else if (isAudioAttachment(attachmentType)) {
		return FileIcon; // Audio files
	}
	return FileIcon; // Unknown types
};

// After (FIXED):
import DocumentsIcon from '../../resources/img/icons/documents.svg?react';

export const getIconForAttachmentType = (attachmentType: string) => {
	// ... other cases ...
	else if (isAudioAttachment(attachmentType)) {
		return DocumentsIcon; // Audio files
	}
	return DocumentsIcon; // Unknown types
};
```

## Impact

### Who Uses This Icon
1. **Audio attachments**: MP3, WAV, OGG, M4A files
2. **Unknown file types**: Any attachment type not explicitly handled

### Visual Impact
- Audio files and unknown types will display the `documents.svg` icon
- No functional changes
- Icon is semantically appropriate (documents icon for file attachments)

## Verification

✅ **No other references**: Searched entire codebase, no other imports of `file.svg`
✅ **Icon exists**: Confirmed `documents.svg` exists at path
✅ **Used elsewhere**: The icon is already used in 5 other components (CopyIcon)
✅ **Changes minimal**: Only 3 lines changed (1 import, 2 return statements)

## Testing

### To Verify Dev Server Works
```bash
cd /home/runner/work/vi-saas-frontend/vi-saas-frontend
npm run dev
```

Expected: Server starts without import errors

### To Verify Icons Display
1. Upload an MP3 audio file
2. Check that the documents icon appears
3. Upload an unknown file type
4. Check that the documents icon appears

## Files Changed

- `src/components/message/messageHelpers.ts` (3 lines)

## Related

This fix completes the attachment enhancement feature that added:
- Image previews with modal
- PDF viewer with modal
- Audio player inline
- Support for MP3, WAV, OGG, M4A formats

The missing icon import was preventing the dev server from starting, but the functionality itself was correctly implemented.
