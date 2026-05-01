# COMPONENT RESPONSIVE MATRIX
## Visual Alignment & Breakpoint Behavior

**Date:** April 30, 2026  
**Purpose:** Quick reference for component responsive behavior across breakpoints

---

## BREAKPOINT REFERENCE

```
Mobile:  < 640px   (default)
SM:      640px+    (small tablets, large phones landscape)
MD:      768px+    (tablets portrait)
LG:      1024px+   (tablets landscape, small laptops)
XL:      1280px+   (desktops)
2XL:     1536px+   (large desktops)
```

---

## LAYOUT COMPONENTS

### Navigation
| Breakpoint | Structure | Padding | Menu | Custom Cursor |
|------------|-----------|---------|------|---------------|
| Mobile     | Logo + Hamburger | `px-4` (16px) | Full-screen overlay | ❌ Disabled |
| SM         | Logo + Hamburger | `px-6` (24px) | Full-screen overlay | ❌ Disabled |
| MD         | Logo + Hamburger | `px-10` (40px) | Full-screen overlay | ❌ Disabled |
| LG         | Logo + Hamburger + "Menu" | `px-16` (64px) | Full-screen overlay | ✅ Enabled |

**Touch Targets:** 44x44px minimum  
**Accessibility:** Skip link, ARIA labels, focus trap, Escape key

---

### Footer (Full Mode)
| Breakpoint | CTA Title | Email | Social Icons | Height |
|------------|-----------|-------|--------------|--------|
| Mobile     | `text-4xl` (36px) | `text-xl` (20px) | Stacked | `min-h-[70vh]` |
| SM         | `text-5xl` (48px) | `text-xl` (20px) | Horizontal | `min-h-[70vh]` |
| MD         | `text-7xl` (72px) | `text-2xl` (24px) | Horizontal | `min-h-[70vh]` |
| LG         | `text-9xl` (128px) | `text-3xl` (30px) | Horizontal | `min-h-screen` |

**Minimal Mode:** Single row with copyright + legal links + version

---

### PageWrapper
| Breakpoint | Background | Blueprint Markers | Animation Duration |
|------------|------------|-------------------|-------------------|
| Mobile     | `opacity-[0.25]` | 12px | 0.6s (0.01s reduced) |
| MD         | `opacity-[0.25]` | 16px | 0.6s (0.01s reduced) |
| LG         | `opacity-[0.25]` | 16px | 0.6s (0.01s reduced) |

**Reduced Motion:** Respects `prefers-reduced-motion` system preference

---

## HOME PAGE SECTIONS

### HeroSection
| Breakpoint | Title Font | Subtitle | Video | Button |
|------------|------------|----------|-------|--------|
| Mobile     | `clamp(44px, 11vw, 160px)` → ~44-66px | `text-xs` (12px) | Static poster | Full width |
| SM         | ~66-88px | `text-sm` (14px) | Reduced quality | Auto width |
| MD         | ~88-110px | `text-sm` (14px) | Reduced quality | Auto width |
| LG         | ~110-160px | `text-sm` (14px) | Full quality | Auto width |

**Video System:**
- 7 clips × 6s each = 2.4MB total
- A/B player crossfade every 4s
- WebM/VP9 primary + MP4/H.264 fallback

---

### ManifestoSection
| Breakpoint | Font Size | Parallax | Word Reveal |
|------------|-----------|----------|-------------|
| Mobile     | `clamp(28px, 8vw, 84px)` → ~28-48px | ❌ Disabled | ✅ Enabled |
| SM         | ~48-56px | ⚠️ Reduced | ✅ Enabled |
| MD         | ~56-66px | ⚠️ Reduced | ✅ Enabled |
| LG         | ~66-84px | ✅ Full | ✅ Enabled |

**Animation:** GSAP ScrollTrigger word-by-word opacity fade (0.2 → 1.0)

---

