export const siteLegalProfile = {
  brandName: "Reaction Run",
  domain: "reactionrun.com",
  websiteUrl: "https://reactionrun.com",
  contactEmail: "kontakt@webentwicklungthomsen.de",
};

export const legalEntity = {
  operatorName: "Webentwicklung Thomsen",
  legalForm: "",
  representative: "",
  street: "Westerende",
  postalCode: "25884",
  city: "Norstedt",
  country: "Germany",
  phone: "",
  registerCourt: "",
  registerNumber: "",
  vatId: "",
  contentResponsible: "",
};

export const infrastructureProfile = {
  hostingProvider: "",
  hostingCountry: "Outside the EU / EEA",
  serverLogRetention:
    "Server log data is stored only as long as technically required for secure and stable operation.",
  emailProvider: "",
  transferSafeguards:
    "Where providers process data in third countries, transfers are based on an adequacy decision or on Standard Contractual Clauses where required.",
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
