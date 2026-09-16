export interface ReelClip {
  id: string;
  title: string;
  credit: string;
  /** what he did on it — left blank until he says; shown beside the credit */
  role?: string;
  /** short muted loop for the dock tile */
  loop: string;
  /** full preview played in the reel window */
  preview: string;
}

const clip = (id: string, title: string, credit: string, role?: string): ReelClip => ({
  id,
  title,
  credit,
  role,
  loop: `/vids/loops/${id}.webm`,
  preview: `/vids/previews/${id}.webm`,
});

export const REEL: ReelClip[] = [
  clip('the-pen', 'The Pen', 'A Filmmaker'),
  clip('seen', 'Seen', 'Leo Captured'),
  clip('opportunities', 'Opportunities', 'Seed Creative'),
  clip('dream-date', 'Dream Date', 'Howard Guo'),
  clip('runaway', 'Runaway', 'Daniel Zheng'),
  clip('not-today', 'Not Today', 'Howw Films'),
  clip('trying', 'Trying', 'Arnav Sahu Films'),
];
