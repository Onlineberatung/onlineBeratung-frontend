# Top 5 Components Migration Strategy

## Overview

This document provides a comprehensive strategy for migrating the top 5 identified components to MUI, following the established design philosophy of minimal custom styling with theme variable integration.

## Components to Migrate

1. **Card** → MUI Card (LOW COMPLEXITY)
2. **ProgressBar** → MUI LinearProgress (LOW COMPLEXITY)
3. **Banner** → MUI Alert/Snackbar (MEDIUM COMPLEXITY)
4. **Button** → MUI Button (HIGH COMPLEXITY)
5. **Overlay** → MUI Dialog (VERY HIGH COMPLEXITY)

---

## Current Implementation Analysis

### 1. Card Component

**Current Implementation:**
- File: `src/components/card/index.tsx` (28 lines)
- Simple wrapper component
- Sub-components: Header, Content, Footer
- Minimal custom styling
- Used for content containers

**Complexity:** LOW
**Estimated Time:** 1-2 hours

**Migration Approach:**
- Use MUI Card as base
- MUI CardHeader for header
- MUI CardContent for content
- MUI CardActions for footer
- Maintain sub-component API (Card.Header, Card.Content, Card.Footer)
- Minimal theme styling (background, borders)

### 2. ProgressBar Component

**Current Implementation:**
- File: `src/components/progressbar/ProgressBar.tsx` (35 lines)
- Shows progress with percentage calculation
- States: progress, finish
- Optional percent display
- Custom CSS progress bar

**Complexity:** LOW
**Estimated Time:** 1-2 hours

**Migration Approach:**
- Use MUI LinearProgress
- Determinate variant with value prop
- Color: primary for progress, success for finish
- Optional text overlay for percentage
- Theme color via CSS var

### 3. Banner Component

**Current Implementation:**
- File: `src/components/banner/Banner.tsx` (102 lines)
- Uses createPortal for rendering
- Affects stage/stageLayout padding
- Close button with SVG icon
- Complex positioning logic

**Complexity:** MEDIUM
**Estimated Time:** 3-4 hours

**Migration Approach:**
- Use MUI Alert or Snackbar
- Maintain portal rendering pattern
- Keep layout adjustment logic
- Close button with MUI IconButton
- Theme colors for different alert types

### 4. Button Component

**Current Implementation:**
- File: `src/components/button/Button.tsx` (200+ lines)
- 7 button types: PRIMARY, SECONDARY, TERTIARY, LINK, LINK_INLINE, AUTO_CLOSE, SMALL_ICON
- Complex ButtonItem interface
- Icon support
- Reload animation
- Used extensively throughout app (50+ locations)

**Complexity:** HIGH
**Estimated Time:** 4-6 hours

**Migration Approach:**
- Use MUI Button as base
- Map button types to MUI variants:
  - PRIMARY → contained
  - SECONDARY → outlined
  - TERTIARY → text
  - LINK → text with link styling
- Maintain ButtonItem interface for backward compatibility
- Icon support via startIcon/endIcon
- Theme colors via CSS vars

### 5. Overlay Component

**Current Implementation:**
- File: `src/components/overlay/Overlay.tsx` (300+ lines)
- Complex overlay system with multiple types
- Button sets
- Nested components
- Illustrations
- Focus trap
- Portal rendering
- Loading states

**Complexity:** VERY HIGH
**Estimated Time:** 6-8 hours

**Migration Approach:**
- Use MUI Dialog as base
- Maintain OverlayItem interface
- DialogTitle for headline
- DialogContent for copy/nested components
- DialogActions for button set
- Keep focus trap behavior
- Theme styling for variants

---

## Theme Integration Guidelines

### Colors to Use

