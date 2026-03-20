import type { ReactNode } from "react";
import { Button } from "../Button";
import { GlassPanel } from "../GlassPanel";
import { goToHomeSection } from "../../lib/appRoute";
import { useLocale } from "../../state/LocaleContext";

function GuidePageLayout({
  eyebrow,
  title,
  description,
  secondaryHref,
  secondaryLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  secondaryHref: string;
  secondaryLabel: string;
  children: ReactNode;
}) {
  const { locale } = useLocale();
  const isGerman = locale === "de";

  return (
    <section className="legal-page">
      <div className="container">
        <div className="legal-hero glass-panel">
          <div className="legal-hero-copy">
            <span className="section-eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="legal-hero-actions">
            <Button
              href="/"
              onClick={(event) => {
                event.preventDefault();
                goToHomeSection("top");
              }}
            >
              {isGerman ? "Zur Startseite" : "Back to home"}
            </Button>
            <Button href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </Button>
          </div>
        </div>

        <div className="legal-stack">{children}</div>
      </div>
    </section>
  );
}

function GuideSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <GlassPanel className="legal-panel">
      <h2>{title}</h2>
      {children}
    </GlassPanel>
  );
}

export function GoodReactionTimePage() {
  const { locale } = useLocale();
  const isGerman = locale === "de";

  return (
    <GuidePageLayout
      eyebrow={isGerman ? "Guide" : "Guide"}
      title={
        isGerman
          ? "Was ist eine gute Reaktionszeit?"
          : "What is a good reaction time?"
      }
      description={
        isGerman
          ? "Eine gute Reaktionszeit ist nie nur eine Zahl. Sie haengt von Geraet, Eingabemethode, Testaufbau und Wiederholbarkeit ab. Diese Seite ordnet ein, wie man Werte fair liest."
          : "A good reaction time is never just one number. It depends on device, input method, test setup, and repeatability. This page explains how to read scores fairly."
      }
      secondaryHref="/mobile-vs-desktop-reaction-time"
      secondaryLabel={isGerman ? "Mobile vs. Desktop" : "Mobile vs. desktop"}
    >
      <div className="legal-grid legal-grid-wide">
        <GuideSection title={isGerman ? "1. Warum es keine einzelne magische Zahl gibt" : "1. Why there is no single magic number"}>
          <p>
            {isGerman
              ? "Viele Seiten stellen Reaktionszeit so dar, als gaebe es eine einzige Grenze zwischen langsam, gut und elite. In der Praxis ist das zu einfach. Ein Touchscreen auf einem Handy reagiert anders als eine Maus am Desktop. Hinzu kommen Browser-Latenzen, Bildwiederholrate, Haltung, Fokus und Wiederholungseffekte."
              : "Many sites present reaction time as if there were one clear line between slow, good, and elite. In practice that is too simple. A mobile touchscreen behaves differently from a desktop mouse. Browser latency, refresh rate, posture, focus, and repetition effects also matter."}
          </p>
          <p>
            {isGerman
              ? "Deshalb ist ein guter Wert immer kontextabhaengig. Reaction Run zeigt nicht nur deinen besten Versuch, sondern auch Durchschnitt, Session-Verlauf und globale Vergleiche. Erst diese Kombination macht eine einzelne Millisekunden-Zahl wirklich brauchbar."
              : "That is why a good score is always contextual. Reaction Run does not only show a best attempt, but also average pace, session history, and global comparison. That combination is what makes a millisecond value actually useful."}
          </p>
        </GuideSection>

        <GuideSection title={isGerman ? "2. Grobe Orientierung fuer Web-Tests" : "2. A rough orientation for web-based tests"}>
          <p>
            {isGerman
              ? "Bei klassischen webbasierten Reaktionstests gelten Werte unter etwa 200 ms oft als stark, waehrend 200 bis 260 ms fuer viele Nutzer bereits solide bis gut sind. Oberhalb davon wird es haeufig eher durchschnittlich. Diese Orientierung ist aber kein universelles Ranking, sondern nur ein grober Rahmen fuer Browser-Tests."
              : "In classic browser-based reaction tests, values below about 200 ms are often considered strong, while 200 to 260 ms is already solid to good for many users. Above that tends to feel more average. This is not a universal ranking, only a rough frame for browser-based testing."}
          </p>
          <p>
            {isGerman
              ? "Ein einzelner Peak ist dabei weniger wichtig als die Frage, ob du ueber mehrere gueltige Runden hinweg konstant bleibst. Wer einmal 170 ms trifft, aber sonst bei 260 ms liegt, hat ein anderes Profil als jemand mit mehreren stabilen 190er-Runs."
              : "A single peak matters less than whether you stay consistent across several valid rounds. Someone who hits 170 ms once but otherwise sits at 260 ms has a different profile from someone with several stable runs in the 190 ms range."}
          </p>
        </GuideSection>

        <GuideSection title={isGerman ? "3. Was Reaction Run als validen Score behandelt" : "3. What Reaction Run treats as a valid score"}>
          <p>
            {isGerman
              ? "Damit das globale Board glaubwuerdig bleibt, uebernimmt Reaction Run nur plausible Werte in einem klaren Fenster. Extrem niedrige Ausreisser, die eher auf Fehlklicks, Timing-Fehler oder unnatuerliche Eingaben hindeuten, werden nicht ins globale Ranking geschrieben."
              : "To keep the global board credible, Reaction Run only accepts plausible values in a clearly defined range. Extremely low outliers that look more like misclicks, timing issues, or unnatural input are not written into the global ranking."}
          </p>
          <p>
            {isGerman
              ? "Das macht das Board fairer. Nicht jeder lokal gemessene Wert ist automatisch ein sinnvoller globaler Vergleichswert. Genau deshalb bleibt der lokale Test schnell, waehrend das globale Board mit einer strengeren Validierung arbeitet."
              : "That makes the board fairer. Not every locally measured value is automatically a meaningful global comparison value. That is why the local test stays fast while the global board uses stricter validation."}
          </p>
        </GuideSection>

        <GuideSection title={isGerman ? "4. Der beste Weg, Fortschritt zu lesen" : "4. The best way to read progress"}>
          <p>
            {isGerman
              ? "Wenn du wirklich besser werden willst, solltest du weniger auf einen einzelnen Rekord und mehr auf Muster achten: sinkt dein Durchschnitt, wird dein Stabilitaetsband enger, und bleiben deine besten Werte wiederholbar? Genau dort entsteht echter Fortschritt."
              : "If you actually want to improve, focus less on one record and more on patterns: is your average coming down, is your stability band getting tighter, and do your best scores remain repeatable? That is where real progress appears."}
          </p>
          <p>
            {isGerman
              ? "Ein guter Reaktionszeit-Wert ist also der Wert, den du nicht nur einmal erreichst, sondern in einem sinnvollen Kontext wiederholen kannst."
              : "So a good reaction-time score is not just the number you hit once, but the number you can repeat in a meaningful context."}
          </p>
        </GuideSection>
      </div>
    </GuidePageLayout>
  );
}

