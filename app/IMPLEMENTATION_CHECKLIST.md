# IMPLEMENTATION CHECKLIST
## Amber Systems Portfolio - Action Items

**Date:** April 30, 2026  
**Purpose:** Prioritized checklist for implementing skeletal analysis recommendations  
**Timeline:** 3 weeks (High → Medium → Low priority)

---

## WEEK 1: HIGH PRIORITY (Critical)

### 1. Video Performance Optimization ⚠️
**Impact:** High - Affects mobile data usage and initial load time  
**Effort:** Medium (2-3 days)

- [ ] **Implement adaptive video quality**
  - Detect connection speed with `navigator.connection.effectiveType`
  - Serve lower quality videos on slow connections (3G, slow 4G)
  - Serve high quality videos on fast connections (4G, 5G, WiFi)
  
- [ ] **Add video poster fallback**
  - Create static poster images for all videos
  - Use `<video poster="...">` attribute
  - Show poster on slow connections with "Load video" button
  
- [ ] **Optimize hero video for mobile**
  - Consider replacing with animated gradient on mobile
  - Or use single static image with subtle animation
  - Reduce hero video size from 2.4MB to < 500KB
  
- [ ] **Lazy load scroll videos**
  - Already implemented ✅
  - Verify it's working correctly
  - Add preloading for next video (improve UX)

**Files:**
- `app/src/sections/HeroSection.tsx`
- `app/src/sections/VideoScrollSection.tsx`
- `app/src/hooks/useConnectionSpeed.ts` (create new)

---

### 2. Font Scaling Smoothness ⚠️
**Impact:** Medium - Affects tablet experience  
**Effort:** Low (1 day)

- [ ] **Audit all large headings**
  - Find all components with `text-4xl` → `text-8xl` jumps
  - List all `clamp()` values that need adjustment
  
- [ ] **Add intermediate breakpoint sizes**
  - Add `md:text-6xl` or `md:text-7xl` for tablet (768px)
  - Smooth out jumps with more granular `clamp()` values
  - Example: `clamp(44px, 8vw + 1rem, 160px)` instead of `clamp(44px, 11vw, 160px)`
  
- [ ] **Test on real tablet devices**
  - iPad (768px portrait, 1024px landscape)
  - Android tablet (various sizes)
  - Verify font sizes look good at all breakpoints

**Files:**
- `app/src/sections/HeroSection.tsx`
- `app/src/sections/ManifestoSection.tsx`
- `app/src/components/about/AboutHeroSection.tsx`
- `app/src/components/about/AboutIdentityBioSection.tsx`
- All section components with large headings

---

### 3. Horizontal Scroll Indicators ⚠️
**Impact:** Medium - Affects discoverability  
**Effort:** Low (1 day)

- [ ] **Portfolio tabs scroll indicator**
  - Add fade gradient on right edge when scrollable
  - Or add subtle arrow icon on right edge
  - Or add dots below tabs (like video scroll section)
  
- [ ] **About disciplines images scroll indicator**
  - Add fade gradient on right edge
  - Or add dots below images
  - Or add "Swipe to see more" text hint
  
- [ ] **Test on mobile devices**
  - Verify indicators appear when content is scrollable
  - Verify indicators disappear when at end of scroll
  - Test on iOS and Android

**Files:**
- `app/src/pages/Portfolio.tsx`
- `app/src/components/about/AboutDisciplinesSection.tsx`
- `app/src/components/ui/ScrollIndicator.tsx` (create new)

---

### 4. Image Optimization ⚠️
**Impact:** High - Affects page load time and bandwidth  
**Effort:** High (3-4 days)

- [ ] **Convert images to modern formats**
  - Convert all JPG/PNG to WebP
  - Create AVIF versions for modern browsers
  - Keep original JPG/PNG as fallback
  
