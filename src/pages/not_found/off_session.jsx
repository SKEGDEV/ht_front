import { useParams, Link } from "react-router-dom"
import bad_session from "../../img/bad_session.jpg";
import styles from './not_found.module.scss';
import { useDispatch } from "react-redux";
import { sessionUserAction } from "../../actions/sessionAction";
import { useEffect } from "react";

export default function Not_session(){
  const {msm} = useParams();
  const {session_container} = styles;
  const dispatch= useDispatch();

  useEffect(()=>{
    dispatch(sessionUserAction({
	    sessionToken:"",
	    sessionName:"",
	    isLogged:false
	  }));
  },[])

  return(
    <div className={session_container}>
     <img src={bad_session} alt="not found"/>
     <h4>{`${atob(msm)} por favor dirijase a: `}<Link to="/">Iniciar sesion</Link></h4>
    </div>
  )
}
