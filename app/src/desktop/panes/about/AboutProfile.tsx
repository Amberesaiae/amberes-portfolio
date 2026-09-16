import { Separator } from '@/components/ui/separator';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { Eyebrow } from '@/desktop/typography/Eyebrow';
import { Body, Display, Label } from '@/desktop/typography/Text';
import { AboutLinks } from './AboutLinks';
import { MantisTraits } from './MantisTraits';

/** Who, in his own words, with a face next to it. */
export function AboutProfile() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <ImageSlot
          className="w-full shrink-0 sm:w-44"
          ratio="4 / 5"
          sizes="(max-width: 640px) 90vw, 176px"
          widths={[320, 640, 768, 1024]}
          src="/images/amber-portrait.jpg"
          alt="Lamptey Odartei Isaiah"
          hint="Portrait"
        />

        <div className="space-y-3">
          <div>
            <Display>Lamptey Odartei Isaiah</Display>
            <Label className="mt-1.5 block text-muted-foreground/70">
              amber · Accra, Ghana
            </Label>
          </div>
          <Body>
            Marine engineer by training, builder by habit. I spent my formative years in engine
            rooms and shipyards, learning that a system you do not understand will eventually
            teach you the hard way. I write software to the same standard: understand it, respect
            the materials, leave it better documented than you found it.
          </Body>
        </div>
      </header>

      <AboutLinks />

      <Separator />

      <section>
        <Eyebrow>Why the mantis</Eyebrow>
        <Body className="mb-6 text-[0.8125rem] text-muted-foreground">
          A four-inch animal that punches with the force of a bullet, sees colour in dimensions we
          have no words for, and has been getting the fundamentals right for four hundred million
          years. It is a decent thing to aim at.
        </Body>
        <div className="mb-6 grid grid-cols-2 gap-2.5">
          <ImageSlot src="/images/mantis-front.jpg" alt="Mantis shrimp" ratio="4 / 3" hint="Mantis" sizes="220px" />
          <ImageSlot src="/images/lilies-bright.jpg" alt="Lilies" ratio="4 / 3" hint="Lilies" sizes="220px" />
        </div>
        <MantisTraits />
      </section>
    </div>
  );
}
