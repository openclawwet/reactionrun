import type { ReactNode } from "react";
import { Button } from "../Button";
import { GlassPanel } from "../GlassPanel";
import {
  adProviderProfile,
  infrastructureProfile,
  legalEntity,
  siteLegalProfile,
} from "../../data/legalContent";
import { useLocale } from "../../state/LocaleContext";
import { useMonetization } from "../../state/MonetizationContext";
import { LegalPageLayout } from "./LegalPageLayout";

function DefinitionList({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  const visibleItems = items.filter((item) => item.value.trim().length > 0);

  return (
    <dl className="legal-definition-list">
      {visibleItems.map((item) => (
        <div className="legal-definition-row" key={`${item.label}-${item.value}`}>
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
  const { locale } = useLocale();
  const isGerman = locale === "de";
  const address = `${legalEntity.street}, ${legalEntity.postalCode} ${legalEntity.city}, ${
    isGerman ? "Deutschland" : legalEntity.country
  }`;

  return (
    <LegalPageLayout
      eyebrow={isGerman ? "Datenschutz" : "Privacy"}
      title={isGerman ? "Datenschutzhinweise" : "Privacy Policy"}
      description={
        isGerman
          ? "Diese Hinweise erklaeren, welche Daten bei der Nutzung von Reaction Run verarbeitet werden, zu welchen Zwecken dies geschieht und welche Rechte betroffene Personen haben."
          : "These notices explain which data may be processed when using Reaction Run, for which purposes this happens, and which rights data subjects have."
      }
    >
      <div className="legal-grid legal-grid-wide">
        <LegalSection title={isGerman ? "1. Verantwortlicher" : "1. Controller"}>
          <DefinitionList
            items={[
              { label: isGerman ? "Betreiber" : "Operator", value: legalEntity.operatorName },
              {
                label: isGerman ? "Rechtsform" : "Legal form",
                value: legalEntity.legalForm,
              },
              { label: isGerman ? "Anschrift" : "Address", value: address },
              { label: "E-Mail", value: siteLegalProfile.contactEmail },
              {
                label: isGerman ? "Vertreten durch" : "Represented by",
                value: legalEntity.representative,
              },
            ]}
          />
        </LegalSection>

        <LegalSection title={isGerman ? "2. Hosting und technische Bereitstellung" : "2. Hosting and technical delivery"}>
          <p>
            {isGerman
              ? "Beim Aufruf der Website werden technisch notwendige Verbindungsdaten verarbeitet, um die Seite auszuliefern, die Sicherheit zu gewaehrleisten und Missbrauch zu verhindern. Dazu koennen insbesondere IP-Adresse, Datum und Uhrzeit, angeforderte Inhalte, Referrer, Browsertyp und Betriebssystem gehoeren."
              : "When this website is accessed, technically necessary connection data may be processed in order to deliver the site, ensure security, and prevent misuse. This may include the IP address, date and time, requested resources, referrer, browser type, and operating system."}
          </p>
          <p>
            {isGerman
              ? "Die Website ist fuer ein Hosting ausserhalb der EU bzw. des EWR vorbereitet. Soweit dabei Drittlandtransfers stattfinden, werden dafuer die jeweils erforderlichen Garantien herangezogen."
              : "The website is prepared for hosting outside the EU / EEA. Where this results in transfers to third countries, the legally required safeguards are used."}
          </p>
          <DefinitionList
            items={[
              {
                label: isGerman ? "Hosting-Anbieter" : "Hosting provider",
                value: infrastructureProfile.hostingProvider,
              },
              {
                label: isGerman ? "Hosting-Standort" : "Hosting location",
                value: isGerman
                  ? "Ausserhalb der EU / des EWR"
                  : infrastructureProfile.hostingCountry,
              },
              {
                label: isGerman ? "Speicherdauer" : "Retention",
                value: isGerman
                  ? "Server-Logs werden nur so lange gespeichert, wie dies technisch fuer einen sicheren und stabilen Betrieb erforderlich ist."
                  : infrastructureProfile.serverLogRetention,
              },
              {
                label: isGerman ? "Rechtsgrundlage" : "Legal basis",
                value: "Art. 6(1)(f) GDPR",
              },
              {
                label: isGerman ? "Garantien bei Drittlandtransfer" : "Transfer safeguards",
                value: isGerman
                  ? "Soweit Anbieter Daten in Drittlaendern verarbeiten, erfolgt dies auf Grundlage eines Angemessenheitsbeschlusses oder von Standardvertragsklauseln, soweit erforderlich."
                  : infrastructureProfile.transferSafeguards,
              },
            ]}
          />
        </LegalSection>

        <LegalSection title={isGerman ? "3. Lokale Speicherung im Browser" : "3. Local browser storage"}>
          <p>
            {isGerman
              ? "Reaction Run speichert Teile der Produktfunktion lokal im Browser, damit Reaktionsergebnisse, Session-Zustaende, Nickname und Cookie-Auswahl zwischen Seitenaufrufen erhalten bleiben. Diese Daten verbleiben grundsaetzlich auf dem Endgeraet, bis sie im Browser geloescht werden."
              : "Reaction Run stores parts of the product state locally in the browser so reaction results, session state, nickname, and cookie preferences remain available between visits. These data generally remain on the device until they are deleted in the browser."}
          </p>
          <DefinitionList
            items={[
              {
                label: isGerman ? "Zweck" : "Purpose",
                value: isGerman
                  ? "Bereitstellung der vom Nutzer angeforderten Kernfunktion"
                  : "Providing the core functionality requested by the visitor",
              },
              {
                label: isGerman ? "Datenarten" : "Data types",
                value: isGerman
                  ? "Nickname, lokale Bestwerte, Testverlauf, Session-Zustaende, Cookie-Auswahl"
                  : "Nickname, local best scores, test history, session states, cookie choice",
              },
              {
                label: isGerman ? "Rechtsgrundlage" : "Legal basis",
                value: "Section 25(2) no. 2 TDDDG, Art. 6(1)(b) GDPR / Art. 6(1)(f) GDPR",
              },
              {
                label: isGerman ? "Speicherdauer" : "Retention",
                value: isGerman
                  ? "Bis zur Loeschung durch den Nutzer im Browser"
                  : "Until deleted by the visitor in the browser",
              },
            ]}
          />
        </LegalSection>

        <LegalSection title={isGerman ? "4. Leaderboard und freiwillige Score-Uebermittlung" : "4. Leaderboard and voluntary score submission"}>
          <p>
            {isGerman
              ? "Wenn ein Besucher seinen Score aktiv an das Leaderboard sendet, werden die dafuer benoetigten Angaben verarbeitet. Dazu gehoeren insbesondere Nickname, Tag, Region, Bestwert, Durchschnitt, Rundenanzahl und eine Session-Kennung."
              : "When a visitor actively submits a score to the leaderboard, the data required for that submission are processed. This may include nickname, tag, region, best score, average score, round count, and a session identifier."}
          </p>
          <p>
            {isGerman
              ? "Ohne aktive Uebermittlung kann die Seite weiterhin lokal genutzt werden. Die Live-Ranking-Funktion ist damit freiwillig."
              : "Without an active submission, the product can continue to be used locally. The live leaderboard is therefore an optional feature."}
          </p>
          <DefinitionList
            items={[
              {
                label: isGerman ? "Zweck" : "Purpose",
                value: isGerman
                  ? "Anzeige und Verwaltung freiwillig uebermittelter Scores"
                  : "Display and handling of voluntarily submitted scores",
              },
              {
                label: isGerman ? "Rechtsgrundlage" : "Legal basis",
                value: "Art. 6(1)(b) GDPR",
              },
            ]}
          />
        </LegalSection>

        <LegalSection title={isGerman ? "5. Werbung mit Google AdSense" : "5. Advertising via Google AdSense"}>
          <p>
            {isGerman
              ? "Reaction Run nutzt getrennte Werbeflaechen fuer Google AdSense. Werbe-Cookies oder vergleichbare Technologien werden erst nach einer ausdruecklichen Einwilligung geladen. Test, Statistik und Leaderboard bleiben optisch und funktional vom Werbebereich getrennt."
              : "Reaction Run uses separated ad surfaces for Google AdSense. Advertising cookies or similar technologies are only loaded after explicit consent. The test, statistics, and leaderboard remain visually and functionally separated from the advertising areas."}
          </p>
          <DefinitionList
            items={[
              {
                label: isGerman ? "Anbieter (EU)" : "Provider (EU)",
                value: adProviderProfile.euProvider,
              },
              {
                label: isGerman ? "Weiterer Anbieter" : "Additional provider",
                value: adProviderProfile.additionalProvider,
              },
              {
                label: isGerman ? "Zweck" : "Purpose",
                value: isGerman
                  ? "Finanzierung getrennter Werbeflaechen"
                  : "Financing separated advertising surfaces",
              },
              {
                label: isGerman ? "Rechtsgrundlage" : "Legal basis",
                value: "Art. 6(1)(a) GDPR, Section 25(1) TDDDG",
              },
              {
                label: isGerman ? "Weitere Informationen" : "Further information",
                value: adProviderProfile.privacyUrl,
              },
            ]}
          />
        </LegalSection>

        <LegalSection title={isGerman ? "6. Kontaktaufnahme" : "6. Contact"}>
          <p>
            {isGerman
              ? "Wenn du per E-Mail Kontakt aufnimmst, werden die uebermittelten Angaben verarbeitet, um deine Anfrage zu beantworten."
              : "If you contact us by email, the submitted information is processed to answer the request."}
          </p>
          <DefinitionList
            items={[
              { label: "E-Mail", value: siteLegalProfile.contactEmail },
              {
                label: isGerman ? "E-Mail-Anbieter" : "Mail provider",
                value: infrastructureProfile.emailProvider,
              },
              {
                label: isGerman ? "Rechtsgrundlage" : "Legal basis",
                value: "Art. 6(1)(b) GDPR / Art. 6(1)(f) GDPR",
              },
            ]}
          />
        </LegalSection>

        <LegalSection title={isGerman ? "7. Rechte der betroffenen Personen" : "7. Data subject rights"}>
          <ul className="legal-list">
            {(isGerman
              ? [
                  "Recht auf Auskunft ueber verarbeitete personenbezogene Daten",
                  "Recht auf Berichtigung unrichtiger Daten",
                  "Recht auf Loeschung oder Einschraenkung der Verarbeitung",
                  "Recht auf Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO",
                  "Recht auf Datenuebertragbarkeit, soweit anwendbar",
                  "Recht auf Widerruf erteilter Einwilligungen fuer die Zukunft",
                  "Beschwerderecht bei einer Datenschutzaufsichtsbehoerde",
                ]
              : [
                  "Right of access to processed personal data",
                  "Right to rectification of inaccurate data",
                  "Right to erasure or restriction of processing",
                  "Right to object to processing based on Art. 6(1)(f) GDPR",
                  "Right to data portability where applicable",
                  "Right to withdraw consent with future effect",
                  "Right to lodge a complaint with a supervisory authority",
                ]
            ).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </LegalSection>
      </div>
    </LegalPageLayout>
  );
}

export function ImprintPage() {
  const { locale } = useLocale();
  const isGerman = locale === "de";
  const address = `${legalEntity.street}, ${legalEntity.postalCode} ${legalEntity.city}, ${
    isGerman ? "Deutschland" : legalEntity.country
  }`;

  return (
    <LegalPageLayout
      eyebrow={isGerman ? "Impressum" : "Imprint"}
      title={isGerman ? "Anbieterkennzeichnung" : "Legal Notice"}
      description={
        isGerman
          ? "Pflichtangaben gemaess § 5 DDG und, soweit einschlaegig, § 18 Abs. 2 MStV."
          : "Mandatory provider information according to Section 5 DDG and, where applicable, Section 18(2) MStV."
      }
    >
      <div className="legal-grid">
        <LegalSection title={isGerman ? "Anbieter" : "Provider"}>
          <DefinitionList
            items={[
              { label: isGerman ? "Name" : "Name", value: legalEntity.operatorName },
              {
                label: isGerman ? "Rechtsform" : "Legal form",
                value: legalEntity.legalForm,
              },
              {
                label: isGerman ? "Vertretungsberechtigte Person" : "Represented by",
                value: legalEntity.representative,
              },
              { label: isGerman ? "Anschrift" : "Address", value: address },
              { label: "E-Mail", value: siteLegalProfile.contactEmail },
            ]}
          />
        </LegalSection>

        <LegalSection title={isGerman ? "Inhaltlich verantwortlich" : "Content responsibility"}>
          <DefinitionList
            items={[
              {
                label: isGerman
                  ? "Verantwortlich gemaess § 18 Abs. 2 MStV"
                  : "Responsible under Section 18(2) MStV",
                value: legalEntity.contentResponsible,
              },
              { label: isGerman ? "Website" : "Website", value: siteLegalProfile.websiteUrl },
            ]}
          />
        </LegalSection>

        <LegalSection title={isGerman ? "Register und Steuern" : "Register and tax information"}>
          <p>
            {isGerman
              ? "Soweit keine Handelsregistereintragung, Umsatzsteuer-ID oder sonstige Registerdaten bestehen oder angegeben wurden, werden diese hier derzeit nicht ausgewiesen."
              : "To the extent no commercial register entry, VAT ID, or other register information exists or has been provided, these details are not listed here at this time."}
          </p>
        </LegalSection>

        <LegalSection title={isGerman ? "Streitbeilegung" : "Dispute resolution"}>
          <p>
            {isGerman
              ? "Es besteht weder eine Verpflichtung noch eine Bereitschaft, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
              : "There is no obligation and no willingness to participate in dispute resolution proceedings before a consumer arbitration board."}
          </p>
        </LegalSection>
      </div>
    </LegalPageLayout>
  );
}

export function CookiesPage() {
  const { locale } = useLocale();
  const isGerman = locale === "de";
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
      ? isGerman
        ? "Werbung erlaubt"
        : "Advertising allowed"
      : consent === "rejected"
        ? isGerman
          ? "Nur notwendige Speicherungen"
          : "Necessary storage only"
        : isGerman
          ? "Noch keine Auswahl gespeichert"
          : "No choice stored yet";

  const launchLabel =
    adsLaunchState === "ready"
      ? isGerman
        ? "Optionales Werbe-Setup ist verfuegbar."
        : "Optional advertising setup is available."
      : adsLaunchState === "cmp-required"
        ? isGerman
          ? "Vor Live-Werbung muss noch eine zertifizierte CMP angebunden werden."
          : "A certified CMP still needs to be connected before live advertising can run."
        : adsLaunchState === "site-review-pending"
          ? isGerman
            ? "Die Werbeeinbindung ist vorbereitet, aber die Website ist noch nicht fuer Live-Auslieferung freigegeben."
            : "The advertising setup is prepared, but the site is not yet approved for live serving."
          : isGerman
            ? "Aktuell werden keine optionalen Werbe-Technologien geladen."
            : "No optional advertising technologies are currently being loaded.";

  return (
    <LegalPageLayout
      eyebrow="Cookies"
      title={isGerman ? "Cookie-Einstellungen" : "Cookie Settings"}
      description={
        isGerman
          ? "Hier koennen Besucher nachvollziehen, welche Speicherungen Reaction Run nutzt und wie sich optionale Werbeeinwilligungen steuern lassen."
          : "This page explains which storage technologies Reaction Run uses and how optional advertising consent can be controlled."
      }
    >
      <div className="legal-grid legal-grid-wide">
        <GlassPanel className="legal-status-panel">
          <div>
            <span className="subtle-pill">{isGerman ? "Aktueller Status" : "Current status"}</span>
            <h2>{consentLabel}</h2>
            <p>{launchLabel}</p>
          </div>

          <div className="legal-status-actions">
            <Button onClick={rejectAds} variant="secondary" disabled={!canAskForConsent}>
              {isGerman ? "Nur notwendige" : "Necessary only"}
            </Button>
            <Button onClick={acceptAds} disabled={!canAskForConsent}>
              {isGerman ? "Werbung erlauben" : "Allow advertising"}
            </Button>
            <Button onClick={resetConsent} variant="ghost">
              {isGerman ? "Auswahl zuruecksetzen" : "Reset choice"}
            </Button>
          </div>

          <p className="legal-status-note">
            {isGerman
              ? "Bereits gesetzte Browser-Cookies oder lokale Speicherungen koennen zusaetzlich direkt ueber die Browsereinstellungen geloescht werden."
              : "Cookies or local storage entries that were already set can additionally be deleted in the browser settings."}
          </p>
        </GlassPanel>

        <LegalSection title={isGerman ? "Verwendete Kategorien" : "Categories in use"}>
          <div className="cookie-category-list">
            <div className="cookie-category-row">
              <div>
                <strong>{isGerman ? "Erforderlich / funktional" : "Necessary / functional"}</strong>
                <p>
                  {isGerman
                    ? "Speichert lokale Reaktionsergebnisse, Session-Zustaende und die Cookie-Auswahl im Browser, damit die angeforderte Produktfunktion funktioniert."
                    : "Stores local reaction results, session states, and the cookie choice in the browser so the requested product functionality works properly."}
                </p>
              </div>
              <span className="status-chip status-chip-soft">
                {isGerman ? "Immer aktiv" : "Always active"}
              </span>
            </div>

            <div className="cookie-category-row">
              <div>
                <strong>{isGerman ? "Werbung" : "Advertising"}</strong>
                <p>
                  {isGerman
                    ? "Aktiviert getrennte AdSense-Werbeflaechen und die dafuer benoetigten Werbe- oder Fraud-Erkennungs-Technologien erst nach ausdruecklicher Einwilligung."
                    : "Enables separated AdSense ad placements and the related advertising or fraud-detection technologies only after explicit consent."}
                </p>
              </div>
              <span className="status-chip status-chip-soft">
                {adsEnabled
                  ? isGerman
                    ? "Aktiv"
                    : "Active"
                  : isGerman
                    ? "Nur mit Einwilligung"
                    : "Consent required"}
              </span>
            </div>
          </div>
        </LegalSection>

        <LegalSection title={isGerman ? "Wie aendere ich meine Auswahl?" : "How can I change my choice?"}>
          <ul className="legal-list">
            {(isGerman
              ? [
                  "Direkt auf dieser Seite ueber die Consent-Schaltflaechen",
                  "Ueber den Cookie-Hinweis, solange noch keine Auswahl gespeichert wurde",
                  "Durch Loeschen der lokalen Website-Daten im Browser",
                  `Zusatzlich bei Google ueber ${adProviderProfile.adSettingsUrl}`,
                ]
              : [
                  "Directly on this page via the consent controls",
                  "Via the cookie notice while no choice has been stored yet",
                  "By deleting local website data in the browser",
                  `Additionally via Google at ${adProviderProfile.adSettingsUrl}`,
                ]
            ).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection title={isGerman ? "Hinweis zu Cookies und localStorage" : "Note on cookies and localStorage"}>
          <p>
            {isGerman
              ? "Reaction Run verwendet nicht nur klassische Cookies, sondern auch localStorage im Browser. Auch solche Endgeraetechnologien koennen unter Einwilligungs- und Transparenzpflichten fallen."
              : "Reaction Run does not rely on classic cookies only. It also uses browser localStorage. Such end-device technologies can equally be subject to transparency and consent requirements."}
          </p>
        </LegalSection>
      </div>
    </LegalPageLayout>
  );
}
