# SCSS Deprecation Warnings - Status and Plan

## Summary

This document tracks SCSS deprecation warnings and their resolution status.

## Current Status

### ✅ FIXED - Color Functions (0 warnings)

**Issue:** `darken()` and `lighten()` functions are deprecated in Dart Sass.

**Solution:** Migrated to `color.scale()` from the `sass:color` module.

**Files Fixed:**

- `src/extensions/resources/styles/_variables.scss`
    - `darken($primary, 10%)` → `color.scale($primary, $lightness: -10%)`
- `src/components/button/button.styles.scss`
    - `darken($form-success, 5%)` → `color.scale($form-success, $lightness: -5%)`
    - `darken($form-error, 8%)` → `color.scale($form-error, $lightness: -8%)`
    - `darken($button-small-icon-alternate-background-color, 7%)` → `color.scale($button-small-icon-alternate-background-color, $lightness: -7%)`

**Status:** ✅ **COMPLETE** - All color function warnings resolved.

---

### ⏸️ SUPPRESSED - @import Deprecation (~23 warnings)

**Issue:** `@import` rules are deprecated and will be removed in Dart Sass 3.0.0. Should migrate to `@use` and `@forward`.

**Current Approach:** Warnings are suppressed via `silenceDeprecations: ['import']` in `vite.config.ts`.

**Why Suppressed:**
Migrating from `@import` to `@use` is a **major refactoring** that affects:

- 142+ SCSS files
- Variable scoping and namespacing
- Mixin and function access patterns
- Global variable sharing strategy

**Migration Effort:**

- **Estimated Time:** 2-3 weeks
- **Risk:** High - potential for visual regressions
- **Testing Required:** Comprehensive visual testing of entire app

**Migration Plan (Future Work):**

1. **Phase 1: Setup** (2-3 days)
    - Research best practices for @use migration
    - Create migration strategy document
    - Set up visual regression testing

2. **Phase 2: Core Files** (3-5 days)
    - Convert `settings.scss` to use `@forward` for variables
    - Update all variable references to use namespaces
    - Test basic styles

3. **Phase 3: Component Files** (5-7 days)
    - Convert component SCSS files from `@import` to `@use`
    - Update mixin usage to use namespaces
    - Test each component

4. **Phase 4: Testing & Fixes** (3-5 days)
    - Comprehensive visual testing
    - Fix any regressions
    - Performance testing

**Resources:**

- [Sass @use documentation](https://sass-lang.com/documentation/at-rules/use)
- [Sass @forward documentation](https://sass-lang.com/documentation/at-rules/forward)
- [Migrator tool](https://sass-lang.com/documentation/cli/migrator)

**Status:** ⏸️ **SUPPRESSED** - Planned for future dedicated effort.

---

### ✅ SUPPRESSED - Dependency Warnings (0 visible)

**Issues from Dependencies:**

- `global-builtin` warnings from `breakpoint-sass` dependency
- `if-function` warnings from `breakpoint-sass` dependency

**Solution:** These are automatically suppressed by using `api: 'modern-compiler'` in Vite config.

**Why This Works:**
The modern Sass compiler API handles these deprecations from dependencies more gracefully and doesn't emit warnings for code we don't control.

**Alternative Solutions:**

1. Update to a newer version of `breakpoint-sass` (if available)
2. Replace `breakpoint-sass` with modern CSS media queries or a newer library
3. Fork and update `breakpoint-sass` ourselves

**Status:** ✅ **RESOLVED** - Handled by modern compiler API.

---

## Build Status

### Current Warnings

```bash
npm run build 2>&1 | grep "DEPRECATION WARNING" | wc -l
# Result: 0 visible warnings (all suppressed appropriately)
```

### What's Suppressed

- **@import warnings:** 23 instances (our code + settings.scss)
    - Suppressed via `silenceDeprecations: ['import']`
    - Properly documented above

### What's Fixed

- **color-functions:** 0 warnings (all fixed with `color.scale()`)
- **global-builtin:** 0 warnings (handled by modern compiler)
- **if-function:** 0 warnings (handled by modern compiler)

---

## Recommendations

### Immediate (Current PR)

✅ Fix color functions → **DONE**
✅ Document @import deprecation → **DONE**
✅ Suppress @import warnings → **DONE**

### Short Term (Next 1-2 months)

- Monitor Dart Sass release schedule for Sass 3.0
- Evaluate effort vs benefit of @use migration
- Consider updating or replacing `breakpoint-sass`

### Long Term (Before Sass 3.0 Release)

- Complete @use/@forward migration
- Update all SCSS to modern patterns
- Consider migrating to CSS Modules or CSS-in-JS if appropriate

---

## Testing Strategy for Future @import Migration

When migrating from @import to @use:

1. **Visual Regression Testing**
    - Screenshot all pages before migration
    - Compare after each conversion step
    - Use tools like Percy, Chromatic, or BackstopJS

2. **Component Testing**
    - Test each component in isolation
    - Verify all theme variations
    - Check responsive breakpoints

3. **Browser Testing**
    - Test in Chrome, Firefox, Safari, Edge
    - Test on mobile devices (iOS, Android)

4. **Performance Testing**
    - Measure CSS bundle size before/after
    - Check build time impact
    - Verify no runtime performance degradation

---

## References

- [Sass Breaking Changes](https://sass-lang.com/documentation/breaking-changes)
- [Dart Sass Roadmap](https://github.com/sass/dart-sass/blob/main/CHANGELOG.md)
- [Sass Module System](https://sass-lang.com/blog/the-module-system-is-launched)
- [Color Module Migration](https://sass-lang.com/documentation/breaking-changes/color-functions)

---

Last Updated: 2026-02-14
