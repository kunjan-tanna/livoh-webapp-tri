import { createStore, applyMiddleware, compose } from "redux";
import createDebounce from "redux-debounced";
import thunk from "redux-thunk";
import { persistStore } from "redux-persist";
import rootReducer from "../reducers/rootReducer";

const middlewares = [thunk, createDebounce()];
const { persistReducer } = require("redux-persist");
const storage = require("redux-persist/lib/storage").default;

const persistConfig = {
  key: "root",
  storage: storage,
  //whitelist:['auth']
  //blacklist: ['customizer','_persist']
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
  persistReducer(persistConfig, rootReducer),
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);
store.__PERSISTOR = persistStore(store);

export { store };
