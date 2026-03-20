import { GlassPanel } from "../GlassPanel";
import { SectionHeader } from "../SectionHeader";
import { useLocale } from "../../state/LocaleContext";

const faqItems = {
  de: [
    {
      question: "Was ist ein guter Reaktionszeit-Wert?",
      answer:
        "Das haengt stark vom Eingabegeraet ab. Auf Desktop mit Maus liegen starke Werte oft deutlich niedriger als auf dem Handy. Entscheidend ist deshalb nicht nur ein Einzelwert, sondern wie stabil du ueber mehrere valide Runden hinweg bleibst.",
    },
    {
      question: "Warum fuehlt sich Mobile anders an als Desktop?",
      answer:
        "Touchscreens, Browser-Events, die Bildschirmfrequenz und selbst die Haltung des Geraets veraendern die wahrgenommene Reaktionszeit. Ein Handy-Run sollte deshalb zuerst mit anderen Handy-Runs verglichen werden.",
    },
    {
      question: "Warum erscheint ein extrem niedriger Wert nicht im Board?",
      answer:
        "Das globale Leaderboard filtert unplausible Ausreisser und akzeptiert nur valide Reaktionszeiten. So bleibt das Ranking fuer echte Nutzer vergleichbar und wird nicht durch Fehlklicks oder unrealistische Messwerte verzerrt.",
    },
    {
      question: "Warum muss ich auf 'Leaderboard anzeigen' klicken?",
      answer:
        "Der Test selbst bleibt schnell und lokal. Erst mit diesem Schritt wird dein aktueller Bestwert bewusst veroeffentlicht und in das globale Ranking geschrieben. So bleibt klar, welche Runs nur lokal und welche wirklich global sind.",
    },
  ],
  en: [
    {
      question: "What counts as a good reaction-time score?",
      answer:
        "That depends heavily on the input device. Desktop mouse results are often much lower than mobile touch results. That is why a single number matters less than how stable you stay across several valid rounds.",
    },
    {
      question: "Why does mobile feel different from desktop?",
      answer:
        "Touchscreens, browser events, display refresh rate, and even how the device is held can change perceived reaction time. A phone run should therefore first be compared with other phone runs.",
    },
    {
      question: "Why does an extremely low score not show up in the board?",
      answer:
        "The global leaderboard filters implausible outliers and only accepts valid reaction times. This keeps the ranking comparable for real users instead of letting misclicks or unrealistic measurements dominate it.",
    },
    {
      question: "Why do I need to click 'Show leaderboard'?",
      answer:
        "The test itself stays fast and local. Only that action publishes your current best value and writes it into the global ranking. This keeps it clear which runs are local only and which runs are truly global.",
    },
  ],
} as const;

export function FaqSection() {
  const { locale } = useLocale();
  const isGerman = locale === "de";
  const items = faqItems[locale];

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <SectionHeader
          eyebrow="FAQ"
          title={
            isGerman
              ? "Antworten auf die typischen Fragen rund um den Test."
              : "Answers to the most common questions around the test."
          }
          description={
            isGerman
              ? "Diese Hinweise helfen dabei, Scores richtig einzuordnen und das globale Board fair zu verstehen. Genau diese Art von Kontext macht aus einem Tool ein belastbares Produkt."
              : "These notes help interpret scores correctly and understand the global board in a fair way. That kind of context is what turns a simple tool into a reliable product."
          }
        />

        <div className="faq-grid">
          {items.map((item) => (
            <GlassPanel className="faq-card" key={item.question}>
              <strong>{item.question}</strong>
              <p>{item.answer}</p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
