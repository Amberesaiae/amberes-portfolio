/**
 * Who he is, in public.
 *
 * One file so the chrome, the terminal, the document title and the meta tags
 * cannot drift into three different job titles. The detail — marine
 * engineering, welding, web development — deliberately lives only in the About
 * window, which is where someone has chosen to go looking.
 */
export const IDENTITY = {
  name: 'Lamptey Odartei Isaiah',
  handle: 'amber',
  /** the canonical line. Used everywhere except About. */
  title: 'Engineer · Software Engineer · Builder of Worlds',
  /** the short form, for tight spaces */
  titleShort: 'Software Engineer · Builder of Worlds',
  role: 'Engineer',
  location: 'Accra, Ghana',
  locationShort: 'Accra',
  email: 'isaiahamber5@gmail.com',
  portrait: '/images/amber-portrait.jpg',
} as const;
