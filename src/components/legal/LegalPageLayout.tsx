import type { ReactNode } from "react";
import { Button } from "../Button";
import { goToHomeSection } from "../../lib/appRoute";
import { useLocale } from "../../state/LocaleContext";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalPageLayout({
  eyebrow,
  title,
  description,
  children,
}: LegalPageLayoutProps) {
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
            <Button href="#cookies" variant="secondary">
              {isGerman ? "Cookie-Einstellungen" : "Cookie settings"}
            </Button>
          </div>
        </div>

        <div className="legal-stack">{children}</div>
      </div>
    </section>
  );
}
