import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envFiles = [".env", ".env.local", ".env.production", ".env.production.local"];

const loadedEnv = { ...process.env };

for (const fileName of envFiles) {
  const filePath = path.join(root, fileName);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  const source = fs.readFileSync(filePath, "utf8");

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    loadedEnv[key] = value;
  }
}

const clientId = loadedEnv.VITE_ADSENSE_CLIENT_ID?.trim() || "";
const publisherId = /^ca-pub-\d+$/.test(clientId) ? clientId.replace(/^ca-/, "") : "";

const publicDir = path.join(root, "public");
const adsTxtPath = path.join(publicDir, "ads.txt");

fs.mkdirSync(publicDir, { recursive: true });

const existingAdsTxt = fs.existsSync(adsTxtPath) ? fs.readFileSync(adsTxtPath, "utf8") : "";
const existingPublisherLine = existingAdsTxt
  .split(/\r?\n/)
  .find((line) => /^google\.com,\s*pub-\d+,\s*DIRECT,\s*f08c47fec0942fa0$/i.test(line.trim()));

const adsTxtContent = publisherId
  ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
  : existingPublisherLine
    ? `${existingPublisherLine.trim()}\n`
    : [
        "# Replace this placeholder before launching AdSense.",
        "# Expected format:",
        "# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0",
        "",
      ].join("\n");

fs.writeFileSync(adsTxtPath, adsTxtContent, "utf8");

const modeLabel = publisherId
  ? "Generated"
  : existingPublisherLine
    ? "Reused existing"
    : "Prepared placeholder";

console.log(`[adsense] ${modeLabel} ${path.relative(root, adsTxtPath)}`);
