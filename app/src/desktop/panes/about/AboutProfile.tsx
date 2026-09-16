import { ImageSlot } from '@/desktop/components/ImageSlot';
import { Body, Display, Label } from '@/desktop/typography/Text';
import { AboutLinks } from './AboutLinks';

/**
 * Who, in his own words, with a face next to it.
 *
 * One portrait, one paragraph, one way to reach him. This tab used to also
 * carry two more photographs and a four-stat grid about the mantis shrimp —
 * good material, but it turned the first thing you read into a scroll. The
 * photographs live on the Pictures plate, where looking is the point.
 */
export function AboutProfile() {
  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* On a phone the portrait filled the whole first screen, so the name
            and the paragraph began below the fold. Capped to under half the
            viewport, it introduces him without being the entire introduction. */}
        <ImageSlot
          className="mx-auto w-[60%] max-w-[220px] shrink-0 sm:mx-0 sm:w-36 sm:max-w-none"
          ratio="4 / 5"
          sizes="(max-width: 640px) 90vw, 144px"
          src="/images/amber-portrait.jpg"
          alt="Lamptey Odartei Isaiah"
          hint="Portrait"
        />

        <div className="space-y-3">
          <div>
            <Display>Lamptey Odartei Isaiah</Display>
            <Label className="mt-1.5 block text-subtle-foreground">amber · Accra, Ghana</Label>
          </div>
          <Body>
            I trained as a marine engineer at KNUST and spent my formative time in engine rooms
            and shipyards — four vessels at PSC Tema, overhauls, propulsion, auxiliary machinery.
            A ship teaches you quickly that a system you do not fully understand will eventually
            teach you the hard way, usually at three in the morning.
          </Body>
          <Body>
            I build software to the same standard: understand it before you change it, respect the
            materials, leave it documented well enough that the next person is not guessing. Most
            of what is on this site began as something I needed and could not find.
          </Body>
        </div>
      </header>

      <AboutLinks />
    </div>
  );
}
