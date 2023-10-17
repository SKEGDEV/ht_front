import { useDispatch, useSelector } from "react-redux";
import { navigation_Actions } from "../../actions/navigationActions";
import { useEffect, useState } from "react";
import { consume_api, Api_routes } from "../../utils/consume_api";
import styles from './classroom.module.scss';
import {MdFormatListBulletedAdd, MdCancel,MdCheckBox, MdQueryStats, MdDoubleArrow} from 'react-icons/md'
import {BiSelectMultiple} from 'react-icons/bi'
import { lock_uiAction } from "../../actions/lock_uiActions";
import { id_Action } from "../../actions/id_actions";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import Select from "../../components/select/select";
import {notify} from "../../utils/notify";
import { search_Actions } from "../../actions/search";


export function Classroom_year(){
  const token = useSelector(state=>state.session.stateSessionToken); 
  const {filter} = useSelector(state=>state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {classroom_container, classroom_item, l_item, r_item} = styles;

  const get_year = async ()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(Api_routes.get_classroomYears, {}, token);
    const response = await request.get_petitions();
    if(response["msm"]){
      const warning = new notify(response["msm"]);
      warning.warning();
      dispatch(lock_uiAction({action:1, value:false}));
      dispatch(search_Actions({variant:2, item:{item:[], index:0}}));
      return;
    }
    dispatch(search_Actions({variant:2, item:{item:response, index:0}}));
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},250);
  }

  const go_to = (year)=>{
    window.location.pathname === "/Classroms" ? navigate(`/Classroms/classroom-list/${btoa(year)}`):navigate(`/Activities/activities-list/${btoa(year)}`)
  }

  useEffect(()=>{ 
    if(window.location.pathname === "/Classroms"){
      dispatch(navigation_Actions(3));
      get_year();
    }
    if(window.location.pathname === "/Activities"){
      dispatch(navigation_Actions(4));
      get_year();
    }
  },[window.location.pathname]);

  return(
    <div className={classroom_container}>
    {filter.o_filter.map((d, index)=>
      <div className={classroom_item} key={index}>
        <div className={l_item}>
          <h4>{`Cursos para el año: ${d[0]}`}</h4>
        </div>
        <div className={r_item}>
          <button onClick={()=>{go_to(d[0]);}}><MdDoubleArrow/><span>Ir a</span></button>
        </div>
      </div>
    )}
    </div>
  )
}

export default function Classroom(){
  const dispatch = useDispatch();
  const token = useSelector(state=>state.session.stateSessionToken);
  const {filter} = useSelector(state=>state);
  const navigate = useNavigate();
  const {classroom_container,
	 classroom_item,
	 l_item,
	 r_item,
	 item_top,
	 item_bottom
	} = styles;
  const {year} = useParams();

  const get_classrooms = async ()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`${Api_routes.get_classroom}${atob(year)}`, {}, token);
    const response = await request.get_petitions();
    if(response["msm"]){
      dispatch(lock_uiAction({action:1, value:false}));
      dispatch(search_Actions({variant:2, item:{item:[], index:1}}));
      return;
    }
    dispatch(search_Actions({variant:2, item:{item:response, index:1}}));
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 1000);
  }

  const goto_addList = (id)=>{
    dispatch(id_Action(id));
    navigate("/Classroms/upload-listing");
  }

  const goto_select = (number, id)=>{
    dispatch(id_Action(id));
    navigate(`/Classroms/select-clist/${btoa(number)}/${btoa(1)}`);
  }
  
  useEffect(()=>{
    get_classrooms();
    dispatch(navigation_Actions(3));
  },[]);

  return(
    <div className={classroom_container}>
    {filter.o_filter.map(d=>(
     <div key={d[0]} className={classroom_item}>
      <div className={l_item}>
       <div className={item_top}>
         <h4>{d[1]}</h4>
       </div>
       <div className={item_bottom}> 
         {
	   d[2] !== "unidad"?
	   <button onClick={()=>{goto_select(1,d[0]);}}>1</button>:
	   <>
	   <button onClick={()=>{goto_select(1,d[0]);}}>1</button>
	   <button onClick={()=>{goto_select(2,d[0]);}}>2</button>
	   <button onClick={()=>{goto_select(3,d[0]);}}>3</button>
	   <button onClick={()=>{goto_select(4,d[0]);}}>4</button>
	   </>
	 } 
       </div>
      </div>
      <div className={r_item}>
       <button onClick={()=>{goto_addList(d[0]);}}><MdFormatListBulletedAdd/><span>Cargar listado</span></button>
      </div>
     </div>
    ))}
    </div>
  );
}

