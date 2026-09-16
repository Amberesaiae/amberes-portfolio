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
      'This site collects nothing on its own. There is no analytics script, no advertising network, and no third-party tracker embedded in these pages.',
      'The contact form is the only place you can hand over information. What you type — your name, email address, subject and message — is sent to my inbox so I can reply, and is used for nothing else. It is not sold, shared, or added to a mailing list.',
      'Your browser stores one thing locally: the positions you drag the folders into. That never leaves your device, and clearing site data removes it.',
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
      'Everything is provided as-is. Project descriptions reflect the state of things when they were written and may go out of date.',
      'External links lead to other people’s sites, under other people’s control.',
    ],
  },
  {
    id: 'cookies',
    label: 'Cookies',
    heading: 'Cookies',
    body: [
      'This site sets no cookies.',
      'It uses one key in your browser’s local storage, desktop:icons:v1, which remembers where you dragged the folders. No identifier, no tracking, nothing sent to a server.',
      'Clearing site data resets the desktop to its default arrangement — which is also what “Tidy up” in the menu bar does.',
    ],
  },
];
