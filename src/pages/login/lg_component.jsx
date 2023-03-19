import styles from "./login.module.scss";
import Input from '../../components/input/input.jsx';
import Button from '../../components/button/button.jsx';
import {Link} from 'react-router-dom';

export function Signin(){
  const {lg_form, signup_btn} = styles;
  
  return(
    <> 
      <div className={lg_form}>
      <Input
       type="text"
       placeholder="Ingrese su numero de documento"
       lblText="No. Documento"
      />
      <Input
       type="password"
       placeholder="Ingrese su contraseña"
       lblText="Contraseña"
      />
       <a href="#">Olvido su contraseña?</a>
      <Button
       type="success"
       text="Iniciar sesion"
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
     <select id="" name="">
       <option value="">Seleccione un pais</option>
     </select>
     <select id="" name="">
       <option value="">Seleccione un tipo de documento</option>
     </select>
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
