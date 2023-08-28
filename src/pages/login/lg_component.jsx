import styles from "./login.module.scss";
import Input from '../../components/input/input.jsx';
import Button from '../../components/button/button.jsx';
import Select from "../../components/select/select";
import {Link, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {notify} from '../../utils/notify.js';
import {consume_api} from '../../utils/consume_api.js';
import { useDispatch, useSelector } from "react-redux";
import { sessionUserAction } from "../../actions/sessionAction";
import { lock_uiAction } from "../../actions/lock_uiActions";
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
  const {session:{isLogged, stateSessionToken}} = useSelector(state => state);

  const isAuth = async()=>{
    const request = new consume_api("/auth/verify-session", {}, stateSessionToken);
    const response = await request.get_petitions();
    if(isLogged && response["msm"] === "success"){
      navigate(`/Home`);
      return;
    }
    
  }

  const set_lg_params = (name, value) =>{
    setSignin_form({
      ...signin_form,
      [name]:value
    });
  }

  useEffect(()=>{
    isAuth();
  },[]);
  
  const signin = async()=>{
    if(!document_number || !password){
      const valid_msm = new notify("Todos los campos son obligatorios por favor completelos");
      valid_msm.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const call_signin = new consume_api("/auth/login", signin_form, ""); 
    const data = await call_signin.post_petitions(); 
    const{token, msm, name} = data;
    if(token){
      dispatch(sessionUserAction({sessionToken:token, sessionName:name, isLogged:true})); 
      setTimeout(()=>{dispatch(lock_uiAction({action:1,value:false}));}, 500); 
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:msm,
	type:1,
	exec:()=>{navigate("/Home");}
      }}));
      return;
    } 
    dispatch(lock_uiAction({action:1, value:false}));
    const danger_alert = new notify(msm);
    danger_alert.error();
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
  const [params, setParams] = useState({
    "first_name":"",
    "last_name":"",
    "school_name":"",
    "school_direction":"",
    "birthday":"",
    "usr_password":"",
    "confirm_password":"",
    "document":"",
    "email":"",
    "phone":"",
    "document_type":"0",
    "country_id":"0"
  });
  const [region_code, setRegionCode] = useState("");
  const [country_doc, setCountry_doc] = useState("");

  const{first_name, last_name, school_name, school_direction, birthday, usr_password, confirm_password, document, email, phone, document_type, country_id}=params;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const get_catalogs = async()=>{
    const get_country = new consume_api("/catalogs/get-catalog/1/0",{},"");  
    setCountry(await get_country.get_petitions());
    return; 
  }

  const get_params= async(name, value)=>{
    setParams({
      ...params,
      [name]:value
    });
    if(name === "country_id"){ 
      const get_doc = new consume_api("/catalogs/get-catalog/2/"+value,{},"");
      setDocType(await get_doc.get_petitions()); 
      var code="";
      country.map(d=>{
	if(d[0]==value){
	  code = `+${d[2]} ${d[3]}`; 
	}
      });
      setRegionCode(code);
      return;
    }
    if(name === "document_type"){
      var type = "";
      docType.map(d=>{
	if(d[0]==value){
	  type=`No. ${d[1]}`
	}
      });
      setCountry_doc(type);
    }
  }

  const clean_params=()=>{
    if(!first_name || !last_name || !usr_password || !confirm_password || !document || !email || !phone || !document_type || !country_id){
      return false
    }
    if(usr_password !== confirm_password){
      const password_noMatch = new notify("Las contraseñas no son iguales por favor verifique que concuerden");
      password_noMatch.warning();
      return false;
    }
    if(!validate_age()){
      const isKid = new notify("Se requiere que el usuario sea mayor de edad");
      isKid.warning();
      return false;
    }
    return true
  }

  const validate_age=()=>{
    var date_birthday = new Date(birthday);
    var date_today = new Date();
    var age = date_today.getFullYear() - date_birthday.getFullYear();
    if(age>=18){
      return true;
    }
    return false;
  }

  const signup = async()=>{
    if(!clean_params()){
      const incorrect_params = new notify("Ocurrio un error de validacion, por favor verfique que todos sus datos sean correctos");
      incorrect_params.warning();
      return;
    }
    dispatch(lock_uiAction({action:1,value:true}));
    const create_account = new consume_api("/auth/create-account", params, "");
    const data = await create_account.post_petitions();
    const {token, msm, name} = data
    if(token){
      dispatch(sessionUserAction({sessionToken:token, sessionName:name, isLogged:true})); 
      setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 500);     
      dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:msm,
	type:1,
	exec:()=>{navigate("/Home");}
      }}));
    }
    setParams({
      ...params,
      "first_name":"",
      "last_name":"",
      "school_name":"",
      "school_direction":"",
      "birthday":"",
      "usr_password":"",
      "confirm_password":"",
      "document":"",
      "email":"",
      "phone":"",
      "document_type":"0",
      "country_id":"0"
    });
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
       name="first_name"
       get_value={get_params}
       set_value={first_name}
     />
     <Input
       type="text"
       placeholder="Ingrese sus apellidos"
       lblText="Apellidos"
       name="last_name"
       get_value={get_params}
       set_value={last_name}
     />
     <Input 
       type="text"
       placeholder="Ingrese el nombre del establecimiento"
       lblText="Nombres"
       name="school_name"
       get_value={get_params}
       set_value={school_name}
     />
     <Input
       type="text"
       placeholder="Ingrese la direccion del establecimiento"
       lblText="Apellidos"
       name="school_direction"
       get_value={get_params}
       set_value={school_direction}
     />
     <Input
       type="date"
       placeholder="Ingrese su fecha de cumpleaños"
       lblText="Cumpleaños"
       name="birthday"
       get_value={get_params}
       set_value={birthday}
     />
     <Select
       options={country}
       msm="su pais de residencia"
       name="country_id"
       get_value={get_params}
       set_value={country_id}
     />
     <Select
       options={docType}
       msm="el tipo de documento a utilizar"
       name="document_type"
       get_value={get_params}
       set_value={document_type}
     />
     <Input
       type="text"
       placeholder="Ingrese su numero de documento"
       lblText={"No. Documento "+country_doc}
       name="document"
       get_value={get_params}
       set_value={document}
     />
     <Input 
       type="email"
       placeholder="Ingrese su direccion de correo electronico"
       lblText="Correo electronico"
       name="email"
       get_value={get_params}
       set_value={email}
     />
     <Input 
       type="number"
       placeholder="Ingrese su  numero telefonico"
       lblText={"Numero telefonico "+region_code}
       name="phone"
       get_value={get_params}
       set_value={phone}
     />
     <Input 
       type="password"
       placeholder="Ingrese su contraseña"
       lblText="Contraseña"
       name="usr_password"
       get_value={get_params}
       set_value={usr_password}
     />
     <Input 
       type="password"
       placeholder="Confirme su contraseña"
       lblText="Contraseña"
       name="confirm_password"
       get_value={get_params}
       set_value={confirm_password}
     />
     <Button
       type="signin"
       text="Crear cuenta" 
       Icon={BsPersonFillAdd}
       press_btn={signup}
     />
     <div className={signin_btn}>
        <span>Ya tienes cuenta?<Link to="/">Iniciar sesion</Link></span>  
     </div>
    </div>
  )
}
