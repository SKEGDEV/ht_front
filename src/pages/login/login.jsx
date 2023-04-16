import styles from "./login.module.scss";
import logo_1 from "../../img/logo_1.png";
import { lock_uiAction } from "../../actions/lock_uiActions";
import { useDispatch } from "react-redux";
import { useEffect } from "react";


export default function Login(props) {

  const {login, top_lg} = styles
  const {Component = <></>} = props
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(lock_uiAction({action:1, value:false}));
  },[]);
  return(
    <div className={login}>
     <div className={top_lg}>
       <img src={logo_1} alt="no image"/>
     </div>
     <Component.type/>
    </div>
  );
}



