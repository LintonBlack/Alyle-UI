import { InjectionToken } from '@angular/core';

export const THEME_VARIABLES = new InjectionToken<PaletteVariables>('ly.theme.variables');
export const IS_CORE_THEME = new InjectionToken<true>('ly.is.root');

export interface Default {
  [key: string]: any;
}
// export class <deprecated>ThemeVariables {
//   /** Theme name */
//   name: string;
//   primary?: PaletteVariables;
//   accent?: PaletteVariables;
//   /** warn or error color */
//   warn?: PaletteVariables;
//   scheme?: string;
//   colorSchemes?: {
//     [key: string]: ColorScheme
//   };
//   [key: string]: any;

// }

export interface PaletteVariables {
  default?: string;
  contrast?: string;
  [key: string]: string;
}

export interface ColorScheme {
  background?: {
    default?: string,
    paper?: string,
    [key: string]: any;
  };
  text?: {
    default: string,
    primary?: string,
    secondary?: string,
    disabled?: string,
    hint?: string,
    [key: string]: any;
  };
  divider?: string;
  /** Components variables */
  colorShadow?: string;
  bar?: string;
  input?: {
    label?: string,
    underline?: string
  };
  [key: string]: any;
}
