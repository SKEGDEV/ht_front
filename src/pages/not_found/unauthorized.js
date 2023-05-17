import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { consume_api } from "../../utils/consume_api";

export default function isAuth(type){
  const {session:{isLogged, stateSessionToken}} = useSelector(state => state);
  const navigate = useNavigate();
  const request = new consume_api("/verify-session", {}, stateSessionToken);
  const response = request.get_petitions();
}