### VideoScrollSection
| Breakpoint | Section Height | Navigation | Progress |
|------------|----------------|------------|----------|
| Mobile     | `${VIDEOS.length * 40}vh` | Swipe gestures | Dot navigation |
| SM         | `${VIDEOS.length * 50}vh` | Scroll-based | Dot navigation |
| MD         | `${VIDEOS.length * 50}vh` | Scroll-based | Dot + progress bar |
| LG         | `${VIDEOS.length * 60}vh` | Scroll-based | Dot + progress bar |

**Video Loading:** Lazy loading (only active video loads)  
**Total Size:** 7 videos × 30s each = ~10MB (lazy loaded)

---

### ServicesSection
| Breakpoint | Grid Layout | Card Hover | Icon Size |
|------------|-------------|------------|-----------|
| Mobile     | 1 column | Tap (no hover) | 36px |
| SM         | 1 column | Tap (no hover) | 36px |
| MD         | 2 columns | Reduced animation | 40px |
| LG         | 3 columns | Scale + glow | 48px |

**Touch Feedback:** Background color change on tap

---

## PORTFOLIO PAGE

### Tab Navigation
| Breakpoint | Layout | Tab Width | Active Indicator | Scroll |
|------------|--------|-----------|------------------|--------|
| Mobile     | Horizontal scroll | `min-w-max` | Simplified | `overflow-x-auto` |
| SM         | Horizontal scroll | `min-w-max` | Animated underline | `overflow-x-auto` |
| MD         | Horizontal scroll | `min-w-max` | Animated underline | If needed |
| LG         | Horizontal row | Auto | Animated underline | None |

**Animation:** Framer Motion `layoutId="tabUnderline"` for smooth transition

---

### Project Row
| Breakpoint | Structure | Gallery Grid | Image Modal |
|------------|-----------|--------------|-------------|
| Mobile     | Simplified row | 1 column | Full-screen |
| SM         | Collapsed row | 1 column | Full-screen |
| MD         | Collapsed row | 2 columns | 90vw × 90vh |
| LG         | Collapsed row + hover | 3-4 columns | 90vw × 90vh |

**Touch Targets:** 56px buttons on mobile

---

## ABOUT PAGE SECTIONS

### AboutHeroSection
| Breakpoint | Title Font | Grid Layout | Portrait Height |
|------------|------------|-------------|-----------------|
| Mobile     | `clamp(44px, 10vw, 140px)` → ~44-66px | Single column | N/A |
| SM         | ~66-88px | Single column | N/A |
| MD         | ~88-110px | 2 columns | N/A |
| LG         | ~110-140px | 2 columns | N/A |

**Background:** Parallax image (disabled on mobile)

---

### AboutIdentityBioSection
| Breakpoint | Grid Layout | Image Size | Title Font |
|------------|-------------|------------|------------|
| Mobile     | Single column (image above) | Full width | `text-5xl` (48px) |
| SM         | Single column | Full width | `text-6xl` (60px) |
| MD         | Single column | Full width | `text-8xl` (96px) |
| LG         | 2 columns (6+6) | 50% width | `text-8xl` (96px) |

**Image:** Parallax effect on desktop only

---

### AboutDisciplinesSection
| Breakpoint | Image Layout | Disciplines Grid | Mindset Grid |
|------------|--------------|------------------|--------------|
| Mobile     | Horizontal snap-scroll (72vw) | Single column | Single column |
| SM         | Horizontal scroll (55vw) | Single column | Single column |
| MD         | Horizontal scroll (55vw) | 2 columns | 2 columns |
| LG         | 3-column grid | Full width rows | 2 columns |

**Scroll:** `scroll-smooth snap-x snap-mandatory no-scrollbar`

---

### AboutFormationSection
| Breakpoint | Timeline Layout | Font Size | Spacing |
|------------|-----------------|-----------|---------|
| Mobile     | Vertical | `text-xs` (12px) | `py-7` |
| SM         | Vertical | `text-xs` (12px) | `py-7` |
| MD         | Vertical | `text-xs` (12px) | `py-7` |
| LG         | Vertical | `text-xs` (12px) | `py-7` |

**Grid:** 12-column grid (3+9 on mobile, 2+10 on desktop)

