import { createMuiTheme } from "@material-ui/core/styles";
function MyTheme(t) {
  let theme = createMuiTheme({
    palette: {
      type: t == 0 ? "light" : "dark",
      primary: { main: "#FBC91b", contrastText: "#fff" }, // Primary color
      background: { default: t == 0 ? "#EDEFF9" : "#303030" },
      secondary: { main: "#f8a774" }, // secondary color
    },
    typography: {
      useNextVariants: true,
    },
  });

  return theme;
}

export { MyTheme };
