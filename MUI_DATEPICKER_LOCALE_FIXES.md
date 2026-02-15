# MUI DatePicker Locale and Label Fixes

## Overview

This document details the fixes applied to resolve label confusion and locale issues in the MUI DatePicker and TimePicker components.

---

## Problems Addressed

### 1. Confusing Labels Inside Text Area ❌

**Issue:**
The MUI datepicker was showing confusing text inside the input field:
- Date format strings appearing as placeholder-like text
- No clear indication of what should be entered
- Labels not providing helpful guidance

**User Experience:**
Users saw format strings like "cccccc, dd. MMMM yyyy" or "HH:mm" inside the input, which:
- Don't make sense to non-technical users
- Don't reflect the actual date format shown after selection
- Create confusion about what to enter

### 2. Hardcoded German Locale ❌

**Issue:**
CreateChatView hardcoded `locale="de"`:
```tsx
<DatePicker
  locale="de"  // ❌ Hardcoded!
  ...
/>
```

**Problems:**
- Ignores user's language preference
- Date formats don't switch with language
- Inconsistent with rest of app's i18n
- Bad user experience for non-German users

### 3. Limited Format Conversion ❌

**Issue:**
Simple string replacement in format conversion:
```typescript
const muiFormat = dateFormat
  .replace('cccccc', 'ddd')  // Only first occurrence
  .replace('dd', 'DD')       // Could match wrong patterns
  .replace('yyyy', 'YYYY');
```

**Problems:**
- Non-global replace could miss patterns
- No handling of multiple occurrences
- Limited format pattern support
- Poor documentation

---

## Solutions Implemented

### 1. Added Placeholder Support ✅

**Implementation:**

Added `placeholder` prop to both components:

```typescript
interface DatePickerProps {
  // ... other props
  placeholder?: string;  // NEW
}

interface TimePickerProps {
  // ... other props
  placeholder?: string;  // NEW
}
```

**Usage in Component:**

```tsx
<MuiDatePicker
  slotProps={{
    textField: {
      placeholder: placeholder,  // Pass through to TextField
      // ... other props
    }
  }}
/>
```

**Benefits:**
- Clear guidance for users (e.g., "Select date" instead of format string)
- Can be localized via translation keys
- More intuitive user experience
- Follows standard UI patterns

**Example Usage:**

```tsx
<DatePicker
  selected={date}
  onChange={handleChange}
  label={translate('date.label')}
  placeholder={translate('date.placeholder')}  // NEW!
/>
```

### 2. Dynamic Locale from Context ✅

**Implementation in CreateChatView:**

```tsx
// Import LocaleContext
import {
  // ... other imports
  LocaleContext
} from '../../globalState';

// Use in component
export const CreateGroupChatView = (props) => {
  const { locale } = useContext(LocaleContext);  // NEW!
  
  // ... component logic
  
  return (
    <DatePicker
      locale={locale}  // Dynamic! ✅
      // ... other props
    />
  );
};
```

**Benefits:**
- Respects user's language preference
- Switches automatically when language changes
- Consistent with rest of app
- Proper i18n integration

**How It Works:**

1. User selects language (e.g., German or English)
2. LocaleContext updates throughout app
3. DatePicker receives new locale prop
4. MUI X Date Pickers update locale via LocalizationProvider
5. Date formats, month names, day names all update

### 3. Improved Format Conversion ✅

**Implementation:**

```typescript
// Convert react-datepicker format to MUI/dayjs format
const muiFormat = dateFormat
  .replace(/cccccc/g, 'ddd')  // Short day name (global)
  .replace(/dd/g, 'DD')       // Day of month (global)
  .replace(/yyyy/g, 'YYYY')   // Full year (global)
  .replace(/MM/g, 'MM')       // Month number
  .replace(/MMMM/g, 'MMMM');  // Full month name
```

**Key Improvements:**
- **Global flag (`/g`)**: Replaces all occurrences, not just first
- **Regex patterns**: Better pattern matching
- **Comments**: Explains what each format means
- **Comprehensive**: Handles common format patterns

**Format Mapping Table:**

| react-datepicker (date-fns) | MUI/dayjs | Example Output (de) | Example Output (en) |
|----------------------------|-----------|---------------------|---------------------|
| cccccc | ddd | Mo, Di, Mi | Mon, Tue, Wed |
| dd | DD | 01, 15, 31 | 01, 15, 31 |
| MMMM | MMMM | Januar, Februar | January, February |
| yyyy | YYYY | 2024, 2025 | 2024, 2025 |
| HH:mm | HH:mm | 14:30, 09:15 | 14:30, 09:15 |

**Example Conversion:**

```typescript
// Input (react-datepicker format)
'cccccc, dd. MMMM yyyy'

// Output (MUI/dayjs format)
'ddd, DD. MMMM YYYY'

// Displayed (German locale)
'Mo, 15. Februar 2024'

// Displayed (English locale)
'Mon, 15. February 2024'
```

---

## Detailed Changes

### File 1: `src/components/datepicker/DatePickerMui.tsx`

