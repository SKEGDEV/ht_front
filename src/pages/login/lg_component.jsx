import styles from "./login.module.scss";
import Input from '../../components/input/input.jsx';
import Button from '../../components/button/button.jsx';
import Select from "../../components/select/select";
import {Link, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {notify} from '../../utils/notify.js';
import {consume_api, Api_routes} from '../../utils/consume_api.js';
import { useDispatch, useSelector } from "react-redux";
import { sessionUserAction } from "../../actions/sessionAction";
import { lock_uiAction } from "../../actions/lock_uiActions";
import {RiLoginBoxFill} from "react-icons/ri";
import {BsPersonFillAdd} from 'react-icons/bs';
import tools from "../../utils/tools";

export function Signin(){
  const {lg_form, signup_btn} = styles; 
  const [signin_form, setSignin_form] = useState({
    "document_type":"0",
    "country_id":"0",
    "document_number":"",
    "password":""
  });
  const {document_number, password, document_type, country_id} = signin_form;
  const [country, setCountry] = useState([]);
  const [docType, setDocType] = useState([]);
  const [country_doc, setCountry_doc] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {session:{isLogged, stateSessionToken}} = useSelector(state => state);

  const isAuth = async()=>{
    const request = new consume_api(Api_routes.get_verifySession, {}, stateSessionToken);
    const response = await request.get_petitions();
    if(isLogged && response["msm"] === "success"){
      navigate(`/Home`);
      return;
    }
    
  }

  const get_catalogs = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const get_country = new consume_api(Api_routes.get_createAccountCountryCatalog,{},"");  
    setCountry(await get_country.get_petitions());
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
    return; 
  }
  const [oValidate, setOValidate] = useState({
    documentInput:{
      expression:'',
      validMessage:''
    } 
  });

  const set_lg_params =async (name, value) =>{
    name === "country_id"?
    setSignin_form({
      ...signin_form,
      [name]:value,
      ["document_type"]:"0"
    })
    :
    setSignin_form({
      ...signin_form,
      [name]:value 
    });
    if(name === "country_id"){ 
      dispatch(lock_uiAction({action:1, value:true}));
      setCountry_doc("");
      const get_doc = new consume_api(Api_routes.get_createAccountDocumentCatalog+value,{},"");
      setDocType(await get_doc.get_petitions());  
      setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
      return;
    }
    if(name === "document_type"){
      var type = "";
      var expression='';
      var msm = '';

      docType.map(d=>{
	if(d[0]==value){
	  type=`${d[1]}`
	  expression=`${d[2]}`
	  msm=d[3]
	}
      });
      setCountry_doc(type);
      setOValidate({
	...oValidate,
	documentInput:{
	  expression:expression,
	  validMessage:msm
	}
      });
      return;
    }
  }

  useEffect(()=>{
    isAuth();
    get_catalogs();
  },[]);
  
  const signin = async()=>{
    if(!document_number || !password){
      const valid_msm = new notify("Todos los campos son obligatorios por favor completelos");
      valid_msm.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const call_signin = new consume_api(Api_routes.post_Signin, signin_form, ""); 
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
     <Select
       options={country}
       msm="su pais de residencia"
       name="country_id"
       get_value={set_lg_params}
       set_value={country_id}
     />
     <Select
       options={docType}
       msm="el tipo de documento a utilizar"
       name="document_type"
       get_value={set_lg_params}
       set_value={document_type}
       is_disabled={country_id > 0? false:true}
     />
      <Input
       type="text"
       placeholder={`Ingrese su No.${country_doc}`}
       lblText="No. Documento"
       set_value={document_number}
       get_value={set_lg_params}
       name="document_number"
       is_disabled={document_type>0?false:true}
       itemValid={oValidate.documentInput}
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
        <Link to="/signup">{`Aun no tienes cuenta? Crear cuenta`}</Link> 
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
  const oTools = new tools();

  const{first_name, last_name, school_name, school_direction, birthday, usr_password, confirm_password, document, email, phone, document_type, country_id}=params;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oValidate, setOValidate] = useState({
    documentInput:{
      expression:'',
      validMessage:''
    },
    emailInput:{
      expression:'^[^@]+@[^@]+\.[a-zA-Z]{2,}$',
      validMessage:'Ejemplo: ejemplo@mail.com'
    },
    numberInput:{
      expression:'^[0-9]{8}$',
      validMessage:'Ejemplo: 12345678'
    }
  });

  const get_catalogs = async()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const get_country = new consume_api(Api_routes.get_createAccountCountryCatalog,{},"");  
    setCountry(await get_country.get_petitions());
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
    return; 
  }

  const get_params= async(name, value)=>{
    name === "country_id"?
    setParams({
      ...params,
      [name]:value,
      ["document_type"]:"0"
    })
    :
    setParams({
      ...params,
      [name]:value 
    });
    if(name === "country_id"){ 
      dispatch(lock_uiAction({action:1, value:true}));
      setCountry_doc("");
      const get_doc = new consume_api(Api_routes.get_createAccountDocumentCatalog+value,{},"");
      setDocType(await get_doc.get_petitions()); 
      var code="";
      country.map(d=>{
	if(d[0]==value){
	  code = `${d[2]}`; 
	}
      });
      setRegionCode(code); 
      setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
      return;
    }
    if(name === "document_type"){
      var type = "";
      var expression='';
      var msm = '';

      docType.map(d=>{
	if(d[0]==value){
	  type=`${d[1]}`
	  expression=`${d[2]}`
	  msm=d[3]
	}
      });
      setCountry_doc(type);
      setOValidate({
	...oValidate,
	documentInput:{
	  expression:expression,
	  validMessage:msm
	}
      });
      return;
    }
  }

  const clean_params=()=>{
    if(!first_name || !last_name || !usr_password || !confirm_password || !email || !phone || !document_type || !country_id){
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
    if(!oTools.validateRegEx({regExp:oValidate.documentInput.expression, plainText:document})){
      const documentNotValid = new notify("Por favor ingrese un numero de documento valido");
      documentNotValid.warning();
      return false;
    }
    if(!oTools.validateRegEx({regExp:oValidate.emailInput.expression, plainText:email}) || !oTools({regExp:oValidate.numberInput.expression, plainText:phone})){
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
    const create_account = new consume_api(Api_routes.post_Signup, params, "");
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
      return;
    }
    const userExist = new notify(msm);
    userExist.warning();
    dispatch(lock_uiAction({action:1, value:false}));
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
       is_disabled={country_id > 0? false:true}
     />
     <Input
       type="text"
       placeholder={`Ingrese su No. De ${country_doc}`}
       name="document"
       get_value={get_params}
       set_value={document}
       is_disabled={document_type > 0? false:true}
       itemValid={oValidate.documentInput}
     />
     <Input 
       type="email"
       placeholder="Ingrese su direccion de correo electronico"
       lblText="Correo electronico"
       name="email"
       get_value={get_params}
       set_value={email}
       itemValid={oValidate.emailInput}
     />
     <Input 
       type="number"
       placeholder={`Ingrese su  numero telefonico ${region_code}`}
       name="phone"
       get_value={get_params}
       set_value={phone}
       itemValid={oValidate.numberInput}
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
        <Link to="/">{`Ya tienes cuenta? iniciar sesion`}</Link>  
     </div>
    </div>
  )
}
