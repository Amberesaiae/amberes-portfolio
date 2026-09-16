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

/**
 * The two accounts worth linking, with their handles.
 *
 * One list, used by both the About panel and the Contact window — they used to
 * carry separate copies pointed at bare instagram.com and x.com, which sent
 * anyone who clicked to a login wall instead of to him.
 */
export const SOCIALS = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@is_lamptey',
    href: 'https://www.instagram.com/is_lamptey/',
  },
  {
    id: 'x',
    label: 'X',
    handle: '@Esaiaemose',
    href: 'https://x.com/Esaiaemose',
  },
] as const;