- [ ] **Implement responsive images**
  - Create multiple sizes for each image (320w, 640w, 1024w, 1920w)
  - Use `<picture>` element with `srcset`
  - Example:
    ```tsx
    <picture>
      <source srcSet="/images/hero-320.avif 320w, /images/hero-640.avif 640w" type="image/avif" />
      <source srcSet="/images/hero-320.webp 320w, /images/hero-640.webp 640w" type="image/webp" />
      <img src="/images/hero-640.jpg" alt="..." loading="lazy" decoding="async" />
    </picture>
    ```
  
- [ ] **Add lazy loading**
  - Add `loading="lazy"` to all below-fold images
  - Add `decoding="async"` to all images
  - Keep hero images as `loading="eager"`
  
- [ ] **Create image optimization script**
  - Use Sharp or ImageMagick
  - Automate conversion and resizing
  - Add to build process

**Files:**
- All components with images
- `app/scripts/optimize-images.js` (create new)
- `app/src/components/ui/ResponsiveImage.tsx` (create new)

---

### 5. GSAP + Lenis Conflict Resolution ⚠️
**Impact:** Medium - Affects scroll smoothness  
**Effort:** Medium (2 days)

- [ ] **Configure GSAP ScrollTrigger for Lenis**
  - Add Lenis integration to ScrollTrigger
  - Example:
    ```tsx
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      }
    });
    ```
  
- [ ] **Test scroll animations**
  - Verify ManifestoSection word reveal works smoothly
  - Verify VideoScrollSection scroll-triggered switching works
  - Test on all browsers (Chrome, Firefox, Safari)
  
- [ ] **Alternative: Disable Lenis on mobile**
  - If conflict persists, disable Lenis on mobile devices
  - Use native scroll on mobile (better performance)
  - Keep Lenis on desktop only

**Files:**
- `app/src/pages/Home.tsx`
- `app/src/sections/ManifestoSection.tsx`
- `app/src/components/SmoothScroll.tsx`

---

## WEEK 2: MEDIUM PRIORITY (Important)

### 6. Touch Feedback States ⚠️
**Impact:** Medium - Affects mobile UX  
**Effort:** Low (1 day)

- [ ] **Add `:active` states to all interactive elements**
  - Buttons: Background color change or scale
  - Links: Underline or color change
  - Cards: Background color change or scale
  - Example:
    ```css
    .button:active {
      background-color: rgba(255, 176, 0, 0.2);
      transform: scale(0.98);
    }
    ```
  
- [ ] **Test on mobile devices**
  - Verify feedback is visible and responsive
  - Test on iOS and Android
  - Ensure no conflicts with hover states

**Files:**
- All components with interactive elements
- `app/src/index.css` (global active states)

---

### 7. Parallax Performance ⚠️
**Impact:** Low - Affects visual richness on mobile  
**Effort:** Medium (2 days)

- [ ] **Implement lightweight CSS-only parallax**
  - Use `transform: translateZ()` for 3D parallax
  - Or use `background-attachment: fixed` for simple parallax
  - Example:
    ```css
    .parallax {
      transform: translateZ(-1px) scale(2);
    }
    ```
  
- [ ] **Test performance on mobile**
  - Verify no jank or lag
  - Test on low-end devices
  - Disable if performance is poor

**Files:**
- `app/src/components/ui/ParallaxImage.tsx`

---

### 8. Form Backend Integration ⚠️
**Impact:** High - Form doesn't work without it  
**Effort:** Medium (2 days)

- [ ] **Choose email service**
  - SendGrid (recommended)
  - Resend
  - Nodemailer + SMTP
  
- [ ] **Create API endpoint**
  - `/api/contact` POST endpoint
  - Validate form data with Zod
  - Send email with chosen service
  - Return success/error response
  
- [ ] **Update Contact page**
  - Replace simulated submission with real API call
  - Handle loading state
  - Handle success/error states
  - Add rate limiting (prevent spam)

**Files:**
- `app/src/pages/Contact.tsx`
- `app/api/contact.ts` (create new)
- `.env.local` (add API keys)

---

### 9. Accessibility Testing ⚠️
**Impact:** High - Ensures inclusive experience  
**Effort:** Medium (2-3 days)

- [ ] **Screen reader testing (NVDA - Windows)**
  - Test all pages with NVDA
  - Verify all content is readable
  - Verify all interactive elements are accessible
  - Fix any issues found
  