---

## CONTACT PAGE

### Contact Form
| Breakpoint | Grid Layout | Input Height | Input Font | Portrait |
|------------|-------------|--------------|------------|----------|
| Mobile     | Single column | `min-h-11` (44px) | 16px | Below form, `h-[60vh]` |
| SM         | Single column | `min-h-11` (44px) | 16px | Below form, `h-[60vh]` |
| MD         | Single column | `min-h-11` (44px) | 16px | Below form, `h-[60vh]` |
| LG         | 7+5 columns | `min-h-11` (44px) | 16px | Sticky right, `h-[75vh]` |

**iOS Optimization:** 16px font prevents zoom on focus  
**Validation:** Zod schema with accessible error messages

---

## LEGAL PAGES

### Privacy, Terms, Cookies
| Breakpoint | Container | Heading | Body | Line Height |
|------------|-----------|---------|------|-------------|
| Mobile     | `max-w-4xl` (896px) | `text-5xl` (48px) | `text-sm` (14px) | `leading-relaxed` (1.625) |
| SM         | `max-w-4xl` (896px) | `text-5xl` (48px) | `text-sm` (14px) | `leading-relaxed` (1.625) |
| MD         | `max-w-4xl` (896px) | `text-7xl` (72px) | `text-sm` (14px) | `leading-relaxed` (1.625) |
| LG         | `max-w-4xl` (896px) | `text-7xl` (72px) | `text-sm` (14px) | `leading-relaxed` (1.625) |

**Consistency:** 100% identical structure across all three pages

---

## SHARED COMPONENTS

### CustomCursor
| Breakpoint | Status | Cursor Dot | Cursor Follower | Hover Scale |
|------------|--------|------------|-----------------|-------------|
| Mobile     | ❌ Disabled | N/A | N/A | N/A |
| SM         | ❌ Disabled | N/A | N/A | N/A |
| MD         | ❌ Disabled | N/A | N/A | N/A |
| LG         | ✅ Enabled | 12px white | 40px border | 3x dot, 1.5x follower |

**Performance:** GPU-accelerated `transform`, `requestAnimationFrame`

---

### LoadingScreen
| Breakpoint | Position | Animation | Duration |
|------------|----------|-----------|----------|
| All        | Fixed, full viewport | Fade out | 0.8s |

**Z-index:** 9999 (above all content)

---

### ImageModal
| Breakpoint | Size | Navigation | Close Button |
|------------|------|------------|--------------|
| Mobile     | Full screen (100vw × 100vh) | Swipe to close | 56px (top-right) |
| SM         | Full screen | Swipe to close | 56px (top-right) |
| MD         | 90vw × 90vh | Click outside | 44px (top-right) |
| LG         | 90vw × 90vh | Arrow keys + click outside | 44px (top-right) |

**Accessibility:** Focus trap, Escape key, ARIA `role="dialog"`

---

## TYPOGRAPHY SCALE

### Heading Scale
| Class | Size | Usage |
|-------|------|-------|
| `text-9xl` | 128px | Hero titles (desktop) |
| `text-8xl` | 96px | Large headings |
| `text-7xl` | 72px | Section headings |
| `text-6xl` | 60px | Subsection headings |
| `text-5xl` | 48px | Mobile hero |
| `text-4xl` | 36px | Mobile large |
| `text-3xl` | 30px | Medium headings |
| `text-2xl` | 24px | Small headings |
| `text-xl` | 20px | Body large |

### Body Scale
| Class | Size | Usage |
|-------|------|-------|
| `text-base` | 16px | Standard body |
| `text-sm` | 14px | Small body, captions |
| `text-xs` | 12px | Labels, metadata |
| `text-[10px]` | 10px | Technical labels |
| `text-[9px]` | 9px | Micro labels |
| `text-[8px]` | 8px | Ultra-small labels |

---

## SPACING SCALE

