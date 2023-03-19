import styles from "./login.module.scss";
import logo_1 from "../../img/logo_1.png";


export default function Login(props) {

  const {login, top_lg} = styles
  const {Component = <></>} = props

  return(
    <div className={login}>
     <div className={top_lg}>
       <img src={logo_1} alt="no image"/>
     </div>
     <Component.type/>
    </div>
  );
}



