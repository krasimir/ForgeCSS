export function parseClassValue(input) {
  const s = String(input ?? "").trim();
  let i = 0;

  const isWS = (ch) => ch === " " || ch === "\n" || ch === "\t" || ch === "\r";

  function skipWS() {
    while (i < s.length && isWS(s[i])) i++;
  }

  function parseSequence(stopChar) {
    const nodes = [];
    while (i < s.length) {
      skipWS();
      if (stopChar && s[i] === stopChar) break;
      if (i >= s.length) break;
      nodes.push(parseItem());
    }
    return nodes;
  }

  function readIdentUntilDelimiter() {
    let out = "";
    while (i < s.length) {
      const ch = s[i];
      // stop at whitespace, "(", ")", or ":" (variant label separator)
      if (isWS(ch) || ch === "(" || ch === ")" || ch === ":") break;
      if (ch === "[") break;
      out += ch;
      i++;
    }
    return out.trim();
  }

  function isVariantLabel(str) {
    // keep it strict so random garbage doesn't become a variant
    return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(str);
  }

  function parseItem() {
    skipWS();
    const ch = s[i];

    // Bracket variant: [selector]:payload
    if (ch === "[") {
      const selector = parseBracketContent();
      if (s[i] === ":") {
        i++;
        const payload = parseItem();
        return { type: "variant", selector, payload };
      }
      return { type: "token", value: `[${selector}]` };
    }

    // Read label/name/token (stops before ":" and "(" now)
    const head = readIdentUntilDelimiter();

    // Label variant: hover:..., desktop:..., focus:...
    if (s[i] === ":" && isVariantLabel(head)) {
      i++; // consume ":"
      const payload = parseItem(); // can be token/call/[...]:...
      return { type: "variant", selector: head, payload };
    }

    // Call: name(...)
    if (s[i] === "(" && isCallName(head)) {
      i++; // consume "("
      const args = [];
      while (i < s.length) {
        skipWS();
        if (s[i] === ")") {
          i++;
          break;
        }
        args.push(parseItem());
        skipWS();
        if (s[i] === ",") i++;
      }
      return { type: "call", name: head, args };
    }

    return { type: "token", value: head };
  }



  function parseBracketContent() {
    // assumes s[i] === "["
    i++; // consume "["
    let out = "";
    let bracket = 1;
    let quote = null;

    while (i < s.length) {
      const ch = s[i];

      if (quote) {
        out += ch;
        if (ch === "\\" && i + 1 < s.length) {
          i++;
          out += s[i];
        } else if (ch === quote) {
          quote = null;
        }
        i++;
        continue;
      }

      if (ch === "'" || ch === '"') {
        quote = ch;
        out += ch;
        i++;
        continue;
      }

      if (ch === "[") {
        bracket++;
        out += ch;
        i++;
        continue;
      }

      if (ch === "]") {
        bracket--;
        if (bracket === 0) {
          i++; // consume final "]"
          break;
        }
        out += ch;
        i++;
        continue;
      }

      out += ch;
      i++;
    }

    return out;
  }

  function isCallName(str) {
    // Allow: layout, text, hover, focus_ring, darkMode, etc.
    // Disallow tokens like "mt-2" accidentally becoming calls.
    return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(str);
  }

  const ast = parseSequence(null);
  return ast;
}
