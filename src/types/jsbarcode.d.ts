// jsbarcode ships without types and @types/jsbarcode is not a project dependency,
// so only the parts Boltly uses are declared here.
declare module "jsbarcode" {
  interface JsBarcodeOptions {
    format?: string;
    width?: number;
    height?: number;
    displayValue?: boolean;
    margin?: number;
    background?: string;
    lineColor?: string;
    fontSize?: number;
    valid?: (valid: boolean) => void;
  }
  export default function JsBarcode(
    element: SVGElement | HTMLCanvasElement | HTMLImageElement | string,
    text: string,
    options?: JsBarcodeOptions,
  ): void;
}
