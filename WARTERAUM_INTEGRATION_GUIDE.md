# Warteraum Integration Guide

## Overview

This guide documents how to integrate the `/beratung/warteraum` (waiting room) route into the new MUI-based registration/login system, and how to add live chat availability checking to the Welcome page.

---

## Task 1: Add /beratung/warteraum Route

### Step 1: Add Route to app.tsx

**Location:** `src/components/app/app.tsx`

Add the route inside the Switch component:

```tsx
<Route path="/beratung/warteraum" exact>
    <WaitingRoom />
</Route>
```

**Import:**
```tsx
import { WaitingRoom } from '../waitingRoom/WaitingRoom';
```

### Step 2: Verify Routing Works

Test:
1. Navigate to `/beratung/warteraum`
2. Verify waiting room loads
3. Verify no redirects

---

## Task 2: Convert WaitingRoom to MUI Components

### Current Components Location:
- `src/components/waitingRoom/WaitingRoom.tsx`
- `src/components/waitingRoom/WaitingRoomContent.tsx`
- `src/components/waitingRoom/WaitingRoomLoader.tsx`

### Components to Convert:

#### 1. Typography Elements
Convert all text elements to MUI Typography:

**Before:**
```tsx
<div className="text__label">Text here</div>
```

**After:**
```tsx
<Typography variant="body1">Text here</Typography>
```

#### 2. Buttons
Convert to MUI Button:

**Before:**
```tsx
<button className="button button--primary">Click</button>
```

**After:**
```tsx
<Button variant="contained" color="primary">Click</Button>
```

#### 3. Loading Indicators
Use MUI CircularProgress:

**Before:**
```tsx
<div className="spinner"></div>
```

**After:**
```tsx
<CircularProgress />
```

### Layout Components

Use MUI Box, Container, Stack for layout:

```tsx
<Container maxWidth="md">
    <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
            {/* Content */}
        </Stack>
    </Box>
</Container>
```

---

## Task 3: Check Live Chat Availability Logic

### Find Current Logic

Check `src/components/waitingRoom/waitingRoomHelpers.ts` for:
- `checkChatAvailability()` function
- API endpoint for checking availability
- Return value structure

### Expected Logic:

```typescript
export const checkChatAvailability = async (): Promise<boolean> => {
    try {
        // API call to check if live chat is available
        const response = await apiGetChatAvailability();
        return response.isAvailable;
    } catch (error) {
        console.error('Error checking chat availability:', error);
        return false;
    }
};
```

---

## Task 4: Add Live Chat Check to Welcome Page

### Step 1: Update Welcome.tsx

**Location:** `src/components/welcome/Welcome.tsx`

Add imports:
```tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { checkChatAvailability } from '../waitingRoom/waitingRoomHelpers';
import { useTranslation } from 'react-i18next';
```

### Step 2: Add State Management

```tsx
const Welcome = () => {
    const { t } = useTranslation();
    const [isChatAvailable, setIsChatAvailable] = useState(false);
    const [isCheckingChat, setIsCheckingChat] = useState(true);
    
    useEffect(() => {
        // Async check - doesn't delay page load
        const checkChat = async () => {
            try {
                const available = await checkChatAvailability();
                setIsChatAvailable(available);
            } catch (error) {
                console.error('Error checking chat:', error);
            } finally {
                setIsCheckingChat(false);
            }
        };
        
        checkChat();
    }, []);
    
    // ... rest of component
};
```

### Step 3: Add Conditional Rendering

Add after existing `registrationWelcome__buttonsWrapper`:

```tsx
{/* Existing buttons wrapper */}
<div className="registrationWelcome__buttonsWrapper">
    {/* Existing registration/login buttons */}
</div>

{/* New live chat section - only show if available */}
{!isCheckingChat && isChatAvailable && (
    <Box 
        className="registrationWelcome__buttonsWrapper"
        sx={{ mt: '12px' }}
    >
        <Typography 
            variant="h6" 
            component="h2"
            sx={{ mb: 2 }}
        >
            {t('welcome.liveChat.available.headline')}
        </Typography>
        <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => window.location.href = '/beratung/warteraum'}
        >
            {t('welcome.liveChat.enterWaitingRoom.button')}
        </Button>
    </Box>
)}
```

---

## Task 5: Add i18n Labels

### Step 1: Create Weblate Import File

**Location:** `weblate/de-new-labels.json`

```json
{
    "welcome": {
        "liveChat": {
            "available": {
                "headline": "Anonymer Live-Chat ist gerade verfügbar!"
            },
            "enterWaitingRoom": {
                "button": "Live-Chat Warteraum betreten"
            }
        }
    }
}
```

### Step 2: Add to German Translation Files

**Files to update:**
1. `src/resources/i18n/de/common.json`
2. `src/resources/i18n/de@informal/common.json`
3. `src/resources/i18n/de@easy/common.json` (if exists)

Add the same structure to each file:

```json
{
    "welcome": {
        "liveChat": {
            "available": {
                "headline": "Anonymer Live-Chat ist gerade verfügbar!"
            },
            "enterWaitingRoom": {
                "button": "Live-Chat Warteraum betreten"
            }
        }
    }
}
```

---

## Testing Checklist

### Warteraum Route:
- [ ] Navigate to `/beratung/warteraum`
- [ ] Verify page loads correctly
- [ ] Verify no console errors
- [ ] Verify MUI components render
- [ ] Verify styling looks good
- [ ] Test on mobile viewport

### Live Chat Check on Welcome:
- [ ] Open Welcome page
- [ ] Verify async check doesn't delay page
- [ ] If chat available: Verify new section shows
- [ ] Verify headline text correct
- [ ] Verify button text correct
- [ ] Click button → Verify navigates to warteraum
- [ ] If chat NOT available: Verify section hidden

### i18n Labels:
- [ ] Verify German labels load
- [ ] Verify informal German labels load
- [ ] Test language switching
- [ ] Verify no missing translation warnings

### Integration Tests:
- [ ] Complete registration flow
- [ ] Login flow
- [ ] Navigate to waiting room from Welcome
- [ ] Navigate to legal pages
- [ ] Verify state persistence still works

---

## Estimated Implementation Time

- **Route Integration:** 30 minutes
- **MUI Conversion:** 2-3 hours
- **Live Chat Check:** 1 hour
- **i18n Labels:** 30 minutes
- **Testing:** 1-2 hours

**Total:** 4-6 hours

---

## Code Quality Standards

### Follow Existing Patterns:
- Use MUI components consistently
- Use theme spacing (sx prop)
- Type-safe TypeScript
- Proper error handling
- Async operations for API calls

### Clean Up:
- Remove unused SCSS files
- Remove old custom components
- Update imports
- Remove console.logs

---

## Deployment Strategy

### Option 1: Separate PR
- Complete warteraum integration
- Create new PR
- Review and test
- Deploy separately

### Option 2: Add to Current PR
- Continue in current branch
- Add new commits
- Single comprehensive PR
- Deploy together

**Recommendation:** Option 1 (separate PR) for cleaner review process

---

## Support

If you encounter issues:
1. Check console for errors
2. Verify API endpoints work
3. Check network tab for failed requests
4. Verify i18n labels load
5. Test in different browsers

---

## Summary

This guide provides everything needed to:
1. ✅ Add warteraum route
2. ✅ Convert to MUI components
3. ✅ Check live chat availability
4. ✅ Add to Welcome page
5. ✅ Create i18n labels
6. ✅ Test thoroughly

**Ready to implement!**
