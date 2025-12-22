export const DEFAULT_FILES = [
  { filename: "page.html", content: `<div class="mt1">Hello world</div>`, selected: true, type: "html" },
  {
    filename: "styles.css",
    content: `mt1 {
  margin-top: 1rem;
}`,
    selected: false,
    type: "css"
  },
  {
    filename: "forgecss.config.json",
    content: `{
  "breakpoints": {
    "desktop": "all and (min-width: 768px)"
  }
}`,
    selected: false,
    type: "javascript"
  }
];