export function MobileVsDesktopPage() {
  const { locale } = useLocale();
  const isGerman = locale === "de";

  return (
    <GuidePageLayout
      eyebrow={isGerman ? "Guide" : "Guide"}
      title={
        isGerman
          ? "Mobile vs. Desktop: Warum Reaktionszeit je nach Geraet anders ausfaellt"
          : "Mobile vs. desktop: why reaction time changes by device"
      }
      description={
        isGerman
          ? "Ein Handy-Score ist nicht direkt mit einem Desktop-Score identisch. Diese Seite erklaert, warum sich Touch, Maus, Browser und Display deutlich unterschiedlich anfuehlen."
          : "A mobile score is not directly identical to a desktop score. This guide explains why touch, mouse, browser, and display behavior can feel very different."
      }
      secondaryHref="/good-reaction-time"
      secondaryLabel={isGerman ? "Gute Reaktionszeit" : "Good reaction time"}
    >
      <div className="legal-grid legal-grid-wide">
        <GuideSection title={isGerman ? "1. Touch ist nicht gleich Maus" : "1. Touch is not the same as a mouse"}>
          <p>
            {isGerman
              ? "Auf dem Handy wird eine Eingabe ueber den Touchscreen und das jeweilige Browser-Event-System verarbeitet. Auf dem Desktop arbeitet man meist mit Maus oder Trackpad. Diese Wege fuehlen sich nicht nur subjektiv anders an, sondern haben auch unterschiedlich wahrnehmbare Ausloesemomente."
              : "On a phone, an input is processed through the touchscreen and the browser event system tied to it. On desktop, users usually work with a mouse or trackpad. These paths do not just feel different subjectively, they can also have different perceived trigger moments."}
          </p>
          <p>
            {isGerman
              ? "Darum ist es voellig normal, wenn ein Nutzer auf dem Desktop niedrigere Werte erreicht als auf dem Smartphone. Das ist nicht automatisch ein Fairnessproblem, sondern eine Eigenschaft der jeweiligen Eingabesituation."
              : "That is why it is completely normal for a user to achieve lower values on desktop than on a smartphone. It is not automatically a fairness problem, but a property of the input situation itself."}
          </p>
        </GuideSection>

        <GuideSection title={isGerman ? "2. Display und Browser beeinflussen die Wahrnehmung" : "2. Display and browser affect perception"}>
          <p>
            {isGerman
              ? "Auch die visuelle Seite spielt mit hinein. Ein Display mit hoher Bildwiederholrate, ein Browser mit anderer Rendering-Charakteristik oder ein Geraet mit staerkerer Last koennen das Timing-Gefuehl veraendern. Schon kleine Unterschiede summieren sich bei kurzen Reaktionsaufgaben schnell."
              : "The visual side matters too. A display with a higher refresh rate, a browser with different rendering behavior, or a device under heavier load can all change the feeling of timing. Small differences add up quickly in short reaction tasks."}
          </p>
          <p>
            {isGerman
              ? "Deshalb sind Scores nie komplett hardware-neutral. Ein guter Test macht diese Grenzen sichtbar, statt so zu tun, als waeren alle Umgebungen identisch."
              : "That is why scores are never completely hardware-neutral. A good test makes those limits visible instead of pretending every environment is identical."}
          </p>
        </GuideSection>

        <GuideSection title={isGerman ? "3. Was fuer faire Vergleiche sinnvoll ist" : "3. What makes comparisons fair"}>
          <p>
            {isGerman
              ? "Am fairsten sind Vergleiche innerhalb derselben Eingabeumgebung: Handy mit Handy, Desktop mit Desktop, Touch mit Touch. Globales Ranking bleibt trotzdem spannend, aber der ernsthafte Fortschritt laesst sich am besten lesen, wenn man regelmaessig unter aehnlichen Bedingungen testet."
              : "The fairest comparisons happen within the same input environment: phone against phone, desktop against desktop, touch against touch. Global ranking is still interesting, but real progress is easiest to read when you test regularly under similar conditions."}
          </p>
          <p>
            {isGerman
              ? "Reaction Run kombiniert deshalb lokales Session-Tracking mit globalem Board. So sieht man sowohl den eigenen Verlauf als auch die Einordnung im groesseren Feld."
              : "That is why Reaction Run combines local session tracking with a global board. You can see both your own trend and your place in the larger field."}
          </p>
        </GuideSection>

        <GuideSection title={isGerman ? "4. Wie du deine Werte sinnvoll nutzt" : "4. How to use your scores well"}>
          <p>
            {isGerman
              ? "Wenn du auf dem Handy trainierst, nimm vor allem Handy-Daten ernst. Wenn du kompetitiv vergleichen willst, teste moeglichst auf derselben Art von Geraet wie die Vergleichsgruppe. Und wenn du einfach wissen willst, ob du besser wirst, dann ist Konsistenz ueber mehrere Sessions wichtiger als der absolute Einmal-Rekord."
              : "If you train on mobile, take mobile data seriously first. If you want competitive comparison, test on the same kind of device as the group you compare yourself with. And if you simply want to know whether you are improving, consistency across multiple sessions matters more than one absolute record."}
          </p>
          <p>
            {isGerman
              ? "Genau mit dieser Haltung wird aus einem einfachen Reaction-Test ein brauchbares Leistungswerkzeug."
              : "That is exactly the mindset that turns a simple reaction test into a useful performance tool."}
          </p>
        </GuideSection>
      </div>
    </GuidePageLayout>
  );
}
