import { useState, useEffect } from "react";

import "./App.css";
import Home from "./components/home";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { MyTheme } from "./theme/styles.jsx";

function App() {
  const [theme, setTheme] = useState(0);

  useEffect(() => {
    const t = window.localStorage.getItem("theme");
    if (t != null) {
      setTheme(t);
    }
  }, []);

  const changeTheme = () => {
    window.localStorage.setItem("theme", theme === 1 ? 0 : 1);
    setTheme(theme === 1 ? 0 : 1);
  };

  return (
    <MuiThemeProvider theme={MyTheme(theme)}>
      <SnackbarProvider
        preventDuplicate
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        maxSnack={1}
      >
        <Home changeTheme={changeTheme} />
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

export default App;
