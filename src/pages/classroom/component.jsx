import styles from './classroom.module.scss';
import Input from '../../components/input/input';
import Select from '../../components/select/select';
import { useState, useEffect } from 'react';
import { consume_api, Api_routes} from '../../utils/consume_api';
import {MdCancel, MdSave, MdAddCircle} from 'react-icons/md';
import Button from '../../components/button/button';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../utils/notify'; 
import { lock_uiAction } from '../../actions/lock_uiActions';
import { id_Action } from '../../actions/id_actions';

export function Create_classroom(){
  const [types, setTypes] = useState([]);
  const [params, setParams] = useState({
    "class_name":"",
    "type":0
  });
  const {create_container, input_container, l_create, r_create, create_btn, inputs} = styles;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(state=>state.session.stateSessionToken);
  const {class_name, type} = params;

  const get_value = (name, value)=>{
    setParams({
      ...params,
      [name]:value
    });
  }

  const get_types = async ()=>{
    const request = new consume_api(Api_routes.get_classroomTypeCatalog, {}, "");
    setTypes(await request.get_petitions());
  }

  const unlock_ui = (u_type, response)=>{
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 500);
    setParams({
      "class_name":"",
      "type":0
    });
    if(u_type === 1){
      var id = 0;
      const {data, msm}= response
      data.map(d=>{
       id = d[0];
      });   
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:msm,
	type:1,
	exec:()=>{dispatch(id_Action(id)); navigate("/Classroms/upload-listing"); }
      }}));
      return
    }
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:"Curso creado con exito",
	type:1,
	exec:()=>{navigate("/Classroms");}
      }}));
     return
  }

  const create_classroom = async()=>{
    if(!class_name || !type){
      const warning = new notify("Todos los campos son requeridos");
      warning.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(Api_routes.post_createClassroom, params, token);
    const response = await request.post_petitions();
    if(response.data){
      unlock_ui(1, response);
      return;
    }
    unlock_ui(2, response);
  }

  useEffect(()=>{
    get_types();
  },[]);

  return(
    <div className={create_container}>
    <div className={input_container}>
    <div className={inputs}>
     <Input
     type="text" 
     placeholder="Ingrese un nombre para su curso"
     lblText="Nombre *"
     get_value={get_value}
     set_value={class_name}
     name="class_name"
    />
    </div>
    </div>
    <Select
     msm=" el tipo de curso deseado"
     options={types}
     get_value={get_value}
     name="type"
     set_value={type}
    />
    
    <div className={create_btn}>
    <div className={l_create}>
     <Button
      Icon={MdCancel}
      type="danger"
      text="Cancelar"
      press_btn={()=>{navigate("/Classroms")}}
    />
    </div>
    <div className={r_create}>
     <Button
      Icon={MdSave}
      type="success"
      text="Crear curso"
      press_btn={create_classroom}
    />
    </div>
    </div>
    </div>
  );
}

export function Upload_listing(){
  const [lists, setLists] = useState([]);
  const [list_id, setList_id] = useState(0);
  const {create_container, l_create, r_create, create_btn} = styles;
  const {session:{stateSessionToken}, search_id:{search_id}} = useSelector(state=>state);
  const navigate =useNavigate();
  const dispatch = useDispatch();

  const get_lists = async ()=>{
    if(search_id === 0){
      navigate("/Classroms");
      return;
    }
    const request = new consume_api(Api_routes.get_allList, {}, stateSessionToken);
    setLists(await request.get_petitions());
  }

  const list2classroom = async()=>{
    if(list_id == 0){
      const warning = new notify("Por favor seleccione un listado para agregarlo al curso");
      warning.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const params = {
      classroom_id: search_id,
      list_id: list_id
    }
    const request = new consume_api(Api_routes.post_studentToClassroom, params, stateSessionToken);
    const response = await request.post_petitions();
    if(response["not_available"]){
      setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 500);
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:response["msm"],
	type:0,
	exec:()=>{}
      }}));
      setList_id(0);
      return
    }
    if(response["msm"]){
      setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 500);
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:response["msm"],
	type:1,
	exec:()=>{dispatch(id_Action(0)); navigate("/Classroms"); }
      }}));
      return
    }
    dispatch(lock_uiAction({action:1, value:false}))
    dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:"Ocurrio un error durante la asignacion, por favor contacte con soporte tecnico",
	type:3,
	exec:()=>{dispatch(id_Action(0)); navigate("/Classroms"); }
      }}));
    return;

  }

  useEffect(()=>{
    get_lists();
  },[]);


  return(
    <div className={create_container}>
    <Select
     msm=" el listado que desea agregar"
     options={lists}
     get_value={(name, value)=>{setList_id(value);}}
     set_value={list_id}
    />
    <div className={create_btn}>
    <div className={l_create}>
     <Button
      Icon={MdCancel}
      type="danger"
      text="Cancelar"
      press_btn={()=>{dispatch(id_Action(0));navigate("/Classroms");}}
    />
    </div>
    <div className={r_create}>
     <Button
      Icon={MdAddCircle}
      type="success"
      text="Agregar listado"
      press_btn={list2classroom}
    />
    </div>
    </div>
    </div>
  );
}
