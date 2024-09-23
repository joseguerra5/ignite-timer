import "styled-components"
import { defaultTheme } from "../styles/themes/default";

//guardando valor inferido pelo TS em uma variável
type ThemeType = typeof defaultTheme

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}