- [ ] **Screen reader testing (JAWS - Windows)**
  - Test all pages with JAWS
  - Verify all content is readable
  - Verify all interactive elements are accessible
  - Fix any issues found
  
- [ ] **Screen reader testing (VoiceOver - Mac/iOS)**
  - Test all pages with VoiceOver
  - Verify all content is readable
  - Verify all interactive elements are accessible
  - Fix any issues found
  
- [ ] **Keyboard navigation testing**
  - Test all pages with keyboard only (no mouse)
  - Verify all interactive elements are accessible via Tab
  - Verify focus order is logical
  - Verify Escape key closes modals
  
- [ ] **Color contrast testing**
  - Use WebAIM Contrast Checker
  - Verify all text meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
  - Fix any issues found
  
- [ ] **Touch target size testing**
  - Verify all interactive elements are 44×44px minimum
  - Test on real mobile devices
  - Fix any issues found

**Files:**
- All pages and components
- Document findings in `app/ACCESSIBILITY_AUDIT.md` (create new)

---

### 10. Code Splitting Optimization ⚠️
**Impact:** Medium - Affects initial bundle size  
**Effort:** Medium (2 days)

- [ ] **Lazy load Radix UI components**
  - Use `React.lazy()` for Radix UI components
  - Example:
    ```tsx
    const Dialog = React.lazy(() => import('@radix-ui/react-dialog'));
    ```
  
- [ ] **Split vendor bundles**
  - Configure Vite to split vendor bundles
  - Separate React, Framer Motion, GSAP into separate chunks
  - Example:
    ```ts
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'animation-vendor': ['framer-motion', 'gsap'],
          }
        }
      }
    }
    ```
  
- [ ] **Analyze bundle size**
  - Use `vite-bundle-visualizer`
  - Identify large chunks
  - Optimize or lazy load

**Files:**
- `app/vite.config.ts`
- All components using Radix UI

---

## WEEK 3: LOW PRIORITY (Nice to Have)

### 11. Custom Cursor Fallback ⚠️
**Impact:** Low - Edge case  
**Effort:** Low (1 day)

- [ ] **Add CSS fallback**
  - Add `cursor: pointer` to interactive elements
  - Only hide cursor when JavaScript is enabled
  - Example:
    ```css
    .no-js body {
      cursor: auto !important;
    }
    ```

**Files:**
- `app/src/components/CustomCursor.tsx`
- `app/index.html` (add `no-js` class)

---

### 12. Loading Screen Optimization ⚠️
**Impact:** Low - Minor visual distraction  
**Effort:** Low (1 day)

- [ ] **Add minimum display time**
  - Show loading screen for at least 500ms
  - Prevents flash on fast connections
  - Example:
    ```tsx
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => setMinTimeElapsed(true), 500);
      return () => clearTimeout(timer);
    }, []);
    ```

**Files:**
- `app/src/components/LoadingScreen.tsx`

---

### 13. Consolidate Animation Libraries ⚠️
**Impact:** Medium - Affects bundle size  
**Effort:** High (3-4 days)

- [ ] **Audit animation usage**
  - List all GSAP usage
  - List all Framer Motion usage
  - List all Lenis usage
  
- [ ] **Choose primary library**
  - Framer Motion (recommended for React)
  - Or GSAP (more powerful, larger bundle)
  
- [ ] **Migrate animations**
  - Replace GSAP with Framer Motion (or vice versa)
  - Test all animations
  - Verify performance

**Files:**
- All components with animations

---

### 14. Add Language Attribute ⚠️
**Impact:** Low - Screen reader language detection  
**Effort:** Very Low (5 minutes)

- [ ] **Add `lang="en"` to `<html>` element**
  - Open `app/index.html`
  - Change `<html>` to `<html lang="en">`
  - Save and commit

**Files:**
- `app/index.html`

---

### 15. Storybook Documentation ⚠️
**Impact:** Low - Developer experience  
**Effort:** High (3-4 days)

