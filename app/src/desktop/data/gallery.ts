export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  /** one line — what it is, or why it is here */
  note: string;
}

/**
 * The pictures that are not projects.
 *
 * Each one carried a piece of the old site's meaning and lost it when the pages
 * went; the note is that meaning, kept in one line.
 */
export const GALLERY: GalleryItem[] = [
  {
    id: 'lilies',
    src: '/images/lilies-bright.jpg',
    title: 'Consider the lilies',
    note: '“They neither toil nor spin” — Luke 12:27. A guiding word.',
  },
  {
    id: 'mantis',
    src: '/images/mantis-front.jpg',
    title: 'The mantis',
    note: 'Four inches, a bullet’s worth of force, sixteen colour receptors.',
  },
  {
    id: 'shipyard',
    src: '/images/shipyard-welder.jpg',
    title: 'PSC Tema Shipyard',
    note: 'Where the welding stopped being theory.',
  },
  {
    id: 'piston',
    src: '/images/ship-piston.jpg',
    title: 'Engine room',
    note: 'Propulsion and auxiliary machinery across four vessels.',
  },
  {
    id: 'whales',
    src: '/images/whales-aerial.jpg',
    title: 'Life at sea',
    note: 'The part of the job no photograph quite holds.',
  },
  {
    id: 'hamster',
    src: '/images/hamster.jpg',
    title: 'System Guardian',
    note: 'An experiment that watches things so I do not have to.',
  },
  {
    id: 'blueprint',
    src: '/images/blueprint-bg.jpg',
    title: 'Mechanical blueprint',
    note: 'Drawing before cutting. It applies to software too.',
  },
];