**From Theme Variables:**
- Primary: `var(--skin-color-primary, $primary)` - Respects tenant theming
- Secondary: `$secondary`
- Text: `$form-secondary` (rgba(0,0,0,0.9))
- Text low emphasis: `$text-low-emphasis` (rgba(0,0,0,0.6))
- Background: `$white` (#fff)
- Border default: `$border-default` (rgba(0,0,0,0.2))
- Border hover: `$border-hover` (rgba(0,0,0,0.9))
- Error: `$form-error` (#cc0000)
- Success: `$success-color` (green)
- Disabled: `$form-disabled` (rgba(0,0,0,0.05))

### MUI Standards to Keep

- Use MUI default structure and layout
- Use MUI default behavior (animations, transitions)
- Use MUI default accessibility features
- Use MUI default responsive behavior
- Keep MUI elevation system
- Keep MUI ripple effects

### Custom Styling Approach

**DO:**
- Apply theme colors to MUI components
- Use CSS variables for primary color
- Match app theme appearance
- Minimal SCSS files for colors only

**DON'T:**
- Override MUI structure
- Custom animations
- Complex layout changes
- Non-theme colors
- Excessive custom CSS

---

## Recommended Migration Order

### Phase 1: Quick Wins (2-4 hours)

**1.1 Card → MUI Card**
- Simplest component
- Low risk
- Easy to test

**1.2 ProgressBar → MUI LinearProgress**
- Simple indicator
- Low risk
- Easy to test

**Benefits:**
- Build confidence
- Establish pattern
- Quick value

### Phase 2: Medium Complexity (3-4 hours)

**2.1 Banner → MUI Alert/Snackbar**
- Portal logic preserved
- Layout adjustments maintained
- Thorough testing required

**Benefits:**
- Better notifications
- Standard alert types
- Improved UX

### Phase 3: High Complexity (10-14 hours)

**3.1 Button → MUI Button**
- Map 7 types to MUI variants
- Maintain ButtonItem interface
- Comprehensive testing (50+ locations)
- Gradual rollout recommended

**3.2 Overlay → MUI Dialog**
- Complex logic migration
- Multiple overlay types
- Extensive testing required
- Staged implementation

**Benefits:**
- Standard components
- Better accessibility
- Easier maintenance

---

## Risk Assessment

### Low Risk Components

**Card, ProgressBar:**
- Simple components
- Limited usage scope
- Easy to test and verify
- Quick rollback if needed

### Medium Risk Components

**Banner:**
- Portal logic complexity
- Layout side effects
- Moderate testing required
- Clear test scenarios

### High Risk Components

**Button:**
- Extensive usage (50+ locations)
- Multiple variants
- Critical UI element
- Comprehensive testing required
- Consider gradual rollout

**Overlay:**
- Complex logic
- Multiple types
- Business-critical dialogs
- Extensive testing required
- Phased implementation recommended

---

## Testing Strategy

### Per Component Testing

**Card:**
- Render with Header, Content, Footer
- Verify theme styling
- Test in various contexts

**ProgressBar:**
- Test progress states
- Test finish state
- Verify percentage display
- Test theme colors

**Banner:**
- Test portal rendering
- Verify layout adjustments
- Test close functionality
- Check stage padding

**Button:**
- Test all 7 types
- Verify icon support
- Test disabled states
- Check all usage locations

**Overlay:**
- Test all overlay types
- Verify button sets
- Test nested components
- Check focus trap
- Verify illustrations

### Integration Testing

- Test component interactions
- Verify no regressions
- Check theme consistency
- Test accessibility

### Browser Testing

- Chrome, Firefox, Safari, Edge
- Mobile browsers
- Different screen sizes
- Dark/light themes

---

## Rollback Plan

### If Issues Arise

**Immediate:**
1. Revert specific component
2. Keep old implementation available
3. Fix issues in MUI version
4. Re-deploy when ready

**Per Component:**
- Each component has independent rollback
- Old files kept temporarily
- Quick revert possible
- No breaking changes

---

## Success Criteria

### Per Component

**Card:**
- ✅ Matches original appearance
- ✅ All sub-components work
- ✅ Theme colors applied
- ✅ Zero breaking changes

**ProgressBar:**
- ✅ Progress calculation correct
- ✅ Percentage display works
- ✅ Finish state works
- ✅ Theme colors applied

**Banner:**
- ✅ Portal rendering works
- ✅ Layout adjustments work
- ✅ Close button works
- ✅ No visual regressions

**Button:**
- ✅ All 7 types work
- ✅ Icons display correctly
- ✅ All locations tested
- ✅ Theme colors applied
- ✅ No functionality lost

**Overlay:**
- ✅ All overlay types work
- ✅ Button sets function
- ✅ Nested components render
- ✅ Focus trap works
- ✅ Theme applied

### Overall Success

- ✅ All components migrated
- ✅ Zero breaking changes
- ✅ Theme consistency maintained
- ✅ Better accessibility
- ✅ Code reduction achieved
- ✅ Comprehensive testing passed

---

## Next Steps

### Immediate Actions

1. **Start with Phase 1 (Card + ProgressBar)**
   - Lowest risk
   - Quick wins
   - Build confidence

2. **Create Component Branches**
   - Separate branch per component
   - Easy to test individually
   - Safe rollback

3. **Document Progress**
   - Track what's done
   - Note any issues
   - Share learnings

### Implementation Order

1. ✅ Card (Day 1, 1-2 hours)
2. ✅ ProgressBar (Day 1, 1-2 hours)
3. ⏸️ Banner (Day 2, 3-4 hours)
4. ⏸️ Button (Day 3-4, 4-6 hours)
5. ⏸️ Overlay (Day 5-6, 6-8 hours)

### Review Points

- After each component migration
- Before moving to next phase
- Final review after all complete

---

## Conclusion

This migration strategy provides a clear, phased approach to migrating the top 5 components to MUI. Starting with simple components (Card, ProgressBar) builds confidence and establishes patterns, while more complex components (Button, Overlay) receive the appropriate level of planning and testing.

The key to success is:
1. **Follow the phases** - Don't skip ahead
2. **Test thoroughly** - Each component independently
3. **Maintain theme** - Consistent appearance
4. **Zero breaking changes** - Backward compatibility
5. **MUI standards** - Let MUI handle complexity

**Ready to Begin:** Phase 1 (Card + ProgressBar) can start immediately with low risk and high confidence of success.