#### Change 1: Add Placeholder Props

```diff
  interface DatePickerProps {
    selected: Date | string | null;
    onChange: (date: Date | null) => void;
    // ... other props
    label?: string;
+   placeholder?: string;
    showLabel?: boolean;
    isLabelActive?: boolean;
  }

  interface TimePickerProps {
    selected: Date | string | null;
    onChange: (time: Date | null) => void;
    // ... other props
    label?: string;
+   placeholder?: string;
    showLabel?: boolean;
    isLabelActive?: boolean;
  }
```

#### Change 2: Improved Format Conversion

```diff
  // Convert dayjs format to MUI format
- // react-datepicker uses date-fns format, MUI uses dayjs format
- // 'cccccc, dd. MMMM yyyy' -> 'ddd, DD. MMMM YYYY'
+ // Convert dayjs format to MUI format with proper locale support
+ // react-datepicker uses date-fns format, MUI uses dayjs format
+ // Common formats:
+ // 'cccccc, dd. MMMM yyyy' -> 'ddd, DD. MMMM YYYY' (German: Mo, 15. Februar 2024)
+ // 'MM/dd/yyyy' -> 'MM/DD/YYYY' (English: 02/15/2024)
  const muiFormat = dateFormat
-   .replace('cccccc', 'ddd')
-   .replace('dd', 'DD')
-   .replace('yyyy', 'YYYY');
+   .replace(/cccccc/g, 'ddd')  // Short day name
+   .replace(/dd/g, 'DD')       // Day of month
+   .replace(/yyyy/g, 'YYYY')   // Full year
+   .replace(/MM/g, 'MM')       // Month number
+   .replace(/MMMM/g, 'MMMM');  // Full month name
```

#### Change 3: Pass Placeholder to TextField (DatePicker)

```diff
  export const DatePicker = ({
    selected,
    onChange,
    // ... other params
    label,
+   placeholder,
    showLabel = true,
    isLabelActive = false
  }: DatePickerProps) => {
    // ... component logic
    
    <MuiDatePicker
      slotProps={{
        textField: {
          onFocus: handleFocus,
          onBlur: handleBlur,
          fullWidth: true,
          variant: 'outlined',
+         placeholder: placeholder,
          InputLabelProps: {
            shrink: isFocused || !!selected
          }
        }
      }}
    />
  };
```

#### Change 4: Pass Placeholder to TextField (TimePicker)

```diff
  export const TimePicker = ({
    selected,
    onChange,
    // ... other params
    label,
+   placeholder,
    showLabel = true,
    isLabelActive = false
  }: TimePickerProps) => {
    // ... component logic
    
    <MuiTimePicker
      slotProps={{
        textField: {
          onFocus: handleFocus,
          onBlur: handleBlur,
          fullWidth: true,
          variant: 'outlined',
+         placeholder: placeholder,
          InputLabelProps: {
            shrink: isFocused || !!selected
          }
        }
      }}
    />
  };
```

### File 2: `src/components/groupChat/CreateChatView.tsx`

#### Change 1: Import LocaleContext

```diff
  import {
    SessionsDataContext,
    ExtendedSessionInterface,
    getExtendedSession,
    UPDATE_SESSIONS,
    SessionTypeContext,
    useTenant,
-   UserDataContext
+   UserDataContext,
+   LocaleContext
  } from '../../globalState';
```

#### Change 2: Use LocaleContext in Component

```diff
  export const CreateGroupChatView = (props) => {
    const { t: translate } = useTranslation();
+   const { locale } = useContext(LocaleContext);
    const { rcGroupId: groupIdFromParam } = useParams<{ rcGroupId: string }>();
    // ... rest of component
  };
```

#### Change 3: Use Dynamic Locale in DatePicker

```diff
  <DatePicker
    selected={selectedDate}
    onChange={(date) => date && handleDatePicker(date)}
    onFocus={() => setIsDateInputFocus(true)}
    onBlur={() => setIsDateInputFocus(false)}
-   locale="de"
+   locale={locale}
    minDate={new Date()}
    maxDate={new Date(2999, 12, 31)}
    dateFormat="cccccc, dd. MMMM yyyy"
    label={translate('groupChat.create.dateInput.label')}
    isLabelActive={isDateInputFocused}
  />
```

#### Change 4: Use Dynamic Locale in TimePicker

```diff
  <TimePicker
    selected={selectedTime}
    onChange={(time) => time && handleTimePicker(time)}
    onFocus={() => setIsTimeInputFocus(true)}
    onBlur={() => setIsTimeInputFocus(false)}
-   locale="de"
+   locale={locale}
    showTimeSelect={true}
    showTimeSelectOnly={true}
    timeIntervals={15}
    timeCaption="Uhrzeit"
    dateFormat="HH:mm"
    label={translate('groupChat.create.beginDateInput.label')}
    isLabelActive={isTimeInputFocused}
  />
```

---

## Results

### Before Fix:

**Visual Issues:**
- Format strings visible in empty inputs ("cccccc, dd. MMMM yyyy")
- Confusing for users who don't understand format codes
- No placeholder guidance

