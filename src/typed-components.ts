import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule } from "styled-components";
// Styled-Components테마 설정
// Styled-Components API 참조
// injectGlobal 대신 createGlobalStyle로 사용

interface IThemeInterface {
    blueColor: string;
    greyColor: string;
}

const {
    default: styled, css, createGlobalStyle, keyframes, ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<IThemeInterface>;


export { css, createGlobalStyle, keyframes, ThemeProvider };
export default styled;
