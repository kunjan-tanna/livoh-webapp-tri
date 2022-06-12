import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import history from "../src/util/history";
//redux pkg
import { Provider } from "react-redux";
import { store, persistor } from "./redux/storeConfig/store";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.render(
  <React.StrictMode>
    {/* <App history={history}/> */}
    <Provider store={store}>
      <PersistGate persistor={store.__PERSISTOR} loading={null}>
        <Router history={history}>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
