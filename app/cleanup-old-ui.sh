#!/usr/bin/env bash
# Removes the files the desktop rebuild replaced.
#
# Nothing here is imported any more, so the site builds and runs correctly
# without running this — the files are just dead weight in the repo. Run it from
# the app/ directory once you are happy with the new UI:
#
#   cd app && bash cleanup-old-ui.sh
#
# Everything is under git, so `git checkout -- .` puts it all back.
#
# NOTE: src/components/ui/ is KEPT. Those are the shadcn primitives the new
# panes are built on. Only the bespoke components that lived alongside them are
# removed.

set -u
cd "$(dirname "$0")"

remove() {
  for f in "$@"; do
    if [ -e "$f" ]; then
      rm -rf "$f"
      echo "removed  $f"
    fi
  done
}

echo "--- homepage sections (replaced by window panes)"
remove src/sections

echo "--- pages (replaced by window panes)"
remove src/pages

echo "--- components the desktop does not use"
remove \
  src/components/Navigation.tsx \
  src/components/SmoothScroll.tsx \
  src/components/BackToTop.tsx \
  src/components/CustomCursor.tsx \
  src/components/LoadingScreen.tsx \
  src/components/PageWrapper.tsx \
  src/components/Footer.tsx \
  src/components/WhyAmber.tsx \
  src/components/SystemStatus.tsx \
  src/components/InfluenceMarquee.tsx \
  src/components/BirthdayCountdown.tsx \
  src/components/Tetris.tsx \
  src/components/Minesweeper.tsx \
  src/components/Terminal.tsx \
  src/components/Meta.tsx \
  src/components/portfolio \
  src/components/project

echo "--- about/* (aboutData.ts is still used and stays)"
remove \
  src/components/about/AboutDisciplinesSection.tsx \
  src/components/about/AboutEnvironmentClosingSection.tsx \
  src/components/about/AboutFormationSection.tsx \
  src/components/about/AboutHeroSection.tsx \
  src/components/about/AboutIdentityBioSection.tsx \
  src/components/about/AboutSocialLinks.tsx

echo "--- bespoke UI components superseded by the shadcn primitives"
remove \
  src/components/ui/ImageModal.tsx \
  src/components/ui/MagneticButton.tsx \
  src/components/ui/PageTransition.tsx \
  src/components/ui/ParallaxImage.tsx \
  src/components/ui/PortfolioAccordion.tsx \
  src/components/ui/ResponsiveImage.tsx \
  src/components/ui/ScrollIndicator.tsx \
  src/components/ui/SectionLabel.tsx \
  src/components/ui/StatusBadge.tsx \
  src/components/ui/SystemClock.tsx \
  src/components/ui/SystemOverlay.tsx \
  src/components/ui/TextReveal.tsx \
  src/components/ui/TiltCard.tsx

echo "--- hooks and style tokens with no remaining callers"
remove \
  src/hooks/use-mobile.ts src/hooks/useInterval.ts src/hooks/useScrollAnimation.ts \
  src/hooks/useTouchDevice.ts src/hooks/useViewport.ts src/hooks/useReducedMotion.ts \
  src/hooks/useConnectionSpeed.ts \
  src/styles src/utils/audio.ts src/utils/videoOptimization.ts \
  src/App.css src/stories

echo "--- the source video (converted copies live in public/vids/)"
remove "Animated Backgrounds.mp4"

cat <<'NOTE'

Done. Two follow-ups:

  1. Dependencies with no remaining importer:

       npm uninstall lenis gsap react-hook-form @hookform/resolvers zod \
         recharts embla-carousel-react cmdk vaul input-otp react-day-picker \
         react-resizable-panels next-themes

     The @radix-ui/* packages STAY — they are what the shadcn components in
     src/components/ui/ are built on. Run `npm run build` afterwards to confirm.

     Unused shadcn components (dialog, calendar, chart, sidebar, and the rest)
     cost nothing: they are only bundled if something imports them. Leave them
     for when you need one, or delete them individually.

  2. The markdown audit reports in app/ (MOBILE_OPTIMIZATION_*.md,
     SKELETAL_ANALYSIS*.md, RESPONSIVE_AUDIT*.md and the rest) describe a site
     that no longer exists. Delete them by hand when you are ready.

NOTE
