import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { navigation_Actions } from "../../actions/navigationActions";
import { lock_uiAction } from "../../actions/lock_uiActions";
import { id_Action } from "../../actions/id_actions";
import { useEffect, useState } from "react";
import { consume_api } from "../../utils/consume_api";
import {HiClipboardCheck} from 'react-icons/hi';
import {CgMathMinus,CgMathPlus} from 'react-icons/cg';
import styles from './activities.module.scss';

export default function Activities(){
  const [crooms, setCrooms] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {session:{stateSessionToken}} = useSelector(state=>state);
  const {crom_container, crom_item, i_top, i_bottom} = styles;

  const get_crooms = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api("/classroom/get-classrooms", {}, stateSessionToken);
    const response = await request.get_petitions();
    if(response["msm"]){
      dispatch(lock_uiAction({action:1, value:false}));
      setCrooms([]);
      return;
    }
    setCrooms(response);
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}));},500);
  }

  const goto_getclist = (number, id)=>{
    dispatch(id_Action(id));
    localStorage.setItem("code", "");
    navigate(`/Classroms/select-clist/${btoa(number)}/${btoa(2)}`);
  }
  
  useEffect(()=>{
    dispatch(navigation_Actions(4));
    get_crooms();
  },[])
  return(
    <div className={crom_container}>
    {crooms.map(d=>(
     <div key={d[0]} className={crom_item}>
       <div className={i_top}>
         <h4>{d[1]}</h4>
       </div>
       <div className={i_bottom}>
        {
	  d[2] !== "unidad"?
	  <button onClick={()=>{goto_getclist(1, d[0]);}}>1</button>:
	  <>
	   <button onClick={()=>{goto_getclist(1, d[0]);}}>1</button>
	   <button onClick={()=>{goto_getclist(2, d[0]);}}>2</button>
	   <button onClick={()=>{goto_getclist(3, d[0]);}}>3</button>
	   <button onClick={()=>{goto_getclist(4, d[0]);}}>4</button>
	  </>
        }
       </div>
     </div>
    ))}
    </div>
  );
}

export function Get_activities(){
  const {u_number} = useParams();
  const {session:{stateSessionToken}, search_id:{search_id}} = useSelector(state=>state);
  const [activities, setActivities] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {crom_container, activity_item, a_left, a_right} = styles;

  const get_activities = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const last_id = localStorage.getItem("code");
    var url = ""
    last_id != "" ? url=`/activity/get-activities/${last_id}/${atob(u_number)}`:url=`/activity/get-activities/${search_id}/${atob(u_number)}` 
    last_id != "" ? dispatch(id_Action(last_id)):dispatch(id_Action(search_id));
    const request = new consume_api(url, {}, stateSessionToken);
    const response = await request.get_petitions();
    if(response["msm"]){
      dispatch(lock_uiAction({action:1, value:false}));
      setActivities([]);
      return;
    }
    setActivities(response);
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 500);
    localStorage.setItem("code", "");
  }

  const go_toAstudent = (id, points)=>{
    localStorage.setItem("code", search_id);
    dispatch(id_Action(id));
    dispatch(navigation_Actions(10));
    navigate(`/Activities/get-student-activities/${btoa(points)}`);
  }

  useEffect(()=>{
    get_activities();
    dispatch(navigation_Actions(9));
  },[]);

  return(
    <div className={crom_container}>
    {activities.map(d=>(
     <div key={d[0]} className={activity_item}>
       <div className={a_left}>
         <p>{`Nombre actividad: ${d[1]}`}</p>
         <p>{`Creada el dia: ${new Date(d[2]).toLocaleDateString()}`}</p>
         <p>{`Puntuacion: ${d[3]}`}</p>
         <p>{`Tipo: ${d[4]}`}</p>
         <p>{`Subtipo: ${d[5]}`}</p>
       </div>
       <div className={a_right}>
         <button onClick={()=>{go_toAstudent(d[0], d[3]);}}>
           <HiClipboardCheck/>
           <span>Calificar</span>
         </button>
       </div>
     </div>
    ))}
    </div>
  )
}

export function Get_sActivities(){
  const {session:{stateSessionToken}, search_id:{search_id}} = useSelector(state=>state);
  const {points} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [student, setStudent] = useState([]);
  const {crom_container, activity_item, a_left, as_right} = styles;

  const get_students= async ()=>{
    if(search_id === 0){
      navigate("/Activities");
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`/activity/get-activity-students/${search_id}`, {}, stateSessionToken);
    const response = await request.get_petitions();
    if(response["msm"]){
      dispatch(lock_uiAction({action:1, value:false}));
      setStudent([]);
      return;
    }
    setStudent(response);
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
  }

  useEffect(()=>{
    get_students();
  },[]);  
  return(
    <div className={crom_container}>
    {student.map(d=>(
      <div key={d[0]} className={activity_item}>
        <div className={a_left}>
          <p>{`Nombre: ${d[1]}`}</p>
          <p>{`Codigo: ${d[2]}`}</p>
          <p>{`Listado: ${d[3]}`}</p>
          <p>{`Calificacion: ${d[4]}/${atob(points)}`}</p>
        </div>
        <div className={as_right}>
          <button onClick={()=>{navigate(`/Activities/qualified-activity/${btoa(d[0])}/${btoa(1)}`);}}><CgMathPlus/><span>Sumar</span></button>
          <button onClick={()=>{navigate(`/Activities/qualified-activity/${btoa(d[0])}/${btoa(2)}`)}}><CgMathMinus/><span>Restar</span></button>
        </div>
      </div>
    ))}
    </div>
  )
}
