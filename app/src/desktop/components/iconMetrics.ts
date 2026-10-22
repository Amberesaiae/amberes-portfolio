/**
 * Intrinsic pixels after the display-sized re-encode. The attributes reserve
 * the ratio; the well still decides the rendered box.
 */
export const ICON_INTRINSIC: Record<string, { width: number; height: number }> = {
  '/images/software/containerclear.webp': { width: 960, height: 194 },
  '/images/software/glean.webp': { width: 384, height: 384 },
  '/images/software/jingo.webp': { width: 384, height: 384 },
  '/images/software/noragami.webp': { width: 384, height: 384 },
};

/** ContainerClear is a wordmark, about 5:1. A square well reduces it to a smear. */
export function iconIsWide(src: string) {
  const dim = ICON_INTRINSIC[src];
  return !!dim && dim.width / dim.height >= 2;
}
