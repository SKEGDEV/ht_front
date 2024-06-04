import styles from './profile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { navigation_Actions } from '../../actions/navigationActions';
import { useState, useEffect } from 'react';
import {MdPassword} from 'react-icons/md';
import {FaUserEdit, FaBackward, FaUserCog} from 'react-icons/fa';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import { consume_api, Api_routes } from '../../utils/consume_api';
import { lock_uiAction } from '../../actions/lock_uiActions';
import {notify} from '../../utils/notify';
import { useNavigate } from 'react-router-dom';

export default function Profile(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {stateSessionToken} = useSelector(state => state.session);
  const {frm_container, frm_btn, identifier, frm_card, frm_input} = styles;
  const [params, setParams] = useState({
    first_name:"",
    last_name:"",
    school_name:"",
    school_direction:"",
    email:"",
    phone_number:"0"
  });
  const [pParams, setPParams] = useState({
    new_password:"",
    confirm_newPassword:""
  });

  const onChangeParams = (name, value)=>{
    setParams({
      ...params,
      [name]:value
    });
  }

  const onChangePasswordParams = (name, value)=>{
    setPParams({
      ...pParams,
      [name]:value
    })
  }

  const openModal = (variant)=>{
    dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:'Esta seguro de realizar estos cambios, afectaran directamente a su cuenta de usuario',
	type:3,
	exec:()=>{variant === 1 ? updateInfoEvent() : updatePasswordEvent()}
      }}));

  }

  const updateInfoEvent = async ()=>{
    if(params.first_name === "" || params.last_name === "" || params.school_name === "" || params.school_direction === "" || params.email === "" || params.phone_number < 10000000 ){
      const notValid = new notify('Todos los campos son requeridos por favor completarlos');
      notValid.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(Api_routes.put_updateTeacher, params, stateSessionToken);
    const response = await request.put_petitions();
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))});
    dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:response,
	type:1,
	exec:()=>{get_UserInfo()}
      }}));
  }

  const updatePasswordEvent = async()=>{
    var notValid;
    if(pParams.new_password === "" || pParams.confirm_newPassword === ""){
      notValid = new notify('Debe llenar ambos campos de contraseña');
      notValid.warning();
      return;
    }
    if(pParams.new_password !== pParams.confirm_newPassword){
      notValid = new notify('Ambas contraseña deben coincidir');
      notValid.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(Api_routes.put_updateTeacherPassword, pParams, stateSessionToken);
    const response = await request.put_petitions();
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))});
    dispatch(lock_uiAction({action:2, value:{
	isOpen:true,
	message:response,
	type:1,
	exec:()=>{get_UserInfo();}
      }}));
  }

  const get_UserInfo = async ()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(Api_routes.get_teacher2Update, {}, stateSessionToken);
    const response = await request.get_petitions();
    if(response['msm']){
      const errorNotify = new notify(response['msm']);
      errorNotify.error();
      dispatch(lock_uiAction({action:1, value:false}));
      return;
    }
    response.map(d=>{
      setParams({
	...params,
        first_name:d[0],
        last_name:d[1],
        school_name:d[2],
        school_direction:d[3],
        email:d[4],
        phone_number:d[5]
      })
    });
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},250);
  }

  useEffect(()=>{
    dispatch(navigation_Actions(6));
    get_UserInfo();
  },[])

  return(
    <div className={frm_container}>
      <div className={frm_card}>
        <div className={identifier}>
          <h4>{`Informacion personal del usuario `}<FaUserCog/></h4>
        </div>
        <div className={frm_input}>
          <Input
           set_value={params.first_name}
           type="text"
           placeholder="Ingrese su/sus nombres"
           name="first_name"
           get_value={onChangeParams}
          />
          <Input
           set_value={params.last_name}
           type="text"
           placeholder="Ingrese su/sus apellidos"
           name="last_name"
           get_value={onChangeParams}
          />
          <Input
           set_value={params.school_name}
           type="text"
           placeholder="Ingrese el nombre del establecimiento"
           name="school_name"
           get_value={onChangeParams}
          />
          <Input
           set_value={params.school_direction}
           type="text"
           placeholder="Ingrese la direccion del establecimiento"
           name="school_direction"
           get_value={onChangeParams}
          />
          <Input
           set_value={params.email}
           type="email"
           placeholder="Ingrese su email personal"
           name="email"
           get_value={onChangeParams}
          />
          <Input
           set_value={params.phone_number}
           type="number"
           placeholder="Ingrese su numero telefonico personal"
           name="phone_number"
           get_value={onChangeParams}
          />
        </div>
        <div className={frm_btn}>
          <Button
           Icon={FaUserEdit}
           type="warning"
           text="Actualizar su informacion personal"
           get_value={onChangeParams}
           press_btn={()=>{openModal(1);}}
          />
        </div>
      </div>
      <div className={frm_card}>
        <div className={identifier}>
          <h4>{`Actualizar contraseña del usuario `}<MdPassword/> </h4>
        </div>
        <div className={frm_input}>
          <Input
           set_value={pParams.new_password}
           type="password"
           placeholder="Ingrese su nueva contraseña"
           name="new_password"
           get_value={onChangePasswordParams}
          />
          <Input 
           set_value={pParams.confirm_newPassword}
           type="password"
           placeholder="Confirme su nueva contraseña"
           name="confirm_newPassword"
           get_value={onChangePasswordParams}
          />
        </div>
        <div className={frm_btn}>
          <Button
           Icon={FaUserEdit}
           type="warning"
           text="Actualizar su contraseña"
           press_btn={()=>{openModal(2);}}
         />
        </div>
      </div>
      <div className={frm_btn}>
        <Button
         Icon={FaBackward}
         type="danger"
         text="Regresar al inicio"
         press_btn={()=>{navigate('/Home');}}
       />
      </div>
    </div>
  )
}
