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
  parseDirectory: (directoryPath: string, outputFile?: string) => Promise<string>;
  parseFile: (filePath: string, outputFile?: string) => Promise<string>;
  parse: (css: string, html: string, outputFile?: string) => Promise<string>;
};

declare function ForgeCSS(options?: ForgeCSSOptions): ForgeInstance;

export default ForgeCSS;