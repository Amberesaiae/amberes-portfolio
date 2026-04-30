// YouTube IFrame API — loads once globally, resolves when ready
let ytReady: Promise<void> | null = null;

export function loadYouTubeAPI(): Promise<void> {
  if (ytReady) return ytReady;

  ytReady = new Promise((resolve) => {
    if (window.YT && window.YT.Player) { resolve(); return; }

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve();
    };

    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script');
      tag.id  = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

  return ytReady;
}

// High-quality thumbnail URL for a video ID
export function ytThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// Video IDs + midpoint start times (seconds)
export const FILMS: Record<string, { id: string; start: number }> = {
  'the-pen':       { id: '_DcynD2sc3Q', start: 0  },
  'seen':          { id: 'rMPkUuMq024', start: 25 },
  'opportunities': { id: 'N9DceNbpNrA', start: 30 },
  'dream-date':    { id: 'uc0Hh-IrqL4', start: 40 },
  'runaway':       { id: 'qaRdXsIP764', start: 30 },
  'not-today':     { id: 'ymxbrsUzApI', start: 35 },
  'trying':        { id: '1Kee4EXqETg', start: 30 },
};

// Shared player vars for silent background autoplay
export const BG_PLAYER_VARS = {
  autoplay:       1,
  mute:           1,
  controls:       0,
  playsinline:    1,
  modestbranding: 1,
  rel:            0,
  showinfo:       0,
  iv_load_policy: 3,
  disablekb:      1,
};

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}
