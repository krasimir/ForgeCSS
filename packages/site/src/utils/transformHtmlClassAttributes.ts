export default function transformHtmlClassAttributes(html: string, mapClass: Function) {
  // @ts-ignore
  return html.replace(/\bclass\s*=\s*(["'])(.*?)\1/gs, (m, quote, value) => {
    const next = mapClass(value);
    if (next == null) return "";
    return `class=${quote}${next}${quote}`;
  });
}