import styles from './list.module.scss';
import { useEffect, useState} from 'react';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import {MdCancel, MdSkipNext, MdAddCircle, MdSave, MdDelete, MdUpdate} from 'react-icons/md';
import {IoIosSkipBackward} from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { notify } from '../../utils/notify';
import { consume_api } from '../../utils/consume_api';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { lock_uiAction } from '../../actions/lock_uiActions';
import { navigation_Actions } from '../../actions/navigationActions';
var index = 1;

export function Create_list(){ 
  const [next, setNext] = useState("");
  const {create_container,
	 slider_container,
	 slider_item,
	 item_header,
	 item_body,
	 item_footer,
	 f_left,
         f_right,
	 step,
	 student,
	 table_item,
	 table_index,
	 table_name,
	 table_btn} = styles;
	
  const [expand, setExpand] = useState(student);
  const [list_name, setListName] = useState("");
  const [students, setStudent] = useState([]);
  const [params, setParams]=useState({ 
    "index":0,
    "first_name":"",
    "last_name":"",
    "code":"",
    "birthday":"",
    "father_number":"",
    "mother_number":"",
    "phone_number":""
  });
  const {first_name, last_name, code, birthday, father_number, mother_number, phone_number} = params; 
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const token = useSelector(state=>state.session.stateSessionToken);
  const get_value = (name, value)=>{
    setParams({
      ...params,
      "index":index,
      [name]:value
    });  
   }
  const get_listName = (name, value)=>{
    setListName(value);
  }
  const add = ()=>{
    if(!first_name || !last_name || !code || !birthday){
      const warning = new notify("Son requeridos todos los campos identificados con: *");
      warning.warning();
      return;
    }
    students.push(params);
    index+=1;
    setParams({
    ...params, 
    "first_name":"",
    "last_name":"",
    "code":"",
    "birthday":"",
    "father_number":"",
    "mother_number":"",
    "phone_number":""
    });
  }
  const remove = (id)=>{
    var temp = []
    students.map(d=>{
      if(d["index"] != id){
        temp.push(d);
      }
    });
    setStudent(temp); 
  }
  const create_list = async ()=>{
    if(students.length === 0 ){
      const warning = new notify("Se debe agregar por lo menos un estudiante al listado");
      warning.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const data = {
      name:list_name,
      data:students
    }
    const request = new consume_api("/student/create-student-list", data, token);
    const msm = await request.post_petitions();
    if(msm["msm"]){
      setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}));}, 500);
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:msm["msm"],
	type:1,
	exec:()=>{navigate("/Lists");}
    }}));
    }
  }
  const change_form = ()=>{
    if(!list_name){
      const warning = new notify("El nombre del listado es requerido");
      warning.warning();
      return; 
    }
    setNext(step);
    setExpand("");
  }

  return(
    <div className={create_container}>
     <div className={slider_container+" "+next}>
      <div className={slider_item}>
        <div className={item_header}>
         <h4>Paso 1</h4>
         <p>Agregale un nombre a tu listado, como por ejemplo: Aula 6to B</p>
        </div>
        <div className={item_body}>
          <Input
           type="text"
           lblText="Nombre *"
           placeholder="Ingrese el nombre de su listado"
           set_value={list_name}
           get_value={get_listName}
          />
        </div>
        <div className={item_footer}>
         <div className={f_left}>
           <Button
             Icon={MdCancel}
             text="Cancelar"
             type="danger"
             press_btn={()=>{navigate("/Lists");}}
            />
         </div>
         <div className={f_right}>
           <Button
             Icon={MdSkipNext}
             text="Siguiente" 
             press_btn={change_form}
           />
         </div>
        </div>
      </div>
      <div className={slider_item+" "+expand}>
        <div className={item_header}>
         <h4>Paso 2</h4>
         <p>Agrega tu listado de estudiantes, puedes agregar tantos cuanto necesites</p>        
         <Button
           text="Guardar listado" 
           Icon={MdSave}
           press_btn={create_list}
         />
        </div>
        <div className={item_body}>
         <Input
           type="text"
           lblText="Nombres *"
           placeholder="Ingrese el nombre/s del estudiante"
           name="first_name"
           set_value={first_name}
           get_value={get_value}
         />
         <Input
           type="text"
           lblText="Apellidos *"
           placeholder="Ingrese los apellidos del estudiante"
           name="last_name"
           set_value={last_name}
           get_value={get_value}
          />
         <Input
           type="text"
           lblText="Codigo *"
           placeholder="Ingrese el codigo asignado al estudiante"
           name="code"
           set_value={code}
           get_value={get_value}
         />
         <Input
           type="date"
           lblText="Nacimiento *"
           placeholder="Ingrese la fecha de nacimiento del estudiante"
           name="birthday"
           set_value={birthday}
           get_value={get_value}
          />
         <Input 
           type="number"
           lblText="Padre de familia"
           placeholder="Ingrese el numero de telefono del padre o encargado"
           name="father_number"
           set_value={father_number}
           get_value={get_value}
         />
         <Input
           type="number"
           lblText="Madre de familia"
           placeholder="Ingrese el numero de telefono de la madre o encargado"
           name="mother_number"
           set_value={mother_number}
           get_value={get_value}
          />
         <Input
           type="number"
           lblText="Numero extra"
           placeholder="Ingrese un numero telefonico extra"
           name="phone_number"
           set_value={phone_number}
           get_value={get_value}
          />
        </div>
        <div className={item_footer}>
          <div className={f_left}>
           <Button
             Icon={IoIosSkipBackward}
             text="Regresar"
             type="danger"
             press_btn={()=>{setNext("");setExpand(student);}}
            />
         </div>
         <div className={f_right}>
           <Button
             Icon={MdAddCircle}
             text="Agregar" 
             type="success"
             press_btn={add}
           />
         </div>        
        </div>
        {students.map(d=>(
        <div key={d[0]} className={table_item}>
         <div className={table_index}>
           <h1>{d["index"]}</h1>
         </div>
         <div className={table_name}>
           <h4>{d["first_name"]+" "+d["last_name"]}</h4>
         </div>
         <div className={table_btn}>
           <Button
            Icon={MdDelete}
            type="danger"
	    press_btn={()=>{remove(d["index"]);}}
           />
         </div>
       </div>
	))}
      </div>
     </div>
    </div>
  );
}

