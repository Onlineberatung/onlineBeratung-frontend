# MUI Component Migration Plan

## Executive Summary

This document provides a comprehensive plan for replacing remaining custom components with Material-UI (MUI) equivalents in the vi-saas-frontend application.

**Current Migration Status:** ~85% Complete  
**Remaining Components:** 5 custom components  
**Grid Assessment:** CSS Grid usage is appropriate, no MUI Grid replacement needed

---

## Already Migrated Components ✅

The following components have already been successfully migrated to MUI:

1. **Button** → MUI Button (with ButtonMui component)
2. **Card** → MUI Card
3. **Checkbox** → MUI Checkbox with FormControlLabel
4. **RadioButton** → MUI Radio with FormControlLabel  
5. **Switch** → MUI Switch with FormControlLabel
6. **Select** → MUI Select/Autocomplete (SelectDropdownMui)
7. **Spinner/LoadingIndicator** → MUI CircularProgress (SpinnerMui, LoadingIndicatorMui)
8. **ProgressBar** → MUI LinearProgress (ProgressBarMui)
9. **Tooltip** → MUI Tooltip (TooltipMui)
10. **DatePicker** → MUI X DatePicker/TimePicker
11. **Modal** → MUI Dialog
12. **FlyoutMenu** → MUI Menu (FlyoutMenuMui)
13. **SessionMenu** → MUI Menu
14. **Overlay** → MUI components

---

## Components Ready for MUI Migration 🎯

### 1. Box Component → MUI Box/Alert

**Current Implementation:**
- **Location:** `src/components/box/Box.tsx`, `box.module.scss`
- **Description:** Custom div-based container with optional title and type variants
- **Type Variants:** `error`, `info`, `success`
- **Usage Count:** 5 files (primarily in bookings module)

**MUI Replacement:** MUI Box + MUI Alert (for typed variants)

**Migration Strategy:**
```tsx
// Current usage:
<Box type={BoxTypes.INFO} title="Info Title">
  Content here
</Box>

// Proposed MUI equivalent:
<Alert severity="info" 
       title="Info Title"
       sx={{ mb: 2, borderRadius: 1 }}>
  Content here
</Alert>

// For non-typed boxes:
<Box sx={{ 
  bgcolor: 'rgba(255, 255, 255, 0.7)',
  border: '1px solid rgba(255, 255, 255, 0.7)',
  p: { xs: 2, md: 3 },
  mb: { xs: 1, md: 2 },
  borderRadius: 1
}}>
  Content here
</Box>
```

**Benefits:**
- MUI Alert provides better semantic meaning for error/info/success states
- Built-in icons for alert types
- Better accessibility (ARIA roles)
- Responsive padding using MUI spacing system
- Remove ~40 lines of custom SCSS

**Complexity:** Low  
**Estimated Effort:** 2-3 hours  
**Breaking Changes:** None (can maintain backward compatibility)

---

### 2. Text Component → MUI Typography

**Current Implementation:**
- **Location:** `src/components/text/Text.tsx`, `text.styles.scss`
- **Description:** Custom p-tag based component with text type variants
- **Type Variants:** 
  - `standard`
  - `infoLargeStandard`
  - `infoLargeAlternative`
  - `infoMedium`
  - `infoSmall`
  - `divider`
- **Special Features:** Label types (NOTICE), dangerouslySetInnerHTML support
- **Usage Count:** 200+ locations (most widely used component)

**MUI Replacement:** MUI Typography

**Migration Strategy:**
```tsx
// Type mapping:
const typeToVariantMap = {
  'standard': 'body1',
  'infoLargeStandard': 'h6',
  'infoLargeAlternative': 'h6',
  'infoMedium': 'body2',
  'infoSmall': 'caption',
  'divider': 'caption'
};

// Current usage:
<Text text="Some text" type="infoSmall" className="custom" />

// Proposed MUI equivalent:
<Typography 
  variant="caption" 
  className="custom"
  dangerouslySetInnerHTML={{ __html: "Some text" }}
/>
```

**Benefits:**
- MUI Typography provides responsive font sizing out of the box
- Better semantic HTML (can use span, p, div as needed via `component` prop)
- Theme integration for consistent typography across app
- Built-in variants: h1-h6, subtitle1-2, body1-2, caption, overline
- Remove ~80 lines of custom SCSS

**Complexity:** High (due to widespread usage)  
**Estimated Effort:** 8-12 hours  
**Breaking Changes:** Minimal (maintain wrapper for backward compatibility)

**Recommendation:** 
- Create `TextMui.tsx` wrapper component that maps old props to MUI Typography
- Gradually migrate high-traffic pages
- Keep both implementations temporarily

