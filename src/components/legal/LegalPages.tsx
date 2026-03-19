import type { ReactNode } from "react";
import { Button } from "../Button";
import { GlassPanel } from "../GlassPanel";
import { useMonetization } from "../../state/MonetizationContext";
import {
  adProviderProfile,
  hasLegalPlaceholders,
  infrastructureProfile,
  legalEntity,
  siteLegalProfile,
} from "../../data/legalContent";
import { LegalPageLayout } from "./LegalPageLayout";

function PlaceholderNotice() {
  if (!hasLegalPlaceholders) {
    return null;
  }

  return (
    <GlassPanel className="legal-warning-panel">
      <span className="subtle-pill">Vor Launch ergänzen</span>
      <h2>Einige Pflichtangaben sind noch als Platzhalter markiert.</h2>
      <p>
        Für einen echten Launch musst du vor allem Betreibername, ladungsfähige Anschrift,
        vertretungsberechtigte Person sowie Hosting- und E-Mail-Anbieter konkret ergänzen.
      </p>
    </GlassPanel>
  );
}

function DefinitionList({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <dl className="legal-definition-list">
      {items.map((item) => (
        <div className="legal-definition-row" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function LegalSection({
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

export function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Datenschutz"
      title="Datenschutzhinweise"
      description="Diese Hinweise beschreiben, welche Daten beim Besuch von Reaction Run verarbeitet werden, wofür sie benötigt werden und welche Rechte Nutzerinnen und Nutzer haben."
    >
      <PlaceholderNotice />

      <div className="legal-grid legal-grid-wide">
        <LegalSection title="1. Verantwortlicher">
          <DefinitionList
            items={[
              { label: "Betreiber", value: legalEntity.operatorName },
              { label: "Rechtsform", value: legalEntity.legalForm },
              {
                label: "Anschrift",
                value: `${legalEntity.street}, ${legalEntity.postalCode} ${legalEntity.city}, ${legalEntity.country}`,
              },
              { label: "E-Mail", value: siteLegalProfile.contactEmail },
              { label: "Vertreten durch", value: legalEntity.representative },
            ]}
          />
        </LegalSection>

        <LegalSection title="2. Bereitstellung der Website und Hosting">
          <p>
            Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch erforderliche
            Verbindungsdaten, um die Seite auszuliefern, Angriffe abzuwehren und die Stabilität
            des Angebots sicherzustellen. Dazu koennen insbesondere IP-Adresse, Datum und Uhrzeit,
            angeforderte URL, Referrer, Browser-Typ sowie Systeminformationen gehoeren.
          </p>
          <p>
            Soweit das Hosting ausserhalb des EWR erfolgt, kann eine Uebermittlung in ein Drittland
            stattfinden. In diesem Fall muessen geeignete Garantien fuer das Datenschutzniveau
            bestehen.
          </p>
          <DefinitionList
            items={[
              { label: "Hosting-Anbieter", value: infrastructureProfile.hostingProvider },
              { label: "Hosting-Standort", value: infrastructureProfile.hostingCountry },
              { label: "Speicherdauer", value: infrastructureProfile.serverLogRetention },
              { label: "Rechtsgrundlage", value: "Art. 6 Abs. 1 lit. f DSGVO" },
              { label: "Garantien bei Drittlandtransfer", value: infrastructureProfile.transferSafeguards },
            ]}
          />
        </LegalSection>

        <LegalSection title="3. Lokaler Produktspeicher im Browser">
          <p>
            Reaction Run speichert Teile der Produktfunktion lokal im Browser, damit der
            Reaktionstest, der Nickname, Rangvorschauen sowie die persoenlichen Statistikwerte ueber
            Seitenaufrufe hinweg erhalten bleiben. Diese Informationen bleiben grundsaetzlich auf
            dem Endgeraet des Nutzers, bis sie im Browser geloescht werden.
          </p>
          <DefinitionList
            items={[
              { label: "Zweck", value: "Bereitstellung der vom Nutzer angeforderten Kernfunktionen" },
              { label: "Datenarten", value: "Nickname, lokale Bestwerte, Testverlauf, Einwilligungsstatus" },
              { label: "Rechtsgrundlage", value: "Art. 6 Abs. 1 lit. b DSGVO bzw. berechtigtes Interesse nach lit. f" },
              { label: "Speicherdauer", value: "Bis zur Loeschung durch den Nutzer im Browser" },
            ]}
          />
        </LegalSection>

        <LegalSection title="4. Werbung mit Google AdSense">
          <p>
            Auf getrennten Werbeflaechen kann Werbung ueber {adProviderProfile.providerName}
            eingeblendet werden. Diese Flaechen bleiben ausserhalb des Reaktionstests, der
            Statistik und des Leaderboards positioniert. Werbe-Cookies oder vergleichbare
            Technologien werden erst nach einer ausdruecklichen Einwilligung aktiviert.
          </p>
          <p>
            Google kann dabei eigene Kennungen, Cookies oder aehnliche Speichertechnologien nutzen,
            um Werbung auszuliefern, Frequenzen zu begrenzen oder Betrug zu verhindern. Weitere
            Informationen stellt Google in seiner Datenschutzerklaerung bereit.
          </p>
          <DefinitionList
            items={[
              { label: "Anbieter (EU)", value: adProviderProfile.euProvider },
              { label: "Weiterer Anbieter", value: adProviderProfile.additionalProvider },
              { label: "Zweck", value: "Auslieferung und Finanzierung getrennter Werbeflaechen" },
              { label: "Rechtsgrundlage", value: "Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG" },
              { label: "Weitere Informationen", value: adProviderProfile.privacyUrl },
            ]}
          />
        </LegalSection>

        <LegalSection title="5. Kontaktaufnahme">
          <p>
            Bei einer Kontaktaufnahme per E-Mail werden die uebermittelten Angaben verarbeitet, um
            das Anliegen zu beantworten. Eine Weitergabe erfolgt nur, soweit sie fuer die Bearbeitung
            erforderlich ist.
          </p>
          <DefinitionList
            items={[
              { label: "Kontaktadresse", value: siteLegalProfile.contactEmail },
              { label: "E-Mail-Anbieter", value: infrastructureProfile.emailProvider },
              { label: "Rechtsgrundlage", value: "Art. 6 Abs. 1 lit. b oder lit. f DSGVO" },
            ]}
          />
        </LegalSection>

        <LegalSection title="6. Empfaenger und Drittlandtransfer">
          <p>
            Empfaenger personenbezogener Daten koennen insbesondere Hosting-Anbieter,
            E-Mail-Dienstleister und Werbedienstleister sein. Erfolgt eine Verarbeitung ausserhalb
            des EWR, muessen dafuer ein Angemessenheitsbeschluss oder andere geeignete Garantien
            vorhanden sein.
          </p>
          <p>
            Da die Website nach deinen Angaben ausserhalb der EU gehostet werden soll, muss der
            tatsaechliche Hosting-Anbieter vor dem Launch konkret in diesen Hinweisen benannt
            werden.
          </p>
        </LegalSection>

        <LegalSection title="7. Rechte der betroffenen Personen">
          <ul className="legal-list">
            <li>Recht auf Auskunft ueber verarbeitete personenbezogene Daten</li>
            <li>Recht auf Berichtigung unrichtiger Daten</li>
            <li>Recht auf Loeschung oder Einschraenkung der Verarbeitung</li>
            <li>Recht auf Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO</li>
            <li>Recht auf Datenuebertragbarkeit, soweit anwendbar</li>
            <li>Recht, eine erteilte Einwilligung jederzeit mit Wirkung fuer die Zukunft zu widerrufen</li>
            <li>Beschwerderecht bei einer Datenschutz-Aufsichtsbehoerde</li>
          </ul>
        </LegalSection>
      </div>
    </LegalPageLayout>
  );
}

export function ImprintPage() {
  return (
    <LegalPageLayout
      eyebrow="Impressum"
      title="Anbieterkennzeichnung"
      description="Pflichtangaben gemaess § 5 DDG und, soweit einschlaegig, § 18 Abs. 2 MStV."
    >
      <PlaceholderNotice />

      <div className="legal-grid">
        <LegalSection title="Anbieter">
          <DefinitionList
            items={[
              { label: "Name", value: legalEntity.operatorName },
              { label: "Rechtsform", value: legalEntity.legalForm },
              { label: "Vertretungsberechtigte Person", value: legalEntity.representative },
              {
                label: "Anschrift",
                value: `${legalEntity.street}, ${legalEntity.postalCode} ${legalEntity.city}, ${legalEntity.country}`,
              },
              { label: "E-Mail", value: siteLegalProfile.contactEmail },
              { label: "Telefon", value: legalEntity.phone },
            ]}
          />
        </LegalSection>

        <LegalSection title="Register und Steuern">
          <DefinitionList
            items={[
              { label: "Registergericht", value: legalEntity.registerCourt },
              { label: "Registernummer", value: legalEntity.registerNumber },
              { label: "Umsatzsteuer-ID", value: legalEntity.vatId },
            ]}
          />
        </LegalSection>

        <LegalSection title="Inhaltlich verantwortlich">
          <DefinitionList
            items={[
              { label: "Verantwortlich gemaess § 18 Abs. 2 MStV", value: legalEntity.contentResponsible },
              { label: "Website", value: siteLegalProfile.websiteUrl },
            ]}
          />
        </LegalSection>

        <LegalSection title="Streitbeilegung">
          <p>
            Sofern keine gesetzliche Verpflichtung besteht, kann die Teilnahme an einem
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle ausgeschlossen werden.
            Vor dem Launch sollte geprueft werden, ob fuer den konkreten Betreiber eine Pflicht oder
            Bereitschaftserklaerung aufgenommen werden muss.
          </p>
        </LegalSection>
      </div>
    </LegalPageLayout>
  );
}

export function CookiesPage() {
  const {
    acceptAds,
    adsEnabled,
    adsLaunchState,
    canAskForConsent,
    consent,
    rejectAds,
    resetConsent,
  } = useMonetization();

  const consentLabel =
    consent === "accepted"
      ? "Werbung erlaubt"
      : consent === "rejected"
        ? "Nur notwendige Speicherungen"
        : "Noch keine Auswahl gespeichert";

  const launchLabel =
    adsLaunchState === "ready"
      ? "Optionales Werbe-Setup ist verfuegbar."
      : adsLaunchState === "cmp-required"
        ? "Vor Live-Werbung muss noch eine zertifizierte CMP angebunden werden."
        : adsLaunchState === "site-review-pending"
          ? "Die Werbeeinbindung ist vorbereitet, aber die Website ist noch nicht fuer Live-Auslieferung freigegeben."
          : "Aktuell werden keine optionalen Werbe-Technologien geladen.";

  return (
    <LegalPageLayout
      eyebrow="Cookies"
      title="Cookie-Einstellungen"
      description="Hier koennen Besucher nachvollziehen, welche lokalen Speicherungen Reaction Run verwendet und wie sich optionale Werbeeinwilligungen steuern lassen."
    >
      <div className="legal-grid legal-grid-wide">
        <GlassPanel className="legal-status-panel">
          <div>
            <span className="subtle-pill">Aktueller Status</span>
            <h2>{consentLabel}</h2>
            <p>{launchLabel}</p>
          </div>

          <div className="legal-status-actions">
            <Button onClick={rejectAds} variant="secondary" disabled={!canAskForConsent}>
              Nur notwendige
            </Button>
            <Button onClick={acceptAds} disabled={!canAskForConsent}>
              Werbung erlauben
            </Button>
            <Button onClick={resetConsent} variant="ghost">
              Auswahl zuruecksetzen
            </Button>
          </div>

          <p className="legal-status-note">
            Bereits gesetzte Browser-Cookies oder lokale Speicherungen koennen zusaetzlich ueber die
            Einstellungen des Browsers geloescht werden.
          </p>
        </GlassPanel>

        <LegalSection title="Verwendete Kategorien">
          <div className="cookie-category-list">
            <div className="cookie-category-row">
              <div>
                <strong>Erforderlich / funktional</strong>
                <p>
                  Speichert lokale Reaktionsergebnisse, Session-Zustaende und die Einwilligungswahl
                  im Browser, damit die angeforderte Produktfunktion sauber laeuft.
                </p>
              </div>
              <span className="status-chip status-chip-soft">Immer aktiv</span>
            </div>

            <div className="cookie-category-row">
              <div>
                <strong>Werbung</strong>
                <p>
                  Aktiviert getrennte AdSense-Werbeflaechen und die dazugehoerigen Werbe- oder
                  Frauderkennungs-Technologien erst nach einer ausdruecklichen Einwilligung.
                </p>
              </div>
              <span className="status-chip status-chip-soft">
                {adsEnabled ? "Aktiv" : "Nur mit Einwilligung"}
              </span>
            </div>
          </div>
        </LegalSection>

        <LegalSection title="Wie aendere ich meine Auswahl?">
          <ul className="legal-list">
            <li>Direkt auf dieser Seite ueber die Schaltflaechen fuer Werbeeinwilligung</li>
            <li>Ueber den Cookie-Hinweis, wenn noch keine Auswahl gespeichert wurde</li>
            <li>Durch Loeschen der lokalen Website-Daten im Browser</li>
            <li>Bei Google zusaetzlich ueber {adProviderProfile.adSettingsUrl}</li>
          </ul>
        </LegalSection>

        <LegalSection title="Hinweis zu Cookies und localStorage">
          <p>
            Auf Reaction Run werden nicht nur klassische Cookies, sondern auch lokale Browser-Speicher
            wie localStorage genutzt. Rechtlich ist fuer Nutzer wichtig, dass auch solche
            Endgeraetechnologien unter den Einwilligungs- und Transparenzpflichten fallen koennen.
          </p>
        </LegalSection>
      </div>
    </LegalPageLayout>
  );
}
