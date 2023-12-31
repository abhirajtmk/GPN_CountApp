import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { SnackbarProvider } from "notistack";

import { PersistGate } from "redux-persist/lib/integration/react";
// @mui
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store, persistor } from "./redux/store";

ReactDOM.render(
	<React.StrictMode>
		<ReduxProvider store={store}>
			<PersistGate
				loading={null}
				persistor={persistor}
			>
				<SnackbarProvider>
					<App />
				</SnackbarProvider>
			</PersistGate>
		</ReduxProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
