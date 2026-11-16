import { BOARD_HEIGHT, CARDS, COLUMN } from "@/lib/canvas";
import { Card } from "./Card";
import { Sidebar } from "./Sidebar";

const INTRO = [
  "We are Amber Studio, from Accra.",
  "We build websites, operations systems",
  "and the software businesses run on.",
];

/**
 * The board.
 *
 * Four lines of prose, then the work — the reference carries 354 words on its
 * whole homepage and sells by showing thirty artifacts at once, so the intro is
 * deliberately the smallest thing here and nothing explains itself beyond a
 * grey label.
 *
 * It scrolls rather than pans. An infinite canvas you have to drag hides its
 * own contents, and a visitor who does not know to drag sees one screen and
 * leaves.
 */
export function Canvas() {
  return (
    <div className="min-h-dvh bg-[var(--canvas)]">
      <Sidebar />

      {/*
       * Phones get the work as one column, and nothing else.
       *
       * The board is forty-odd frames placed to the pixel across 1425px. There
       * is no honest way to scale that to 390 — the frames become stamps, or
       * the page becomes forty screens of scrolling. So the collage, which is
       * atmosphere, is dropped outright, and what survives is the half that was
       * doing the navigating. Showing less is the mobile design; shrinking
       * everything would only be a smaller version of the wrong thing.
       */}
      <main className="md:hidden">
        <div className="px-5 pt-8 pb-5">
          <p className="text-[15px] leading-[1.45] text-black/80">
            {INTRO.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="mt-3 text-[15px] leading-[1.45] text-black/45">
            Engineering real-world solutions.
          </p>
        </div>

        <div className="flex flex-col gap-10 px-5 pt-6 pb-16">
          {COLUMN.map((card) => (
            <Card key={card.id} card={card} stacked />
          ))}
        </div>
      </main>

      {/*
       * Desktop keeps the measured board at true size and scrolls sideways
       * below ~1200px rather than reflowing. Reflowing would move every frame
       * off the position it was placed at, which is the one thing the layout
       * cannot survive.
       */}
      <main className="hidden md:block md:pl-[200px]">
        <div className="overflow-x-auto">
          <div
            className="relative mx-auto w-full max-w-[1500px] min-w-[1200px] px-5"
            style={{ height: BOARD_HEIGHT }}
          >
            <div className="absolute top-[70px] left-[8%] max-w-[300px]">
              <p className="text-[15px] leading-[1.45] text-black/80">
                {INTRO.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p className="mt-3 text-[15px] leading-[1.45] text-black/45">
                Engineering real-world solutions.
              </p>
            </div>

            {CARDS.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
