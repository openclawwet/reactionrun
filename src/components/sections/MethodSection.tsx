import { GlassPanel } from "../GlassPanel";
import { SectionHeader } from "../SectionHeader";
import { useLocale } from "../../state/LocaleContext";

const methodHighlights = {
  de: [
    {
      title: "Valider Score-Bereich",
      body: "Nur Reaktionszeiten zwischen 50 und 1000 ms werden fuer das globale Leaderboard uebernommen. So bleiben versehentliche Taps und unplausible Ausreisser ausserhalb des Boards.",
    },
    {
      title: "Getrennte Board-Ansichten",
      body: "Top 100 zeigt die besten veroeffentlichten Werte pro Spieler. Latest 100 zeigt die letzten veroeffentlichten Runs ueber alle Sessions und Geraete hinweg.",
    },
    {
      title: "Geraet und Kontext zaehlen",
      body: "Touchscreens, Browser, Eingabemethode, Display-Refresh und Fokus beeinflussen Reaktionszeiten. Deshalb sind Trends auf demselben Geraet besonders aussagekraeftig.",
    },
  ],
  en: [
    {
      title: "Valid score window",
      body: "Only reaction times between 50 and 1000 ms are accepted for the global leaderboard. This keeps accidental taps and implausible outliers out of the board.",
    },
    {
      title: "Separated board views",
      body: "Top 100 shows the best published value per player. Latest 100 shows the most recent published runs across sessions and devices.",
    },
    {
      title: "Device and context matter",
      body: "Touchscreens, browsers, input method, display refresh, and focus all affect reaction time. That is why trends on the same device are especially meaningful.",
    },
  ],
} as const;

export function MethodSection() {
  const { locale } = useLocale();
  const isGerman = locale === "de";
  const highlights = methodHighlights[locale];

  return (
    <section className="section method-section" id="method">
      <div className="container">
        <SectionHeader
          eyebrow={isGerman ? "Methodik" : "Method"}
          title={
            isGerman
              ? "Wie Reaction Run echte Reaktionszeit einordnet."
              : "How Reaction Run puts reaction time into context."
          }
          description={
            isGerman
              ? "Die Seite soll nicht nur einen schnellen Tap messen, sondern das Ergebnis verstaendlich machen. Deshalb erklaeren wir offen, was ein valider Run ist, wie das Board aufgebaut ist und warum Scores je nach Geraet schwanken."
              : "The site is not only meant to capture a quick tap, but to make the result understandable. That is why it explains what counts as a valid run, how the board is structured, and why scores vary by device."
          }
        />

        <div className="method-grid">
          <GlassPanel className="method-article">
            <span className="subtle-pill">{isGerman ? "Messlogik" : "Measurement logic"}</span>
            <h3>
              {isGerman
                ? "Ein Reaction-Test ist nur dann hilfreich, wenn der Kontext klar ist."
                : "A reaction test is only useful when the context is clear."}
            </h3>
            <p>
              {isGerman
                ? "Reaction Run startet jede Runde erst nach einer zufaelligen Verzoegerung, damit kein Rhythmus gelernt werden kann. Zu fruehe Taps werden getrennt erfasst. Fuer das globale Board werden nur plausible Messwerte uebernommen, damit Ausreisser nicht das Ranking oder den Durchschnitt verzerren."
                : "Reaction Run starts each round only after a randomized delay so the user cannot simply learn a rhythm. Early taps are tracked separately. Only plausible measurements are accepted for the global board so outliers do not distort ranking or average pace."}
            </p>
            <p>
              {isGerman
                ? "Zugleich bleibt die Seite bewusst transparent: Ein Wert auf dem Handy ist nicht identisch mit einem Wert auf einem Desktop mit Maus und hoher Bildwiederholrate. Genau deshalb kombiniert Reaction Run Live-Score, Session-Verlauf und globale Vergleiche, statt nur eine einzelne Millisekunden-Zahl zu zeigen."
                : "At the same time, the site stays intentionally transparent: a score on a phone is not identical to a score on a desktop with a mouse and a high refresh rate. That is why Reaction Run combines live score, session history, and global comparison instead of showing just one isolated millisecond number."}
            </p>
          </GlassPanel>

          <div className="method-points">
            {highlights.map((item) => (
              <GlassPanel className="method-point-card" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
