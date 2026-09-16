export type LegalTab = 'privacy' | 'terms' | 'cookies';

export interface LegalSection {
  id: LegalTab;
  label: string;
  heading: string;
  body: string[];
}

export const LEGAL: LegalSection[] = [
  {
    id: 'privacy',
    label: 'Privacy',
    heading: 'Privacy',
    body: [
      'This site collects nothing on its own. There is no analytics script, no advertising network, and no third-party tracker embedded in these pages. The site icons you see are served from this domain rather than fetched from the sites they belong to, so visiting this page tells those sites nothing.',
      'Two places accept what you type. The contact form sends your name, email address, subject and message to my inbox so I can reply. The assistant sends your message to a language model to answer it, and neither the message nor the reply is stored afterwards. Nothing from either is sold, shared, or added to a mailing list.',
      'Your browser stores one thing locally: where you dragged the plates on the desktop, and which theme you chose. That never leaves your device, and clearing site data removes it.',
      'Want anything you have sent me deleted? Email isaiahamber5@gmail.com and it is done.',
    ],
  },
  {
    id: 'terms',
    label: 'Terms',
    heading: 'Terms',
    body: [
      'This is a personal portfolio. The writing, code and design here are mine; the film work in the reel belongs to the filmmakers credited beside each clip and appears here with their names attached.',
      'You are welcome to read, link to, and quote this site. Republishing it wholesale, or presenting the work shown here as your own, is not on.',
      'Everything is provided as-is. Project descriptions reflect the state of things when they were written and may go out of date. The assistant answers from those same descriptions and can still be wrong — for anything that matters, the contact form reaches a person.',
      'External links lead to other people’s sites, under other people’s control.',
    ],
  },
  {
    id: 'cookies',
    label: 'Cookies',
    heading: 'Cookies',
    body: [
      'This site sets no cookies.',
      'It uses a small number of keys in your browser’s local storage — desktop:widgets:v2 for where you dragged the plates, and one for your light or dark preference. No identifier, no tracking, nothing sent to a server.',
      'Clearing site data resets the desktop to its default arrangement, which is also what “Tidy up” in the menu bar does.',
    ],
  },
];
