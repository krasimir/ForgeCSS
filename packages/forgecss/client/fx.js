export default function fx(classes) {
  return classes
    .split(" ")
    .map((className) => {
      const [label, rest] = splitClassName(className);
      if (!label) return rest;
      return rest
        .split(",")
        .map((cls) => `${normalizeLabel(label)}_${cls}`)
        .filter(Boolean)
        .join(" ");
    })
    .filter(Boolean)
    .join(" ");
};
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
  let normalized = label;
  normalized = normalized.trim();
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    normalized = normalized.slice(1, -1);
  }
  normalized = normalized.replace(/[:|&]/g, "_");
  return normalized;
}

