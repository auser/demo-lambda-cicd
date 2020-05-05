import {
  themes
} from "mdx-deck";

const rootTheme = themes.poppins;
export default {
  ...rootTheme,
  ...themes.prism,
  googleFont: "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;1,300;1,400&family=Roboto:wght@100;300;400;500;700&display=swap",
  fonts: {
    body: '"Nunito sans", Roboto, sans-serif',
    monospace: '"Roboto Mono", monospace',
    heading: 'Roboto, sans-serif"',
  },
  fontSize: 4,
  styles: {
    Slide: {
      padding: "0px",
    },
  },
  colors: {
    ...rootTheme.colors,
    background: "#1B2547",
  },
};
