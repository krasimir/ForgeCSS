export default function fx(classes) {
  return parseClass(classes).map((className) => {
      const [label, rest] = splitClassName(className);
      if (!label || label === "[true]") return rest;
      if (label === "[false]") return false;
      return rest
        .split(",")
        .map((cls) => `${label}:${cls}`)
        .join(" ");
    })
    .filter(Boolean)
    .join(" ");
}
export function splitClassName(label) {
  const lastColonIndex = label.lastIndexOf(":");
  if (lastColonIndex === -1) {
    return [null, label];
  }
  const prefix = label.slice(0, lastColonIndex);
  const rest = label.slice(lastColonIndex + 1);
  return [prefix, rest];
}

export function normalizeLabel(label) {
  let normalized = label.trim();
  normalized = normalized.replace(/[^a-zA-Z0-9_-]/g, (m) => "\\" + m);
  return normalized;
}

export function parseClass(str) {
  const out = [];
  let buf = "";

  let depth = 0;
  let quote = null;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (depth > 0) {
      if (quote) {
        buf += ch;
        if (ch === quote && str[i - 1] !== "\\") quote = null;
        continue;
      } else if (ch === "'" || ch === '"') {
        quote = ch;
        buf += ch;
        continue;
      }
    }
    if (ch === "[") {
      depth++;
      buf += ch;
      continue;
    }
    if (ch === "]" && depth > 0) {
      depth--;
      buf += ch;
      continue;
    }
    if (depth === 0 && /\s/.test(ch)) {
      if (buf) out.push(buf);
      buf = "";
      while (i + 1 < str.length && /\s/.test(str[i + 1])) i++;
      continue;
    }
    buf += ch;
  }

  if (buf) out.push(buf);
  return out;
}

