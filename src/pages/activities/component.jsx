import {useEffect, useState} from "react";
import styles from "./activities.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import { consume_api } from "../../utils/consume_api";
import { lock_uiAction } from "../../actions/lock_uiActions";
import {AiFillCloseCircle, AiFillCheckCircle} from "react-icons/ai";
import {MdCancel, MdSave} from 'react-icons/md';
import { notify } from "../../utils/notify";
import {navigation_Actions} from "../../actions/navigationActions";

export function Qualified(){
  const {session:{stateSessionToken}} = useSelector(state=>state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {student, type} = useParams();
  const [student_info, setStudent_info] = useState([]);
  const [points, setPoints] = useState("");
  const {form_container, form_btn, r_form, l_form} = styles;

  const get_info = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`/activity/get-student-information/${atob(student)}`, {}, stateSessionToken)
    const response = await request.get_petitions();
    if(response["msm"]){
      setStudent_info([]);
      dispatch(lock_uiAction({action:1, value:false}));
      return;
    }
    setStudent_info(response);
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
  }

  const qualify = async (activity_points, student_points)=>{
    if(points < 0){
      const danger_alert = new notify(`El punteo no puede ser negativo`);
      danger_alert.error();
      return;
    }
    if(!points){
      const warning_alert = new notify("Por favor ingrese un punteo valido");
      warning_alert.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const params = {
      qualification:points,
      type:atob(type),
      id:atob(student),
      s_points:student_points,
      a_points:activity_points
    }
    const request = new consume_api(`/activity/qualified-activity`, params, stateSessionToken);
    const response = await request.put_petitions();
    if(response["isValid"]){
      dispatch(lock_uiAction({action:1, value:false}));
      const warning_alert = new notify(response["msm"]);
      warning_alert.warning();
      return;
    }
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 500);
    dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:response,
	type:1,
	exec:()=>{navigate(`/Activities/get-student-activities/${btoa(activity_points)}`);}
      }}));
    setPoints("");
  }

  useEffect(()=>{
    get_info();
  },[])

  return(
    <>
    {student_info.map(d=>(
    <div key={d[0]} className={form_container}>
      <Input
       type="text"
       placeholder="Nombre completo"
       set_value={d[0]}
      />
      <Input
       type="text"
       placeholder="Actividad a calificar"
       set_value={d[2]}
      />
      <Input
       type="number"
       lblText="Puntuacion"
       placeholder="Ingrese la cantidad deseada"
       set_value={points}
       get_value={(name, value)=>{setPoints(value);}}
      />
      <div className={form_btn}>
        <div className={l_form}>
        <Button
         Icon={AiFillCloseCircle}
         type="danger"
         text="Cancelar"
         press_btn={()=>{navigate(`/Activities/get-student-activities/${btoa(d[3])}`);}}
       />
        </div>
        <div className={r_form}>
        <Button
         Icon={AiFillCheckCircle}
         type="success"
         text="Aceptar"
         press_btn={()=>{qualify(d[3], d[1])}}
        /> 
        </div>
      </div>
    </div>
    ))}
   </>
  );
}

export function Create_activity(){
  const {number} = useParams();
  const {session:{stateSessionToken}, search_id:{search_id}} = useSelector(state=>state);
  const {form_container, form_btn, r_form, l_form} = styles;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [i_type, setI_type] = useState([]);
  const [i_subtype, setI_subtype] = useState([]);
  const [params, setParams] = useState({
    "name":"",
    "qualification":0,
    "Clist":search_id,
    "type":0,
    "subtype":0,
    "number":atob(number)
  });
  const {name, qualification, type, subtype} = params

  const make_params = (name, value)=>{
    setParams({
      ...params,
      [name]:value
    });
  }
  
  const create_activity = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api("/activity/create-activity", params, stateSessionToken);
    const response = await request.post_petitions();
    if(response["isMax"]){
      const warning_alert = new notify(response["msm"]);
      warning_alert.warning();
      dispatch(lock_uiAction({action:1, value:false}));
      return;
    }
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
    dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:response["msm"],
	type:1,
	exec:()=>{navigate(`/Activities/get-all-activities/${number}`);}
      }}));
    setParams({
      "name":"",
      "qualification":0,
      "Clist":search_id,
      "type":0,
      "subtype":0,
      "number":atob(number)
    });
  }

  const validate_params = ()=>{
    if(!name || !qualification || !type || !subtype){
      const warning_alert = new notify("Todos los campos son requeridos");
      warning_alert.warning();
      return;
    }
    if(qualification<=0){
      const danger_alert = new notify("La calificacion no puede ser negativa o 0");
      danger_alert.error();
      return;
    }
    create_activity();
  }

  const get_catalogs = async()=>{
    const type_request = new consume_api("/catalogs/get-catalog/4/0",{},"");
    const subtype_request = new consume_api("/catalogs/get-catalog/5/0",{},"");
    const type = await type_request.get_petitions();
    const subtype = await subtype_request.get_petitions();
    if(type["msm"] && subtype["msm"]){
      setI_type([]);
      setI_subtype([]);
      navigate(`/Activities`);
      return;
    }
    setI_type(type);
    setI_subtype(subtype);
  }

  useEffect(()=>{
    get_catalogs();
    dispatch(navigation_Actions(11));
  },[])

  return(
   <div className={form_container}>
     <Input
       type="text"
       lblText="Nombre *"
       placeholder="Ingrese el nombre de su actividad"
       name="name"
       get_value={make_params}
       set_value={name}
     />
     <Input
       type="number"
       lblText="Calificacion *"
       placeholder="Ingrese la puntuacion de la actividad"
       get_value={make_params}
       set_value={qualification}
       name="qualification"
     />
     <Select
       msm=" El tipo de actividad deseado *"
       options={i_type}
       get_value={make_params}
       set_value={type}
       name="type"
     />
     <Select
       msm=" El sub tipo de actividad deseado *"
       options={i_subtype}
       get_value={make_params}
       set_value={subtype}
       name="subtype"
     />
     <div className={form_btn}>
       <div className={l_form}>
         <Button
           Icon={MdCancel}
           type="danger"
           text="Cancelar"
           press_btn={()=>{navigate(`/Activities/get-all-activities/${number}`)}}
         />
       </div>
       <div className={r_form}>
         <Button
           Icon={MdSave}
           type="success"
           text="Crear"
           press_btn={validate_params}
         />
       </div>
     </div>
   </div>
  )
}
