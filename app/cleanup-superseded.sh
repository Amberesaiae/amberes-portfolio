#!/usr/bin/env bash
# Files the dock migration left behind.
#
# Nothing imports these any more, so they are not bundled and the site is
# correct with or without this script. Run it to keep the tree honest:
#
#   cd app && bash cleanup-superseded.sh
#
# All of it is recoverable — but note that NOTHING in this repo is committed
# yet, so `git checkout` would take the whole redesign with it. Commit first.

set -u
cd "$(dirname "$0")"

remove() {
  for f in "$@"; do
    if [ -e "$f" ]; then
      rm -f "$f"
      echo "removed  $f"
    fi
  done
}

echo "--- desktop folder icons (navigation moved into the dock)"
remove \
  src/desktop/layers/IconLayer.tsx \
  src/desktop/icons/FolderIcon.tsx \
  src/desktop/icons/useIconPositions.ts

echo "--- the film strip (films are chosen in the Reel window now)"
remove \
  src/desktop/layers/ReelDock.tsx \
  src/desktop/layers/ReelDockTile.tsx

echo "--- the old embedded reel player (the wallpaper is the player)"
remove \
  src/desktop/panes/reel/ReelPlayer.tsx \
  src/desktop/panes/reel/ReelQueue.tsx \
  src/desktop/panes/reel/ReelControls.tsx \
  src/desktop/panes/reel/useReelQueue.ts

echo "--- the gooey filter (it existed to fuse folders while dragging)"
remove src/desktop/effects/GooeyFilter.tsx

echo "--- leftover from the first pass, superseded by panes/PaneBody.tsx"
remove src/desktop/panes/ui.tsx

cat <<'NOTE'

Done. src/desktop/icons/ now holds only FolderGlyph.tsx, which the dock uses.

NOTE ON THE GAMES: Tetris and Minesweeper are live again, behind the Games
folder. That means cleanup-old-ui.sh must NOT delete these four, and the copy
of it in this repo has been corrected:

  src/components/Tetris.tsx
  src/components/Minesweeper.tsx
  src/hooks/useInterval.ts
  src/utils/audio.ts

NOTE
