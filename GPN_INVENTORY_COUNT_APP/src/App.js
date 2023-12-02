import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./mainpage";
import "./app.css";
import { grey } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: grey[900],
		},
	},
});

// function App() {
//   return <ThemeProvider theme={theme}>...</ThemeProvider>;

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route
				path="*"
				element={
					<ThemeProvider theme={theme}>
						<MainPage />
					</ThemeProvider>
				}
			></Route>
		</Routes>
	</BrowserRouter>
);

export default App;
