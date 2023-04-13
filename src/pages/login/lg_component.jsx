import styles from "./login.module.scss";
import Input from '../../components/input/input.jsx';
import Button from '../../components/button/button.jsx';
import {Link, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {notify} from '../../utils/notify.js';
import {consume_api} from '../../utils/consume_api.js';
import { useDispatch } from "react-redux";
import { sessionUserAction } from "../../actions/sessionAction";
import {RiLoginBoxFill} from "react-icons/ri";
import {BsPersonFillAdd} from 'react-icons/bs';

export function Signin(){
  const {lg_form, signup_btn} = styles; 
  const [signin_form, setSignin_form] = useState({
    "document_number":"",
    "password":""
  });
  const {document_number, password} = signin_form;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const set_lg_params = (name, value) =>{
    setSignin_form({
      ...signin_form,
      [name]:value
    });
  }
  
  const signin = async()=>{
    if(!document_number || !password){
      const valid_msm = new notify("Todos los campos son obligatorios por favor completelos");
      valid_msm.warning();
      return;
    }
    const call_signin = new consume_api("/auth/login", signin_form, ""); 
    const data = await call_signin.post_petitions(); 
    const{token, name} = data;
    if(token){
      dispatch(sessionUserAction({sessionToken:token, sessionName:name, isLogged:true}));
      navigate("/home");
    } 
    setSignin_form({
      ...signin_form,
      "document_number":"",
      "password":""
    });
  }
  
  return(
    <> 
      <div className={lg_form}>
      <Input
       type="text"
       placeholder="Ingrese su numero de documento"
       lblText="No. Documento"
       set_value={document_number}
       get_value={set_lg_params}
       name="document_number"
      />
      <Input
       type="password"
       placeholder="Ingrese su contraseña"
       lblText="Contraseña"
       set_value={password}
       get_value={set_lg_params}
       name="password"
      />
       <a href="#">Olvido su contraseña?</a>
      <Button
       type="signin"
       text="Iniciar sesion" 
       press_btn={signin}
       Icon={RiLoginBoxFill}
      />  
       <div className={signup_btn}>
        <span>Aun no tienes cuenta?<Link to="/signup">Crear cuenta</Link></span> 
       </div> 
      </div>
    </>
  )
}

export function Signup(){
  const {lg_form, signin_btn} = styles;
  const [country, setCountry] = useState([]);
  const [docType, setDocType] = useState([]);

  const get_catalogs = async()=>{
    const get_country = new consume_api("/catalogs/get-catalog/1",{},"");    
    const get_doc = new consume_api("/catalogs/get-catalog/2",{},"");
    setCountry(await get_country.get_petitions());
    setDocType(await get_doc.get_petitions());
  }

  useEffect(()=>{
    get_catalogs();
  },[])

  return(
    <div className={lg_form}>
     <Input 
       type="text"
       placeholder="Ingrese su/sus nombres"
       lblText="Nombres"
     />
     <Input
       type="text"
       placeholder="Ingrese sus apellidos"
       lblText="Apellidos"
     />
     <Input
       type="date"
       placeholder="Ingrese su fecha de cumpleaños"
       lblText="Cumpleaños"
     />
     <select>
       <option value={0}>Seleccione un pais</option>
       {country.map(d=>(
       <option value={d[0]}>{d[1]}</option>
       ))} 
     </select>
     <select>
       <option value="0">Seleccione un tipo de documento</option>
       {docType.map(d=>(
       <option value={d[0]}>{d[1]}</option>
       ))}
     </select>
     <Input
       type="text"
       placeholder="Ingrese su numero de documento"
       lblText="No. Documento"
     />
     <Input 
       type="email"
       placeholder="Ingrese su direccion de correo electronico"
       lblText="Correo electronico"
     />
     <Input 
       type="text"
       placeholder="Ingrese su  numero telefonico"
       lblText="Numero telefonico"
     />
     <Input 
       type="password"
       placeholder="Ingrese su contraseña"
       lblText="Contraseña"
     />
     <Input 
       type="password"
       placeholder="Confirme su contraseña"
       lblText="Contraseña"
     />
     <Button
       type="signin"
       text="Crear cuenta" 
       Icon={BsPersonFillAdd}
     />
     <div className={signin_btn}>
        <span>Ya tienes cuenta?<Link to="/">Iniciar sesion</Link></span>  
     </div>
    </div>
  )
}
