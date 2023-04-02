import styles from "./login.module.scss";
import Input from '../../components/input/input.jsx';
import Button from '../../components/button/button.jsx';
import {Link, Navigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {notify} from '../../utils/notify.js';
import {consume_api} from '../../utils/consume_api.js';

export function Signin(){
  const {lg_form, signup_btn} = styles;
  const [no_document, setNo_document] = useState("");
  const [password, setPassword] = useState("");
  
  const signin = async()=>{
    if(no_document ==="" || password===""){
      const valid_msm = new notify("Todos los campos son obligatorios por favor completelos");
      valid_msm.warning();
      return;
    }
    const params = {
      "document_number":no_document,
      "password":password
    }
    const call_signin = new consume_api("/auth/login", params, ""); 
    await call_signin.post_petitions(); 
    setPassword("");
    setNo_document("");
  }
  
  return(
    <> 
      <div className={lg_form}>
      <Input
       type="text"
       placeholder="Ingrese su numero de documento"
       lblText="No. Documento"
       set_value={no_document}
       get_value={setNo_document}
      />
      <Input
       type="password"
       placeholder="Ingrese su contraseña"
       lblText="Contraseña"
       set_value={password}
       get_value={setPassword}
      />
       <a href="#">Olvido su contraseña?</a>
      <Button
       type="success"
       text="Iniciar sesion" 
       press_btn={signin}
      />  
       <div className={signup_btn}>
        <p>Aun no tienes cuenta?<Link to="/signup"><span>Crear cuenta</span></Link></p>  
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
       type="success"
       text="Crear cuenta" 
     />
     <div className={signin_btn}>
        <p>Ya tienes cuenta?<Link to="/"><span>Iniciar sesion</span></Link></p>  
     </div>
    </div>
  )
}
