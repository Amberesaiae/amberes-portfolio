import { useEffect, type RefObject } from 'react';

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * The element the cards are actually moving inside.
 *
 * Overflow is declared on more than one ancestor (a plate, a pane, a sheet),
 * and only one of them is really scrolling. The first one whose content is
 * taller than its frame is that one; anything else would aim the tilt at a
 * box that never moves.
 */
function scrollingAncestor(stage: HTMLElement): HTMLElement {
  let fallback: HTMLElement | null = null;
  let node: HTMLElement | null = stage;
  while (node) {
    const overflow = getComputedStyle(node).overflowY;
    if (overflow === 'auto' || overflow === 'scroll') {
      fallback ??= node;
      if (node.scrollHeight > node.clientHeight + 2) return node;
    }
    node = node.parentElement;
  }
  return fallback ?? stage;
}

/**
 * Scroll position, written onto each card as a 3D transform.
 *
 * There is no timer and no idle animation. The angle is a pure function of
 * where the card sits in the frame, so with the finger off the screen the
 * cards hold still. A scroll — wheel or touch — is the only thing that
 * changes it. `active` is false when the visitor asked for reduced motion,
 * and then every card is left flat.
 */
export function useScrollTilt(stageRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const cards = () => stage.querySelectorAll<HTMLElement>('[data-tilt]');

    if (!active) {
      cards().forEach((card) => {
        card.style.transform = 'none';
      });
      return;
    }

    let frame = 0;
    const apply = () => {
      frame = 0;
      const view = scrollingAncestor(stage).getBoundingClientRect();
      const midY = view.top + view.height * 0.46;
      const midX = view.left + view.width * 0.5;
      const halfH = Math.max(view.height * 0.5, 1);
      const halfW = Math.max(view.width * 0.5, 1);

      cards().forEach((card) => {
        const rect = card.getBoundingClientRect();
        const dy = (rect.top + rect.height * 0.5 - midY) / halfH;
        const dx = (rect.left + rect.width * 0.5 - midX) / halfW;
        const cy = clamp(dy, -1.35, 1.35);
        const cx = clamp(dx, -1, 1);
        const rotateX = clamp(-cy * 32, -38, 38).toFixed(2);
        const rotateY = clamp(cx * 20 + cy * 6, -26, 26).toFixed(2);
        const rotateZ = clamp(cy * 3.2 - cx * 3, -7, 7).toFixed(2);
        const depth = ((1 - Math.min(Math.abs(cy), 1)) * 32).toFixed(2);
        card.style.transform = `translateZ(${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    schedule();
    document.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(stage);
    const mutations = new MutationObserver(schedule);
    mutations.observe(stage, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
      observer.disconnect();
      mutations.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [active, stageRef]);
}