export function Add_update_student(){ 
  const {list_id, s_id} = useParams();
  const {stateSessionToken} = useSelector(state=> state.session);
  const {container, container_btn, c_rigth, c_left} = styles
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params, setParams] = useState({
    "s_id":atob(s_id),
    "list_id": atob(list_id),
    "first_name" : "",
    "last_name": "",
    "code": "",
    "birthday":"",
    "mother_number":"",
    "father_number":"",
    "phone_number":""
  });
  const {first_name, last_name, code, birthday, mother_number, father_number, phone_number} = params

  const generate_date = (s_date)=>{
    const date = new Date(s_date);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${date.getFullYear()}-${month}-${day}`;
  }

  const get_2Update = async ()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`/student/get-student-2-update/${atob(s_id)}`, {}, stateSessionToken);
    const response = await request.get_petitions();
    if(response["msm"]){ 
      dispatch(lock_uiAction({action:1, value:false}));
      return;
    }
    response.map(d=>{
      setParams({
	...params,
	["first_name"]: d[0],
	["last_name"]: d[1],
	["code"]:d[2],
	["birthday"]:generate_date(d[3]),
	["mother_number"]:d[4],
	["father_number"]:d[5],
	["phone_number"]:d[6]
      })
    }); 
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
  }

  const onChangeInput = (name, value)=>{
    setParams({
      ...params,
      [name]:value
    });
  }

  const isSure = ()=>{
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:"Esta seguro de realizar este cambio?",
	type:2,
	exec:()=>{update_student();}
    }}));
  }

  const update_student = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`/student/update-student-information`, params, stateSessionToken);
    const response = await request.put_petitions(); 
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
    dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:response,
	type:1,
	exec:()=>{navigate(`/Lists/get-student/${list_id}`)}
    }}));
  }

  const create_student=async ()=>{ 
    if(!first_name || !last_name || !code || !birthday){
      const w_notify = new notify('Todos los campos con el identificador * son requeridos');
      w_notify.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`/student/create-student-out-list`, params, stateSessionToken);
    const response = await request.post_petitions();
    if(response["msm"]){
      setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500)
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:response["msm"],
	type:1,
	exec:()=>{navigate(`/Lists/get-student/${list_id}`);}
    }}));
      return;
    }
    dispatch(lock_uiAction({action:1, value:false}));
    navigate(`/Lists/get-student/${list_id}`);
  }

  useEffect(()=>{
    if(atob(s_id) != 0){
      get_2Update();
    }
    dispatch(navigation_Actions(13));
  },[])

  return(
    <div className={container}>
      <Input
       type="text"
       lblText="Nombres*"
       placeholder="Por favor ingrese los nombres del estudiante"
       name="first_name"
       set_value={first_name}
       get_value={onChangeInput}
     />
      <Input
       type="text"
       lblText="Apellidos*"
       placeholder="Por favor ingrese los apellidos del estudiante"
       name="last_name"
       set_value={last_name}
       get_value={onChangeInput}
     />
      <Input
       type="text"
       lblText="Codigo*"
       placeholder="Por favor ingrese el codigo de estudiante"
       name="code"
       set_value={code}
       get_value={onChangeInput}
     />
      <Input
       type="date"
       lblText="Fecha de nacimiento*"
       placeholder="Por favor ingrese la fecha de nacimiento"
       set_value={birthday}
       name="birthday"
       d_value={birthday}
       get_value={onChangeInput}
     />
      <Input
       type="number"
       lblText="Numero padre"
       placeholder="Por favor ingrese el numero telefonico del padre"
       name="father_number"
       set_value={father_number}
       get_value={onChangeInput}
     />
      <Input
       type="number"
       lblText="Numero madre"
       placeholder="Por favor ingrese el numero telefonico de la madre"
       name="mother_number"
       set_value={mother_number}
       get_value={onChangeInput}
     />
      <Input
       type="number"
       lblText="Numero otro"
       placeholder="Por favor ingrese un numero telefonico extra"
       name="phone_number"
       set_value={phone_number}
       get_value={onChangeInput}
     />
      <div className={container_btn}>
        <div className={c_left}>
        <Button
          Icon={IoIosSkipBackward}
          text="Regresar"
          type="danger"
          press_btn={()=>{navigate(`/Lists/get-student/${list_id}`)}}
       />
        </div>
         <div className={c_rigth}>
        <Button
          Icon={atob(s_id)!=0?MdUpdate:MdAddCircle}
          text={atob(s_id)!=0?"Actualizar":"Agregar"} 
          type={atob(s_id)!=0?"warning":"success"}
          press_btn={atob(s_id)!=0?isSure:create_student}
       />
         </div>
      </div>
    </div>
  );
}