### Padding (Horizontal)
| Token | Classes | Values |
|-------|---------|--------|
| `PADX.page` | `px-4 sm:px-6 md:px-10 lg:px-16` | 16→24→40→64px |
| `PADX.reduced` | `px-4 sm:px-6 md:px-10` | 16→24→40px |
| `PADX.minimal` | `px-4 sm:px-6` | 16→24px |

### Padding (Vertical)
| Token | Classes | Values |
|-------|---------|--------|
| `PADY.large` | `py-20 md:py-32` | 80→128px |
| `PADY.medium` | `py-16 md:py-24` | 64→96px |
| `PADY.small` | `py-12 md:py-16` | 48→64px |
| `PADY.header` | `pt-36 md:pt-48` | 144→192px |
| `PADY.footer` | `pb-24 md:pb-40` | 96→160px |

---

## CONTAINER SCALE

| Token | Class | Max Width | Usage |
|-------|-------|-----------|-------|
| `CONTAINER.full` | `max-w-[1400px]` | 1400px | Immersive sections |
| `CONTAINER.wide` | `max-w-7xl` | 1280px | Primary container |
| `CONTAINER.content` | `max-w-6xl` | 1152px | Standard content |
| `CONTAINER.narrow` | `max-w-4xl` | 896px | Reading pages |
| `CONTAINER.text` | `max-w-2xl` | 672px | Long-form text |

---

## GRID SYSTEM

### 12-Column Grid
| Breakpoint | Columns | Gap | Usage |
|------------|---------|-----|-------|
| Mobile     | 1 column | `gap-16` (64px) | Stack vertically |
| SM         | 1 column | `gap-16` (64px) | Stack vertically |
| MD         | 1 column | `gap-24` (96px) | Stack vertically |
| LG         | 12 columns | `gap-24` (96px) | 7+5 or 6+6 split |

**Common Patterns:**
- 7+5: Form + Portrait (Contact), Content + Sidebar (Portfolio)
- 6+6: Text + Image (About Identity)
- 3+9: Label + Content (About Formation)

---

## TOUCH OPTIMIZATION

### Touch Targets
| Element | Size | Status |
|---------|------|--------|
| Buttons | 44×44px minimum | ✅ WCAG 2.1 AA |
| Links | 44×44px minimum | ✅ WCAG 2.1 AA |
| Form inputs | 44px height | ✅ WCAG 2.1 AA |
| Tab navigation | 44px height | ✅ WCAG 2.1 AA |
| Dot navigation | 44×44px (8px visible) | ✅ WCAG 2.1 AA |

### Touch Gestures
| Gesture | Usage | Status |
|---------|-------|--------|
| Swipe horizontal | Video scroll navigation | ✅ Implemented |
| Swipe vertical | Page scroll | ✅ Native |
| Tap | Button/link activation | ✅ Implemented |
| Long press | Context menu (disabled) | ❌ Disabled |
| Pinch zoom | Image modal zoom | ⚠️ Not implemented |

---

## PERFORMANCE TARGETS

### Desktop (1024px+)
- **First Contentful Paint:** < 2.5s
- **Time to Interactive:** < 4s
- **Lighthouse Performance:** > 85
- **Lighthouse Accessibility:** > 95

### Mobile (< 640px)
- **First Contentful Paint:** < 5s
- **Time to Interactive:** < 8s
- **Lighthouse Performance:** > 60 (before optimization)
- **Lighthouse Accessibility:** > 95

---

## QUICK REFERENCE

### Most Common Patterns
```tsx
// Page container
<div className={`${CONTAINER.wide} ${CENTER} ${PADX.page} ${PADY.header} ${PADY.footer}`}>

// Section spacing
<section className={`${PADX.page} ${PADY.large}`}>

// 2-column grid (7+5)
<div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
  <div className="lg:col-span-7">
  <div className="lg:col-span-5">
</div>

// Fluid typography
<h1 style={{ fontSize: 'clamp(44px, 10vw, 140px)' }}>

// Touch target
<button className="min-h-11 min-w-11">
```

---

**Document Version:** 1.0  
**Last Updated:** April 30, 2026  
**Author:** Kiro AI Agent  
**Status:** Complete - Ready for Reference