---

### 3. Headline Component → MUI Typography

**Current Implementation:**
- **Location:** `src/components/headline/Headline.tsx`, `headline.styles.scss`
- **Description:** Custom h1-h5 component with semantic and style levels
- **Features:**
  - `semanticLevel`: Actual HTML tag (h1, h2, h3, h4, h5)
  - `styleLevel`: Visual styling level (can differ from semantic)
  - Supports dangerouslySetInnerHTML
- **Usage Count:** 100+ locations

**MUI Replacement:** MUI Typography with `component` and `variant` props

**Migration Strategy:**
```tsx
// Current usage:
<Headline 
  text="Title" 
  semanticLevel="2" 
  styleLevel="3" 
  className="custom"
/>

// Proposed MUI equivalent:
<Typography 
  variant="h3"           // styleLevel
  component="h2"         // semanticLevel
  className="custom"
  dangerouslySetInnerHTML={{ __html: "Title" }}
/>
```

**Benefits:**
- Semantic HTML control via `component` prop
- Visual styling control via `variant` prop
- Theme integration for consistent heading styles
- Responsive typography
- Remove ~60 lines of custom SCSS

**Complexity:** Medium  
**Estimated Effort:** 6-8 hours  
**Breaking Changes:** None (can maintain wrapper)

**Recommendation:**
- Create `HeadlineMui.tsx` wrapper that maps props
- Keep backward compatibility initially
- High priority after Text component

---

### 4. InputField Component → MUI TextField

**Current Implementation:**
- **Location:** `src/components/inputField/InputField.tsx`, `inputField.styles.scss`
- **Description:** Custom input with floating label, validation, password toggle
- **Features:**
  - Floating label
  - Icon support (left side)
  - Password visibility toggle
  - Validation states (valid/invalid)
  - Info text below input
  - Pattern validation
  - Max length
  - Disabled state
- **Usage Count:** 50+ locations (forms, login, registration)

**MUI Replacement:** MUI TextField with InputAdornment

**Migration Strategy:**
```tsx
// Current usage:
<InputField 
  item={{
    id: "password",
    type: "password",
    name: "password",
    label: "Password",
    content: value,
    labelState: "valid",
    icon: <LockIcon />
  }}
  inputHandle={handleChange}
/>

// Proposed MUI equivalent:
<TextField
  id="password"
  name="password"
  type={showPassword ? 'text' : 'password'}
  label="Password"
  value={value}
  onChange={handleChange}
  error={labelState === 'invalid'}
  helperText={infoText}
  fullWidth
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <LockIcon />
      </InputAdornment>
    ),
    endAdornment: type === 'password' && (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    )
  }}
/>
```

**Benefits:**
- Built-in floating label animation
- Error states and helper text
- Input adornments for icons
- Better accessibility
- Theme integration
- Consistent form field appearance
- Remove ~150 lines of custom SCSS

**Complexity:** High (complex interface, widespread usage in critical forms)  
**Estimated Effort:** 10-14 hours  
**Breaking Changes:** Interface changes required

**Recommendation:**
- **CAREFUL:** This component is used in login, registration, and profile forms
- Create `InputFieldMui.tsx` wrapper to maintain interface compatibility
- Thorough testing required for all form flows
- Consider phased rollout
- High impact on user experience

---

### 5. Tag Component → MUI Chip

**Current Implementation:**
- **Location:** `src/components/tag/Tag.tsx`, `tag.styles.scss`
- **Description:** Custom span-based tag for status indicators
- **Color Variants:** `yellow`, `green`, `red`
- **Features:**
  - Optional link (wraps in react-router Link)
  - Clickable state
- **Usage Count:** 30+ locations (session lists, status indicators)

**MUI Replacement:** MUI Chip

**Migration Strategy:**
```tsx
// Current usage:
<Tag text="Active" color="green" link="/path" className="custom" />

// Proposed MUI equivalent:
<Chip
  label="Active"
  color="success"
  component={link ? Link : 'span'}
  to={link}
  clickable={!!link}
  className="custom"
  size="small"
/>

// Color mapping:
const colorMap = {
  'yellow': 'warning',
  'green': 'success',
  'red': 'error'
};
```

**Benefits:**
- Built-in color variants (success, error, warning, info)
- Clickable states
- Delete functionality (if needed in future)
- Avatar/icon support
- Theme integration
- Remove ~50 lines of custom SCSS

**Complexity:** Low-Medium  
**Estimated Effort:** 4-6 hours  
**Breaking Changes:** Minimal (color prop value changes)