- [ ] **Install Storybook**
  - `npx storybook@latest init`
  - Configure for Vite + React + TypeScript
  
- [ ] **Create stories for all components**
  - Button, Input, Card, etc.
  - Document props and variants
  - Add interactive controls
  
- [ ] **Add visual regression testing**
  - Use Chromatic or Percy
  - Automate screenshot comparison
  - Catch visual bugs early

**Files:**
- `.storybook/` (create new)
- `app/src/**/*.stories.tsx` (create new)

---

## TESTING CHECKLIST

### Cross-Browser Testing
- [ ] Chrome (Windows/Mac/Linux) - Latest
- [ ] Firefox (Windows/Mac/Linux) - Latest
- [ ] Safari (Mac) - Latest
- [ ] Edge (Windows) - Latest
- [ ] Safari (iOS 15+) - iPhone SE, 12, 13, 14, 15
- [ ] Chrome (Android 11+) - Various devices
- [ ] Samsung Internet - Galaxy devices

### Screen Size Testing
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13)
- [ ] 390px (iPhone 14/15)
- [ ] 768px (iPad Portrait)
- [ ] 1024px (iPad Landscape)
- [ ] 1280px (Laptop)
- [ ] 1920px (Desktop)

### Performance Testing
- [ ] Lighthouse (Performance, Accessibility, SEO)
- [ ] WebPageTest (Load time, FCP, TTI)
- [ ] Chrome DevTools (Network, Performance, Coverage)
- [ ] Mobile data connection (3G, 4G, 5G)

### Functional Testing
- [ ] Navigation menu (open/close, keyboard, touch)
- [ ] Contact form (validation, submission, success state)
- [ ] Portfolio tabs (switching, keyboard, touch)
- [ ] Project rows (expand/collapse, gallery, lightbox)
- [ ] Video scroll section (scroll, swipe, keyboard)
- [ ] Hero video (autoplay, crossfade, fallback)

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Run all tests (unit, integration, e2e)
- [ ] Run Lighthouse audits (all pages)
- [ ] Verify all environment variables are set
- [ ] Verify all API keys are valid
- [ ] Test on staging environment
- [ ] Get stakeholder approval

### Deployment
- [ ] Deploy to production (Vercel)
- [ ] Verify deployment successful
- [ ] Test production site (smoke test)
- [ ] Monitor error logs (Sentry, LogRocket)
- [ ] Monitor performance (Core Web Vitals)

### Post-Deployment
- [ ] Set up monitoring and analytics
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Set up error tracking (Sentry)
- [ ] Set up performance monitoring (Vercel Analytics)
- [ ] Document deployment process
- [ ] Create maintenance procedures

---

## PROGRESS TRACKING

### Week 1 Progress
- [ ] Video performance optimization (0/4 tasks)
- [ ] Font scaling smoothness (0/3 tasks)
- [ ] Horizontal scroll indicators (0/3 tasks)
- [ ] Image optimization (0/4 tasks)
- [ ] GSAP + Lenis conflict (0/3 tasks)

**Total:** 0/17 tasks (0%)

### Week 2 Progress
- [ ] Touch feedback states (0/2 tasks)
- [ ] Parallax performance (0/2 tasks)
- [ ] Form backend integration (0/3 tasks)
- [ ] Accessibility testing (0/6 tasks)
- [ ] Code splitting optimization (0/3 tasks)

**Total:** 0/16 tasks (0%)

### Week 3 Progress
- [ ] Custom cursor fallback (0/1 tasks)
- [ ] Loading screen optimization (0/1 tasks)
- [ ] Consolidate animation libraries (0/3 tasks)
- [ ] Add language attribute (0/1 tasks)
- [ ] Storybook documentation (0/3 tasks)

**Total:** 0/9 tasks (0%)

---

## OVERALL PROGRESS

**Total Tasks:** 42  
**Completed:** 0  
**In Progress:** 0  
**Not Started:** 42  
**Progress:** 0%

---

**Document Version:** 1.0  
**Last Updated:** April 30, 2026  
**Author:** Kiro AI Agent  
**Status:** Ready for Implementation
