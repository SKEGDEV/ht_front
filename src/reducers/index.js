import { combineReducers } from "redux";
import sessionReducer from "./sessionReducer";
import lock_UIReducer from "./lock_ui";
import funcionalityReducer from "./navigationReducer";
import id_Reducer from "./id_reducer";


export default combineReducers({
  session: sessionReducer,
  lock_ui: lock_UIReducer,
  navigation: funcionalityReducer,
  search_id: id_Reducer
})
