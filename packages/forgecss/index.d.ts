export type ForgeCSSOptions = {
  inventoryFiles?: string[];
  usageFiles?: string[];
  usageAttributes?: string[];
  mapping?: {
    queries?: {
      [key: string]: string
    };
  };
};

export type ForgeInstance = {
  parseDirectory: (options: { dir: string; output?: string }) => Promise<string>;
  parseFile: (options: { file: string; output?: string }) => Promise<string>;
  parse: (options: { css: string; html?: string; jsx?: string; output?: string }) => Promise<string>;
};

declare function ForgeCSS(options?: ForgeCSSOptions): ForgeInstance;

export default ForgeCSS;