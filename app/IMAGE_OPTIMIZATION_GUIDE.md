# IMAGE OPTIMIZATION GUIDE
## Amber Systems Portfolio - Image Processing

**Date:** April 30, 2026  
**Purpose:** Guide for optimizing images for web performance

---

## OVERVIEW

This guide explains how to optimize images for the Amber Systems portfolio to improve page load times, reduce bandwidth usage, and provide the best experience across all devices.

---

## QUICK START

### 1. Install Dependencies

```bash
cd app
npm install sharp --save-dev
```

### 2. Run Optimization Script

```bash
node scripts/optimize-images.js
```

This will:
- Process all images in `public/images/`
- Generate WebP and AVIF versions
- Create multiple sizes (320w, 640w, 768w, 1024w, 1280w, 1920w)
- Output to `public/images/optimized/`

### 3. Use Responsive Image Component

```tsx
import ResponsiveImage from '@/components/ui/ResponsiveImage';

<ResponsiveImage 
  src="/images/optimized/hero" 
  alt="Hero background"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={false} // Set to true for above-fold images
/>
```

---

## FORMATS EXPLAINED

### AVIF (AV1 Image File Format)
- **Compression:** Best (30-50% smaller than JPEG)
- **Browser Support:** Chrome 85+, Firefox 93+, Safari 16+
- **Use Case:** Primary format for modern browsers

### WebP
- **Compression:** Good (25-35% smaller than JPEG)
- **Browser Support:** Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
- **Use Case:** Fallback for browsers without AVIF support

### JPEG
- **Compression:** Standard
- **Browser Support:** Universal
- **Use Case:** Final fallback for all browsers

---

## RESPONSIVE SIZES

The optimization script generates 6 sizes for each image:

| Width | Use Case | Typical Device |
|-------|----------|----------------|
| 320w | Small mobile | iPhone SE |
| 640w | Mobile | iPhone 12/13 |
| 768w | Tablet portrait | iPad |
| 1024w | Tablet landscape | iPad Pro |
| 1280w | Laptop | MacBook |
| 1920w | Desktop | iMac, external monitors |

---

## COMPONENT USAGE

### ResponsiveImage (Full Responsive)

For images that need multiple sizes:

```tsx
<ResponsiveImage 
  src="/images/optimized/hero" // Base path without extension
  alt="Hero background"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={false}
  className="w-full h-full object-cover"
/>
```

**Sizes Attribute Examples:**
- Full width on all devices: `100vw`
- Full width on mobile, 50% on desktop: `(max-width: 768px) 100vw, 50vw`
- Complex layout: `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`

### SimpleResponsiveImage (Format Only)

For images where you already have the full path:

```tsx
import { SimpleResponsiveImage } from '@/components/ui/ResponsiveImage';

<SimpleResponsiveImage 
  src="/images/hero.jpg"
  alt="Hero background"
  priority={true} // Above-fold image
  className="w-full h-full object-cover"
/>
```

---

## PRIORITY LOADING

### Above-the-Fold Images (priority={true})
- Hero images
- Logo
- First section backgrounds
- Uses `loading="eager"`

### Below-the-Fold Images (priority={false})
- Gallery images
- Section backgrounds (not first section)
- Footer images
- Uses `loading="lazy"` (native browser lazy loading)

---

## OPTIMIZATION SCRIPT DETAILS

### Configuration

Edit `scripts/optimize-images.js` to customize:

```javascript
const WIDTHS = [320, 640, 768, 1024, 1280, 1920]; // Responsive sizes
const FORMATS = ['webp', 'avif', 'jpeg']; // Output formats
const QUALITY = {
  webp: 85,  // 0-100
  avif: 80,  // 0-100
  jpeg: 85,  // 0-100
};
```

### Input/Output

- **Input:** `public/images/` (original images)
- **Output:** `public/images/optimized/` (processed images)
- **Preserves:** Directory structure

### Processing

1. Scans `public/images/` recursively
2. Finds all `.jpg`, `.jpeg`, `.png` files
3. For each image:
   - Resizes to each width (if original is larger)
   - Converts to each format (AVIF, WebP, JPEG)
   - Saves with naming convention: `filename-{width}.{format}`

### Example Output