export function Select_clist(){
  const {clist_number, search_type} = useParams();
  const {search_id:{search_id}, session:{stateSessionToken}} = useSelector(state => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clist, setClist] = useState([]);
  const [clist_id, setClist_id] = useState(0);

  const get_Clist = async ()=>{
    if(search_id === 0 ){
      dispatch(id_Action(0));
      navigate("/Classroms");
      return
    }
    const request = new consume_api(`${Api_routes.get_classroomList}${search_id}`, {}, stateSessionToken)
    const data = await request.get_petitions(); 
    if(data["msm"] === "Authorization"){
      return;
    }
    if(data["isEmpty"]){
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:"El curso no tiene asignado ningun listado, por favor asignele un listado",
	type:0,
	exec:()=>{dispatch(id_Action(0)); navigate("/Classroms"); }
      }}));
      return;
    }
    if(data["isUnique"]){
      data.data.map(d=>{
	dispatch(id_Action(d[0]));
      });
      if(atob(search_type) == 2){
	navigate(`/Activities/get-all-activities/${clist_number}`);
	return;
      }
      navigate(`/Classroms/get-class-list/${clist_number}`);
      return;
    } 
    setClist(data);
    return;
  }

  const goto_getclist = ()=>{
    if(clist_id == 0){
      const w_alert = new notify("Por favor seleccione un listado");
      w_alert.warning();
      return;
    }
    dispatch(id_Action(clist_id));
    if(atob(search_type)==2){
      navigate(`/Activities/get-all-activities/${clist_number}`);
      return;
    }
    navigate(`/Classroms/get-class-list/${clist_number}`);
  }

  useEffect(()=>{
    get_Clist();
    dispatch(navigation_Actions(8));
    localStorage.setItem("code","");
  },[]);

  const {create_container, create_btn, l_create, r_create, identifier} = styles;
  return(
    <div className={create_container} >
     <div className={identifier}>
       <h4>{`Seleccionar listado `} <BiSelectMultiple/></h4>
     </div>
      <Select
       msm=" el listado deseado"
       options={clist}
       get_value={(name, value)=>{setClist_id(value);}}
       set_value={clist_id}
      />
     <div className={create_btn}>
       <div className={l_create}>
         <Button
           Icon={MdCancel}
           type="danger"
           text="Cancelar"
           press_btn={()=>{
	     dispatch(id_Action(0));
	     atob(search_type) == 2? navigate("/Activities"):navigate("/Classroms");
	   }}
         />
       </div>
       <div className={r_create}>
         <Button
           Icon={MdCheckBox}
           type="success"
           text="Confirmar"
           press_btn={goto_getclist}
         />
       </div>
     </div>
    </div>
  );
}

export function Get_clist(){
  const {search_id:{search_id}, session:{stateSessionToken}, filter:{o_filter}} = useSelector(state => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {classroom_container, clist_item, clist_btn, clsit_info, identifier}=styles
  const {clist_number} = useParams();

  const get_cStudents = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`${Api_routes.get_classroomListStudent}${search_id}/${atob(clist_number)}`, {}, stateSessionToken);
    const data = await request.get_petitions();
    if(data["msm"]){
      dispatch(search_Actions({variant:2, item:{item:[], index:1}}));
      dispatch(lock_uiAction({action:1, value:false}));
      return;
    }
    dispatch(search_Actions({variant:2, item:{item:data, index:1}}));
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 500);
  }

  useEffect(()=>{
    get_cStudents();
  },[])

  return(
    <div className={classroom_container}> 
     {o_filter.map(d=>(
      <div key={d[0]} className={clist_item}>
       <div className={clsit_info}>
         <p>{`Nombre completo: ${d[1]}`}</p>
         <p>{`Codigo estudiante: ${d[2]}`}</p>
         <p>{`Fecha de nacimiento: ${new Date(d[3]).toLocaleDateString()}`}</p>
         <p>{`Calificacion acumulada: ${d[6]} PTS`}</p>
       </div>
       <div className={clist_btn}>
         <Button
           Icon={MdQueryStats}
           text="Rendimiento"
         />
       </div>
     </div>
     ))}
    </div>
  )
}
