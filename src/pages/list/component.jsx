import styles from './list.module.scss';
import { useState} from 'react';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import {MdCancel, MdSkipNext, MdAddCircle, MdSave} from 'react-icons/md';
import {IoIosSkipBackward} from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../utils/notify';

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
	 student} = styles;
  const [expand, setExpand] = useState(student);
  const [list_name, setListName] = useState("");
  var students = []; 
  const [params, setParams]=useState({
    "first_name":"",
    "last_name":"",
    "code":"",
    "birthday":"",
    "father_number":"",
    "mother_number":"",
    "phone_number":""
  });
  var index = 1;
  const {first_name, last_name, code, birthday, father_number, mother_number, phone_number} = params;

  const navigate = useNavigate(); 
  const get_value = (name, value)=>{
    setParams({
      ...params,
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
    console.log(students);
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
             press_btn={()=>{setNext(step);setExpand("");}}
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
           type="success"
           Icon={MdSave}
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
      </div>
     </div>
    </div>
  );
}