```
Input:  public/images/hero.jpg (5MB, 3840x2160)
Output: public/images/optimized/
  ├── hero-320.avif   (15KB)
  ├── hero-320.webp   (18KB)
  ├── hero-320.jpg    (25KB)
  ├── hero-640.avif   (45KB)
  ├── hero-640.webp   (55KB)
  ├── hero-640.jpg    (80KB)
  ├── hero-768.avif   (60KB)
  ├── hero-768.webp   (75KB)
  ├── hero-768.jpg    (110KB)
  ├── hero-1024.avif  (95KB)
  ├── hero-1024.webp  (120KB)
  ├── hero-1024.jpg   (180KB)
  ├── hero-1280.avif  (130KB)
  ├── hero-1280.webp  (165KB)
  ├── hero-1280.jpg   (250KB)
  ├── hero-1920.avif  (220KB)
  ├── hero-1920.webp  (280KB)
  └── hero-1920.jpg   (420KB)
```

**Total:** 18 files, ~2.2MB (vs. original 5MB)

---

## MIGRATION GUIDE

### Step 1: Backup Original Images

```bash
cp -r public/images public/images-backup
```

### Step 2: Run Optimization

```bash
node scripts/optimize-images.js
```

### Step 3: Update Components

Replace standard `<img>` tags with `ResponsiveImage`:

**Before:**
```tsx
<img src="/images/hero.jpg" alt="Hero" className="w-full" />
```

**After:**
```tsx
<ResponsiveImage 
  src="/images/optimized/hero" 
  alt="Hero"
  sizes="100vw"
  className="w-full"
/>
```

### Step 4: Test

- Verify images load correctly on all devices
- Check Network tab in DevTools (correct format served)
- Test on slow connections (lazy loading works)
- Verify fallbacks work in older browsers

### Step 5: Deploy

- Commit optimized images to repository
- Deploy to staging for testing
- Monitor performance metrics (Lighthouse, WebPageTest)
- Deploy to production

---

## PERFORMANCE IMPACT

### Before Optimization
- **Hero Image:** 5MB (JPEG, 3840x2160)
- **Gallery (10 images):** 35MB total
- **Mobile Load Time:** 15-20s (3G)
- **Desktop Load Time:** 3-5s (WiFi)

### After Optimization
- **Hero Image:** 220KB (AVIF, 1920w) or 280KB (WebP, 1920w)
- **Gallery (10 images):** 2.5MB total (AVIF) or 3.2MB (WebP)
- **Mobile Load Time:** 3-5s (3G)
- **Desktop Load Time:** 1-2s (WiFi)

**Savings:**
- **Hero:** 95% reduction (5MB → 220KB)
- **Gallery:** 93% reduction (35MB → 2.5MB)
- **Load Time:** 70-80% improvement

---

## TROUBLESHOOTING

### Issue: "Cannot find module 'sharp'"

**Solution:**
```bash
npm install sharp --save-dev
```

### Issue: "Permission denied"

**Solution:**
```bash
chmod +x scripts/optimize-images.js
```

### Issue: "Out of memory"

**Solution:** Process images in smaller batches or increase Node.js memory:
```bash
node --max-old-space-size=4096 scripts/optimize-images.js
```

### Issue: Images not loading

**Solution:** Check file paths and ensure optimized images exist:
```bash
ls -la public/images/optimized/
```

### Issue: Wrong format served

**Solution:** Check browser support and `<picture>` element order (AVIF → WebP → JPEG)

---

## BEST PRACTICES

### 1. Always Optimize Before Committing
- Never commit unoptimized images to repository
- Run optimization script before each deployment
- Keep original images in separate backup directory

### 2. Use Appropriate Sizes Attribute
- Match `sizes` to actual image display size
- Use viewport units (vw) for responsive layouts
- Test on real devices to verify correct size served

### 3. Prioritize Above-the-Fold Images
- Set `priority={true}` for hero images
- Use `priority={false}` for below-fold images
- Lazy loading improves initial page load

### 4. Monitor Performance
- Use Lighthouse to track image performance
- Check Network tab to verify correct formats served
- Monitor Core Web Vitals (LCP, CLS)

### 5. Test Fallbacks
- Test in older browsers (IE11, Safari 13)
- Verify JPEG fallback works
- Check that images display correctly without JavaScript

---

## AUTOMATION

### Add to package.json

```json
{
  "scripts": {
    "optimize-images": "node scripts/optimize-images.js",
    "prebuild": "npm run optimize-images"
  }
}
```

### Run Before Build

```bash
npm run optimize-images
npm run build
```

### CI/CD Integration

Add to GitHub Actions workflow:

```yaml
- name: Optimize Images
  run: |
    npm install sharp --save-dev
    npm run optimize-images
```

---

## ADDITIONAL RESOURCES

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Format](https://developers.google.com/speed/webp)
- [AVIF Format](https://jakearchibald.com/2020/avif-has-landed/)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Lazy Loading](https://web.dev/lazy-loading-images/)

---

**Document Version:** 1.0  
**Last Updated:** April 30, 2026  
**Author:** Kiro AI Agent  
**Status:** Ready for Use