**Recommendation:**
- Create `TagMui.tsx` wrapper for color mapping
- Quick win - good candidate for early migration
- Visual testing required for all tag locations

---

## Grid/Layout Analysis 📊

### CSS Grid Usage Assessment

**Finding:** The application uses native CSS Grid (`display: grid`) in several SCSS files for complex layout patterns.

**Files Using CSS Grid:**
- `booking.styles.scss` - Booking event layouts
- `messageSubmitInterface.styles.scss` - Message input layouts
- `tools.styles.scss` - Tool panel layouts
- `twoFactorAuth.styles.scss` - Auth form layouts
- `walkthrough.styles.scss` - Walkthrough overlays

**MUI Grid vs CSS Grid:**

| Feature | MUI Grid | CSS Grid |
|---------|----------|----------|
| Purpose | Responsive column-based layouts | Complex 2D layouts |
| Use Case | 12-column responsive grids | Custom grid templates |
| Flexibility | Limited to columns | Full grid control |
| Learning Curve | Easy (Bootstrap-like) | Medium |

**Recommendation: ❌ DO NOT replace CSS Grid with MUI Grid**

**Rationale:**
1. **Different purposes:** MUI Grid is for responsive column layouts (like Bootstrap), while CSS Grid is for complex 2D layouts
2. **Current usage is appropriate:** The CSS Grid usage in the codebase is for complex layouts that require specific grid-template-areas, grid-template-columns, etc.
3. **MUI Grid limitations:** MUI Grid cannot replicate the flexibility of CSS Grid
4. **No benefit:** Replacing would require more code and reduce flexibility
5. **Performance:** Native CSS Grid is more performant than component-based grids

**CSS Grid Examples in Codebase:**
```scss
// messageSubmitInterface.styles.scss - Complex chat layout
.messageSubmitInterface__wrapper {
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-gap: 8px;
  // This cannot be easily replicated with MUI Grid
}

// booking.styles.scss - Event card layout
.bookingEvents__actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 16px;
  // MUI Grid would be less flexible here
}
```

**When to use MUI Grid:**
- Simple responsive column layouts (e.g., 3 cards in a row, 2 on tablet, 1 on mobile)
- Dashboard-style layouts
- Form field arrangements

**When to keep CSS Grid:**
- Complex grid templates with named areas
- Precise control over row and column sizing
- Non-standard grid patterns
- The current usage in the codebase ✅

### MUI Grid Opportunities

While CSS Grid should remain, there are a few places where MUI Grid could improve responsive layouts:

1. **Profile page sections** - Could use MUI Grid for responsive column layouts
2. **Dashboard cards** - If dashboard exists, MUI Grid for card arrangements
3. **Form field columns** - Side-by-side fields on desktop, stacked on mobile

**Recommendation:** Evaluate these on a case-by-case basis, but current CSS Grid usage is optimal.

---

## Migration Priority Recommendations

### Phase 1: Quick Wins (Low Complexity, High Value)
1. ✅ **Tag → MUI Chip** (4-6 hours)
   - Low complexity, visual improvement
   - Limited usage, easy to test
   
2. ✅ **Box → MUI Alert/Box** (2-3 hours)
   - Low complexity, better semantics
   - Limited usage in bookings module

### Phase 2: High Impact (Medium Complexity)
3. ✅ **Headline → MUI Typography** (6-8 hours)
   - Medium complexity, widespread use
   - Better theme integration
   - Prerequisites: None

### Phase 3: Major Components (High Complexity)
4. ⚠️ **Text → MUI Typography** (8-12 hours)
   - High complexity, most widely used
   - Requires careful migration strategy
   - Prerequisites: Testing infrastructure

5. ⚠️ **InputField → MUI TextField** (10-14 hours)
   - High complexity, critical forms
   - Requires extensive testing
   - Prerequisites: Form testing suite
   - **Risk:** Affects login/registration flows

### Phase 4: Grid (No Action Required)
6. ✅ **CSS Grid** - Keep as-is
   - No migration needed
   - Current implementation is optimal

---

## Implementation Strategy

### Backward Compatibility Approach

For each migration, maintain backward compatibility:

```tsx
// Example: TagMui.tsx wrapper
import { Chip } from '@mui/material';

const colorMap = {
  'yellow': 'warning',
  'green': 'success',
  'red': 'error'
} as const;

export const Tag = ({ color, text, link, className }: TagProps) => {
  return (
    <Chip
      label={text}
      color={colorMap[color]}
      component={link ? Link : 'span'}
      to={link}
      clickable={!!link}
      className={className}
      size="small"
    />
  );
};
```

### Testing Strategy

