import {useEffect, useState} from "react";
import styles from "./activities.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import { consume_api, Api_routes } from "../../utils/consume_api";
import { lock_uiAction } from "../../actions/lock_uiActions";
import {AiFillCloseCircle} from "react-icons/ai";
import {MdLocalActivity} from 'react-icons/md';
import {BsFillClipboard2PulseFill,BsFileEarmarkPersonFill,BsFillPlusSquareFill} from 'react-icons/bs';
import {FaMinusCircle} from 'react-icons/fa';
import {MdCancel, MdSave} from 'react-icons/md';
import { notify } from "../../utils/notify";
import {navigation_Actions} from "../../actions/navigationActions";

export function Qualified(){
  const {session:{stateSessionToken}} = useSelector(state=>state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {student, type} = useParams();
  const [student_info, setStudent_info] = useState([]);
  const [params, setParams] = useState({});
  const {form_container, form_btn, r_form, l_form, form_card, card_title, card_input,} = styles;

  const get_info = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`${Api_routes.get_studentActivityInfo}${atob(student)}`, {}, stateSessionToken)
    const response = await request.get_petitions();
    if(response["msm"]){
      setStudent_info([]);
      dispatch(lock_uiAction({action:1, value:false}));
      return;
    }
    setStudent_info(response);
    InitParams(response);
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
  }

  const InitParams = (item)=>{
    item.map(d=>{
      setParams({
	qualification:{
	  type:atob(type),
	  id:atob(student),
	  total_points:d[13]
	},
	procedural:{
	  s_points:0,
	  s_current_points:d[5],
	  a_qualification:d[12],
	  q_name:"Procedimental"
	},
	declarative:{
	  s_points:0,
	  s_current_points:d[3],
	  a_qualification:d[10],
	  q_name:"Declarativo"
	},
	attitudinal:{
	  s_points:0,
	  s_current_points:d[4],
	  a_qualification:d[11],
	  q_name:"Actitudinal"
	}
      })
    });
  }

  const make_params = (name, value)=>{
    if(name === 'p'){
      setParams({
	...params,
	procedural:{
	  ...params.procedural,
	  s_points:value
	}
      });
    }
    if(name === 'd'){
      setParams({
	...params,
	declarative:{
	  ...params.declarative,
	  s_points:value
	}
      });
    }
    if(name === 'a'){
      setParams({
	...params,
	attitudinal:{
	  ...params.attitudinal,
	  s_points:value
	}
      });
    }
  }

  const qualify = async ()=>{
    if(params.procedural.s_points < 0 || params.declarative.s_points < 0 || params.attitudinal.s_points < 0 ){
      const notification = new notify('No se permite ninguna calificacion menor a 0');
      notification.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(Api_routes.put_qualifiedActivity, params, stateSessionToken);
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
	exec:()=>{navigate(`/Activities/get-student-activities/${btoa(params.qualification.total_points)}`);}
      }}));
  }

  useEffect(()=>{
    get_info();
  },[])

  return(
    <>
    {student_info.map(d=>(
    <div key={d[0]} className={form_container}>
      <div className={form_card}>
        <div className={card_title}>
          <h4>{`Estudiante `} <BsFileEarmarkPersonFill/></h4>
        </div>
        <div className={card_input}>
          <Input
           set_value={d[0]}
           placeholder={`Nombre del estudiante`}
           is_disabled={true}
          />
          <Input
           placeholder={`Codigo del estudiante`}
           set_value={d[1]}
           is_disabled={true}
          />
          <Input
           set_value={new Date(d[2]).toLocaleDateString()}
           placeholder={`Fecha de nacimiento del estudiante`}
           is_disabled={true}
          />
          <Input
           set_value={`${d[6]}/${d[13]}`}
           placeholder={`Calificacion acumulada actualmente de la actividad`}
           is_disabled={true}
          />
        </div>
      </div>
      <div className={form_card}>
        <div className={card_title}>
          <h4>{`Actividad `} <MdLocalActivity/></h4>
        </div>
        <div className={card_input}>
          <Input
           set_value={d[7]}
           is_disabled={true}
           placeholder={`Nombre de la actividad`}
          />
          <Input
           set_value={d[9]}
           is_disabled={true}
           placeholder={`Clasificacion de la actividad`}
          />
          <Input
           set_value={d[13]}
           is_disabled={true}
           placeholder={`Puntuacion total de la actividad`}
          />
        </div>
      </div>
      <div className={form_card}>
        <div className={card_title}>
          <h4>{d[8] == 4 ? `Examen ` : d[8] == 5 ? `Proyecto ` : `Procedimental `} <BsFillClipboard2PulseFill/></h4>
        </div>
        <div className={card_input}>
          <Input
           set_value={d[12]}
           is_disabled={true}
           placeholder={`Punteo maximo posible para este apartado`}
          />
          <Input
           set_value={`${d[5]}/${d[12]}`}
           is_disabled={true}
           placeholder={`Punteo obtenido acutalmente para este apartado`}
          />
          <Input
           placeholder={`Ingrese la calificacion que corresponde`}
           set_value={params.procedural.s_points}
           get_value={make_params}
           name="p"
           type="number"
          />
        </div>
      </div>
      {d[8] == 4 ? <></> : d[8] == 5 ? <></> : 
	<>
      <div className={form_card}>
        <div className={card_title}>
          <h4>{`Declarativo `} <BsFillClipboard2PulseFill/></h4>
        </div>
        <div className={card_input}>
          <Input
           set_value={d[10]}
           is_disabled={true}
           placeholder={`Punteo maximo posible para este apartado`}
          />
          <Input
           set_value={`${d[3]}/${d[10]}`}
           placeholder={`Punteo obtenido actualmente para este apartado`}
           is_disabled={true}
          />
          <Input
            placeholder={`Ingrese la calificacion que corresponde`}
           set_value={params.declarative.s_points}
           get_value={make_params}
           name="d" 
           type="number"
          />
        </div>
      </div>
      <div className={form_card}>
        <div className={card_title}>
          <h4>{`Actitudinal `} <BsFillClipboard2PulseFill/></h4>
        </div>
        <div className={card_input}>
          <Input
           set_value={d[11]}
           is_disabled={true}
           placeholder={`Punteo maximo posible para este apartado`}
          />
          <Input
           set_value={`${d[4]}/${d[11]}`}
           is_disabled={true}
           placeholder={`Punteo obtenido actualmente para este apartado`}
          />
          <Input
           placeholder={`Ingrese la calificacion que corresponde`}
           set_value={params.attitudinal.s_points}
           get_value={make_params}
           name="a"       
           type="number"
          />
        </div>
      </div>
	</>
      }
      <div className={form_btn}>
        <div className={l_form}>
        <Button
         Icon={AiFillCloseCircle}
         type="danger"
         text="Cancelar"
         press_btn={()=>{navigate(`/Activities/get-student-activities/${btoa(params.qualification.total_points)}`);}}
       />
        </div>
        <div className={r_form}>
        <Button
         Icon={atob(type) == 1 ? BsFillPlusSquareFill : FaMinusCircle}
         type={atob(type) == 1 ? `success` : `warning`}
         text={atob(type) == 1 ? `Sumar a calificacion` : `Restar a calificacion`}
         press_btn={()=>{qualify();}}
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
  const {form_container, form_btn, r_form, l_form, form_card, card_title, card_input, card_footer} = styles;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [i_subtype, setI_subtype] = useState([]);
  const [params, setParams] = useState({
    declarative:{
      name:"",
      qualification:0
    },
    attitudinal:{
      name:"",
      qualification:0
    },
    procedural:{
      name:"",
      qualification:0
    },
    activity:{
      Clist:search_id,
      subtype:0,
      number:atob(number)
    }
  });

  const make_activity = (name, value)=>{
    setParams({
      ...params,
      activity:{
	...params.activity,
	[name]:value
      }
    });
  }

  const make_declarative = (name, value)=>{
    setParams({
      ...params,
      declarative:{
	...params.declarative,
	[name]:value
      }
    });
  }

  const make_attitudinal = (name, value)=>{
    setParams({
      ...params,
      attitudinal:{
	...params.attitudinal,
	[name]:value
      }
    });
  }

  const make_procedural = (name, value)=>{
    setParams({
      ...params,
      procedural:{
	...params.procedural,
	[name]:value
      }
    });
  }
  
  const create_activity = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(Api_routes.post_createActivity, params, stateSessionToken);
    const response = await request.post_petitions();
    if(response["isMax"]){
      const warning_alert = new notify(response["msm"]);
      warning_alert.warning();
      dispatch(lock_uiAction({action:1, value:false}));
      return;
    }
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
    setParams({
      declarative:{
	name:"",
	qualification:0
      },
      attitudinal:{
	name:"",
	qualification:0
      },
      procedural:{
	name:"",
	qualification:0
      },
      activity:{
	Clist:search_id,
	subtype:0,
	number:atob(number)
      } 
    });
    dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:response["msm"],
	type:1,
	exec:()=>{navigate(`/Activities/get-all-activities/${number}`);}
      }}));
  }

  const validate_params = ()=>{
    const qualifications = [params.procedural.qualification, params.declarative.qualification, params.attitudinal.qualification];
    const names = [params.procedural.name, params.declarative.name, params.attitudinal.name];
    let notification;
    if(params.activity.subtype == 0){
      notification = new notify("Debe seleccionar una categoria para la actividad");
      notification.warning();
      return;
    }
    if(qualifications[0] == 0){
      notification = new notify("La calificacion procedimental no puede ser 0");
      notification.warning();
      return;
    }
    if(qualifications[0] < 0 || qualifications[1] < 0 || qualifications[2] < 0){
      notification = new notify("Las calificaciones no pueden ser menores a 0");
      notification.warning();
      return;
    }
    if(names.includes("") && (params.activity.subtype == 1 || params.activity.subtype == 2 || params.activity.subtype == 3)){
      notification = new notify("Los nombres de las calificaciones no pueden estar vacias");
      notification.warning();
      return;
    }
    if(params.procedural.name === ""){
      notification = new notify("El nombre del examen o proyecto no puede estar vacio");
      notification.warning();
      return;
    }
    create_activity();
  }

  const get_catalogs = async()=>{
    const subtype_request = new consume_api(Api_routes.get_activitySubTypeCatalog,{},""); 
    const subtype = await subtype_request.get_petitions();
    if(subtype["msm"]){
      setI_subtype([]);
      navigate(`/Activities`);
      return;
    }
    setI_subtype(subtype);
  }

  useEffect(()=>{
    get_catalogs();
    dispatch(navigation_Actions(11));
  },[])

  return(
   <div className={form_container}>
    <div className={form_card}>
      <div className={card_title}>
        <h4>{`Actividad `} <MdLocalActivity/></h4>
      </div>
      <div className={card_input}>
        <Select
         options={i_subtype}
         name={`subtype`}
         get_value={make_activity}
         set_value={params.activity.subtype}
         msm={` la categoria de la actividad*`}
        />
      </div>
     {params.activity.subtype == 0 ? <></>:
      params.activity.subtype == 4 ? <></>:
      params.activity.subtype == 5 ? <></>:
      <div className={card_footer}>
        <p><strong>Nota: </strong> Si los apartados de calificacion declarativa y calificacion actitudinal van en 0 estas se calcularan automaticamente 
	  asignadole un 10% a la calificacion actitudinal y 5% a la calificacion declarativa con respecto a la calificacion procedimental</p>
      </div>
     }
    </div>
    {params.activity.subtype == 0 ? <></>:
    <div className={form_card}>
      <div className={card_title}>
        <h4>{params.activity.subtype == 4 ? "Examen":
	     params.activity.subtype == 5 ? "Proyecto": "Procedimental"} <BsFillClipboard2PulseFill/></h4>
      </div>
      <div className={card_input}>
        <Input
         placeholder={params.activity.subtype == 5 ? `Ingrese el nombre para el proyecto*` :
	              params.activity.subtype == 4 ? `Ingrese el nombre para la actividad examen*` : `Ingrese el nombre de la actividad procedimental*`}
         get_value={make_procedural}
         set_value={params.procedural.name}
         name={`name`}
         type="text"
        />
        <Input
         placeholder={params.activity.subtype == 5 ? `Ingrese la puntuacion para el proyecto*` :
	              params.activity.subtype == 4 ? `Ingrese la puntuacion para la actividad examen*` : `Ingrese la puntuacion de la actividad procedimental*`}
         get_value={make_procedural}
         set_value={params.procedural.qualification}
         name={`qualification`}
         type="number"
        />
      </div>
    </div>
    }
    {params.activity.subtype == 0 ? <></>:
     params.activity.subtype == 4 ? <></>:
     params.activity.subtype == 5 ? <></>:
    <>
    <div className={form_card}>
      <div className={card_title}>
        <h4>{`Declarativo `} <BsFillClipboard2PulseFill/></h4>
      </div>
      <div className={card_input}>
        <Input
         placeholder={`Ingrese el nombre de la actividad declarativa*`}
         get_value={make_declarative}
         set_value={params.declarative.name}
         name={`name`}
         type="text"
	/>
        <Input
         placeholder="Ingrese la puntuacion de la actividad declarativa"
         get_value={make_declarative}
         set_value={params.declarative.qualification}
         name={`qualification`}
         type="number"
	/>
      </div>
    </div>
    <div className={form_card}>
      <div className={card_title}>
        <h4>{`Actitudinal `} <BsFillClipboard2PulseFill/></h4>
      </div>
      <div className={card_input}>
        <Input
         placeholder="Ingrese el nombre de la actividad actitudinal*"
         get_value={make_attitudinal}
         set_value={params.attitudinal.name}
         name={`name`}
         type="text"
	/>
        <Input
         placeholder="Ingrese la puntuacion de la actividad actitudinal"
         get_value={make_attitudinal}
         set_value={params.attitudinal.qualification}
         name={`qualification`}
         type="number"
	/>
      </div>
    </div>
    </>
    }
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
