export const siteLegalProfile = {
  brandName: "Reaction Run",
  domain: "reactionrun.com",
  websiteUrl: "https://reactionrun.com",
  contactEmail: "team@reactionrun.com",
};

export const legalEntity = {
  operatorName: "[Bitte Betreibername ergänzen]",
  legalForm: "[Bitte Rechtsform ergänzen]",
  representative: "[Bitte vertretungsberechtigte Person ergänzen]",
  street: "[Bitte Straße und Hausnummer ergänzen]",
  postalCode: "[Bitte PLZ ergänzen]",
  city: "[Bitte Ort ergänzen]",
  country: "Deutschland",
  phone: "[Optional: Telefonnummer ergänzen]",
  registerCourt: "[Falls vorhanden: Registergericht ergänzen]",
  registerNumber: "[Falls vorhanden: Registernummer ergänzen]",
  vatId: "[Falls vorhanden: USt-IdNr. ergänzen]",
  contentResponsible: "[Bitte verantwortliche Person nach § 18 Abs. 2 MStV ergänzen]",
};

export const infrastructureProfile = {
  hostingProvider: "[Bitte Hosting-Anbieter ergänzen]",
  hostingCountry: "[Bitte Land des Hostings ergänzen]",
  serverLogRetention: "[Bitte Speicherdauer der Server-Logs ergänzen]",
  emailProvider: "[Bitte E-Mail-Anbieter ergänzen]",
  transferSafeguards:
    "Je nach Anbieter z. B. ein Angemessenheitsbeschluss oder EU-Standardvertragsklauseln.",
};

export const adProviderProfile = {
  providerName: "Google AdSense",
  euProvider: "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland",
  additionalProvider: "Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
  privacyUrl: "https://policies.google.com/privacy",
  adSettingsUrl: "https://adssettings.google.com/",
};

const placeholderPattern = /^\[.*\]$/;

export const hasLegalPlaceholders = [
  ...Object.values(legalEntity),
  ...Object.values(infrastructureProfile),
].some((value) => placeholderPattern.test(value));