For each migration:
1. **Unit tests** - Component props and rendering
2. **Visual regression tests** - Screenshot comparison
3. **Integration tests** - User flows (especially forms)
4. **Accessibility tests** - ARIA attributes, keyboard navigation
5. **Browser testing** - Cross-browser compatibility

### Rollout Strategy

1. **Create MUI variant** (e.g., `BoxMui.tsx`)
2. **Test in isolation** - Storybook/component tests
3. **Parallel implementation** - Keep both versions
4. **Gradual migration** - Update imports file-by-file
5. **Monitor** - Check for issues in production
6. **Cleanup** - Remove old component after full migration

---

## Estimated Total Effort

| Component | Effort | Priority | Risk |
|-----------|--------|----------|------|
| Tag → Chip | 4-6h | High | Low |
| Box → Alert/Box | 2-3h | High | Low |
| Headline → Typography | 6-8h | Medium | Low |
| Text → Typography | 8-12h | Medium | Medium |
| InputField → TextField | 10-14h | Low | High |
| **Total** | **30-43h** | | |

---

## Security Considerations

### Password Fields (InputField Migration)
- Ensure password toggle functionality is preserved
- Verify autocomplete settings are maintained
- Test password managers compatibility
- Check validation state visibility doesn't leak information

### XSS Prevention
- All components use `dangerouslySetInnerHTML` - ensure MUI equivalents sanitize properly
- Verify Text and Headline migrations maintain XSS protection
- Review all user-generated content rendering

---

## Breaking Changes Assessment

### None Expected ✅

All migrations can be done with backward compatibility wrappers:
- Keep existing prop interfaces
- Map old props to new MUI props
- Maintain old component names
- Update imports gradually

### If Breaking Changes Are Accepted

If team accepts breaking changes for cleaner code:
- Remove prop mapping wrappers
- Use MUI prop conventions directly
- Update all usages at once
- Update TypeScript interfaces

---

## Benefits Summary

### Code Quality
- ✅ Remove ~380 lines of custom SCSS
- ✅ Reduce maintenance burden
- ✅ Better TypeScript integration
- ✅ Improved theme consistency

### User Experience
- ✅ Better accessibility (ARIA attributes)
- ✅ Consistent component behavior
- ✅ Improved keyboard navigation
- ✅ Better mobile responsiveness

### Developer Experience
- ✅ Standard MUI documentation available
- ✅ Better IDE autocomplete
- ✅ Easier onboarding for new developers
- ✅ Consistent API across components

### Performance
- ✅ Optimized MUI components
- ✅ Better tree-shaking
- ✅ Smaller bundle size (eliminate duplicate functionality)

---

## Risks and Mitigation

### Risk: Visual Regressions
**Mitigation:** 
- Visual regression testing with Cypress
- Screenshot comparison before/after
- Manual QA review

### Risk: Form Validation Breaks (InputField)
**Mitigation:**
- Extensive form testing
- Test all validation scenarios
- Gradual rollout (non-critical forms first)

### Risk: Performance Impact
**Mitigation:**
- Bundle size monitoring
- Performance testing before/after
- Lazy loading where appropriate

### Risk: Accessibility Regressions
**Mitigation:**
- Accessibility testing tools
- Keyboard navigation testing
- Screen reader testing

---

## Conclusion

The vi-saas-frontend application is already ~85% migrated to MUI, with most critical components completed. The remaining 5 custom components can be successfully migrated to MUI with the following approach:

1. **Start with quick wins:** Tag and Box (6-9 hours total)
2. **Move to medium complexity:** Headline (6-8 hours)
3. **Carefully approach complex components:** Text and InputField (18-26 hours)
4. **Keep CSS Grid as-is:** No action needed

**CSS Grid Usage:** ✅ Current implementation is optimal and should NOT be replaced with MUI Grid.

**Total Estimated Effort:** 30-43 hours

**Recommended Next Steps:**
1. Review and approve this migration plan
2. Start with Tag → MUI Chip migration (quick win)
3. Validate approach with stakeholders
4. Proceed with remaining components based on priority
5. Maintain backward compatibility throughout

---

## Appendix: Component Usage Matrix

| Component | Files Using | Critical Paths | Test Coverage |
|-----------|-------------|----------------|---------------|
| Box | 5 | Bookings | Low |
| Text | 200+ | All pages | Medium |
| Headline | 100+ | All pages | Medium |
| InputField | 50+ | Login, Registration, Forms | High |
| Tag | 30+ | Session lists | Low |

---

**Document Version:** 1.0  
**Date:** 2026-02-19  
**Status:** Ready for Review
