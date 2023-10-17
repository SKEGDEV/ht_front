import { createStore, applyMiddleware } from "redux";
import reducer from './reducers';
import { persistReducer, persistStore } from "redux-persist";
import thunk from 'redux-thunk';
import storage from "redux-persist/lib/storage";
const {composeWithDevTools} = require("redux-devtools-extension");

const persistConfig ={
  key:"root",
  debug:true,
  storage,
  blacklist:[
    'lock_ui',
    'rpt',
    'filter'
  ]
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(
  persistedReducer,
  {},
  composeWithDevTools(applyMiddleware(thunk)),
  +window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);

export default store;
