import styles from './list.module.scss';
import { useState} from 'react';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import {MdCancel, MdSkipNext, MdAddCircle, MdSave, MdDelete} from 'react-icons/md';
import {IoIosSkipBackward} from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../utils/notify';
import { consume_api } from '../../utils/consume_api';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { lock_uiAction } from '../../actions/lock_uiActions';
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
           type="text"
           lblText="Padre de familia"
           placeholder="Ingrese el numero de telefono del padre o encargado"
           name="father_number"
           set_value={father_number}
           get_value={get_value}
         />
         <Input
           type="text"
           lblText="Madre de familia"
           placeholder="Ingrese el numero de telefono de la madre o encargado"
           name="mother_number"
           set_value={mother_number}
           get_value={get_value}
          />
         <Input
           type="text"
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
        <div className={table_item}>
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