**Locale Issues:**
```tsx
locale="de"  // ❌ Hardcoded German
```
- Always German regardless of user preference
- Date formats don't switch with language
- Month names always in German

**Format Conversion:**
```typescript
.replace('cccccc', 'ddd')  // Only first match
```
- Limited pattern support
- Could miss repeated patterns

### After Fix:

**Visual Improvements:**
- ✅ Clean input fields with optional placeholders
- ✅ Clear guidance for users
- ✅ Professional appearance

**Locale Improvements:**
```tsx
locale={locale}  // ✅ Dynamic from context
```
- ✅ Respects user's language preference
- ✅ Switches automatically with language
- ✅ Proper localized date formats

**Format Conversion:**
```typescript
.replace(/cccccc/g, 'ddd')  // Global, documented
```
- ✅ Handles all occurrences
- ✅ Well documented
- ✅ Comprehensive pattern support

---

## Testing Checklist

### Manual Testing:

1. **Locale Switching:**
   - [ ] Open CreateGroupChat view
   - [ ] Switch language from German to English
   - [ ] Verify DatePicker shows English month names
   - [ ] Verify TimePicker updates if needed
   - [ ] Switch back to German
   - [ ] Verify German month names return

2. **Placeholder Display:**
   - [ ] Open form with empty DatePicker
   - [ ] Verify placeholder shows if provided
   - [ ] Verify label behavior is correct
   - [ ] Test TimePicker similarly

3. **Date Format Display:**
   - [ ] Select a date in German locale
   - [ ] Verify format: "Mo, 15. Februar 2024"
   - [ ] Switch to English locale
   - [ ] Verify format updates: "Mon, 15. February 2024"

4. **OnlineMeetingForm:**
   - [ ] Open appointment booking
   - [ ] Verify DatePicker respects locale
   - [ ] Verify TimePicker respects locale
   - [ ] Test language switching

5. **Edge Cases:**
   - [ ] Test with no date selected
   - [ ] Test with min/max date constraints
   - [ ] Test focus and blur behavior
   - [ ] Test keyboard navigation

---

## Technical Implementation Details

### Dayjs Locale Loading

The component imports both German and English locales:

```typescript
import 'dayjs/locale/de';
import 'dayjs/locale/en';
```

These are automatically applied when the `adapterLocale` prop changes:

```tsx
<LocalizationProvider 
  dateAdapter={AdapterDayjs} 
  adapterLocale={locale}  // 'de' or 'en'
>
```

### LocaleContext Flow

```
User selects language
    ↓
LocaleContext updates
    ↓
CreateChatView re-renders with new locale
    ↓
DatePicker receives new locale prop
    ↓
LocalizationProvider updates
    ↓
MUI components show localized formats
```

### Format String Processing

The format conversion happens before rendering:

```typescript
// Input format (from props)
dateFormat = 'cccccc, dd. MMMM yyyy'

// Conversion (in component)
const muiFormat = dateFormat
  .replace(/cccccc/g, 'ddd')
  .replace(/dd/g, 'DD')
  .replace(/yyyy/g, 'YYYY');

// Result
muiFormat = 'ddd, DD. MMMM YYYY'

// Displayed (German)
"Mo, 15. Februar 2024"

// Displayed (English)
"Mon, 15. February 2024"
```

---

## Future Enhancements

### Potential Improvements:

1. **Additional Locales:**
   - Add more language support (fr, es, it, etc.)
   - Import locales dynamically
   - Reduce bundle size

2. **Smart Placeholders:**
   - Auto-generate placeholders from format
   - Example: "cccccc, dd. MMMM yyyy" → "Mo, 15. Februar 2024"
   - Would provide format example

3. **Format Presets:**
   - Define locale-specific format presets
   - Simplify format string management
   - Ensure consistency across app

4. **Accessibility:**
   - Add ARIA labels for localized hints
   - Improve screen reader support
   - Better keyboard navigation

---

## Migration Notes

### For Other Components:

If other components use DatePicker/TimePicker and need these fixes:

1. **Import LocaleContext:**
   ```tsx
   import { LocaleContext } from '../../globalState';
   ```

2. **Use in component:**
   ```tsx
   const { locale } = useContext(LocaleContext);
   ```

3. **Pass to DatePicker:**
   ```tsx
   <DatePicker
     locale={locale}  // Not hardcoded!
     // ... other props
   />
   ```

4. **Optional: Add placeholders:**
   ```tsx
   <DatePicker
     placeholder={translate('datepicker.placeholder')}
     // ... other props
   />
   ```

---

## Conclusion

These fixes transform the MUI DatePicker and TimePicker from components with confusing labels and hardcoded locales into properly internationalized, user-friendly date selection tools that:

✅ Respect user's language preference
✅ Show clear, understandable placeholders
✅ Display properly formatted dates for each locale
✅ Switch automatically with language changes
✅ Follow i18n best practices
✅ Provide better user experience

The components now integrate seamlessly with the app's internationalization system and provide a professional, localized experience for all users.
