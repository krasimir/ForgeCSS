export default {
  styles: {
    sourceDir: "./src"
  },
  ui: {
    sourceDir: "./src"
  },
  mapping: {
    queries: {
      desktop: { query: "min-width: 768px" }, // desktop
      mobile: { query: "max-width: 768px" } // mobile
    }
  },
  output: './src/forgecss.css'
}