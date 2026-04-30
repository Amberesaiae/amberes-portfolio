// YouTube IFrame API loader - loads the script once globally
// and resolves when YT is ready

let ytReady: Promise<void> | null = null;

export function loadYouTubeAPI(): Promise<void> {
  if (ytReady) return ytReady;

  ytReady = new Promise((resolve) => {
    // Already loaded
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    // Callback YouTube calls when ready
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve();
    };

    // Inject script if not already present
    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

  return ytReady;
}

// Video IDs for all 7 films
export const FILM_IDS: Record<string, string> = {
  'the-pen':     '_DcynD2sc3Q',
  'seen':        'rMPkUuMq024',
  'opportunities': 'N9DceNbpNrA',
  'dream-date':  'uc0Hh-IrqL4',
  'runaway':     'qaRdXsIP764',
  'not-today':   'ymxbrsUzApI',
  'trying':      '1Kee4EXqETg',
};

// Declare YT on window for TypeScript
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}
